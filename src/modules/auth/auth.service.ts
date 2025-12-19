import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RegisterPatientDto } from './dto/register-patient.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResendCodeDto } from './dto/resend-code.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  /**
   * Genera un código de 4 dígitos aleatorio
   */
  private generateVerificationCode(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  /**
   * Calcula la fecha de expiración (15 minutos desde ahora)
   */
  private getExpirationDate(): Date {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);
    return expiresAt;
  }

  /**
   * Calcula la fecha de expiración del token de recuperación (60 minutos desde ahora)
   */
  private getPasswordResetExpiration(): Date {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 60);
    return expiresAt;
  }

  /**
   * Envía el código de verificación por correo (simulado)
   * En producción, usar un servicio como SendGrid, AWS SES, etc.
   */
  private async sendVerificationEmail(email: string, code: string): Promise<void> {
    await this.emailService.sendVerificationCode(email, code);
  }

  /**
   * Registra un nuevo usuario
   */
  async register(registerDto: RegisterDto) {
    const { email, username, password } = registerDto;

    // Verificar si el usuario ya existe
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      throw new ConflictException('El email o usuario ya está registrado');
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    const user = await this.prisma.user.create({
      data: {
        email,
        username,
        passwordHash: hashedPassword,
        isActive: true,
        isEmailVerified: false,
      },
    });

    // Generar código de verificación
    const code = this.generateVerificationCode();
    const expiresAt = this.getExpirationDate();

    // Guardar código en BD
    await this.prisma.emailVerification.create({
      data: {
        userId: user.id,
        code,
        expiresAt,
      },
    });

    // Enviar código por correo
    await this.sendVerificationEmail(email, code);

    return {
      message: 'Usuario registrado exitosamente. Se ha enviado un código de verificación al correo.',
      email: user.email,
    };
  }

  /**
   * Registra un nuevo paciente con su perfil completo
   */
  async registerPatient(registerPatientDto: RegisterPatientDto) {
    const { email, username, password, ...patientData } = registerPatientDto;

    // Verificar si el usuario ya existe
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      throw new ConflictException('El email o usuario ya está registrado');
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario y paciente en una transacción
    const user = await this.prisma.$transaction(async (prisma) => {
      // Crear usuario
      const newUser = await prisma.user.create({
        data: {
          email,
          username,
          passwordHash: hashedPassword,
          isActive: true,
          isEmailVerified: false,
        },
      });

      // Asignar rol de paciente
      const patientRole = await prisma.role.findUnique({
        where: { name: 'paciente' },
      });

      if (patientRole) {
        await prisma.userRole.create({
          data: {
            userId: newUser.id,
            roleId: patientRole.id,
          },
        });
      }

      // Crear perfil de paciente
      await prisma.patient.create({
        data: {
          userId: newUser.id,
          firstName: patientData.firstName,
          lastName: patientData.lastName,
          birthDate: new Date(patientData.birthDate),
          gender: patientData.gender,
          civilStatus: patientData.civilStatus,
          occupation: patientData.occupation,
          educationLevel: patientData.educationLevel,
          phone: patientData.phone,
          email: email,
          address: patientData.address,
          emergencyName: patientData.emergencyName,
          emergencyPhone: patientData.emergencyPhone,
          emergencyRelationship: patientData.emergencyRelationship,
          alcoholUse: patientData.alcoholUse,
          tobaccoUse: patientData.tobaccoUse,
          isActive: true,
        },
      });

      return newUser;
    });

    // Generar código de verificación
    const code = this.generateVerificationCode();
    const expiresAt = this.getExpirationDate();

    // Guardar código en BD
    await this.prisma.emailVerification.create({
      data: {
        userId: user.id,
        code,
        expiresAt,
      },
    });

    // Enviar código por correo
    await this.sendVerificationEmail(email, code);

    return {
      message: 'Paciente registrado exitosamente. Se ha enviado un código de verificación al correo.',
      email: user.email,
    };
  }

  /**
   * Verifica el correo con el código proporcionado
   */
  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const { email, code } = verifyEmailDto;

    // Buscar el usuario
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    // Si ya está verificado
    if (user.isEmailVerified) {
      throw new BadRequestException('El correo ya ha sido verificado');
    }

    // Buscar la verificación pendiente
    const emailVerification = await this.prisma.emailVerification.findFirst({
      where: {
        userId: user.id,
        isUsed: false,
      },
    });

    if (!emailVerification) {
      throw new BadRequestException('No hay un código de verificación pendiente. Solicita uno nuevo.');
    }

    // Verificar si el código ha expirado
    if (new Date() > emailVerification.expiresAt) {
      throw new BadRequestException('El código de verificación ha expirado');
    }

    // Verificar máximo de intentos
    if (emailVerification.attempts >= emailVerification.maxAttempts) {
      throw new BadRequestException('Máximo de intentos alcanzado. Solicita un nuevo código.');
    }

    // Verificar el código
    if (emailVerification.code !== code) {
      // Incrementar intentos
      await this.prisma.emailVerification.update({
        where: { id: emailVerification.id },
        data: { attempts: emailVerification.attempts + 1 },
      });

      const remainingAttempts = emailVerification.maxAttempts - emailVerification.attempts - 1;
      throw new BadRequestException(
        `Código incorrecto. Tienes ${remainingAttempts} intentos restantes.`,
      );
    }

    // Marcar como usado y verificar el correo
    await Promise.all([
      this.prisma.emailVerification.update({
        where: { id: emailVerification.id },
        data: {
          isUsed: true,
          usedAt: new Date(),
        },
      }),
      this.prisma.user.update({
        where: { id: user.id },
        data: { isEmailVerified: true },
      }),
    ]);

    return {
      message: 'Correo verificado exitosamente',
      email: user.email,
      verified: true,
    };
  }

  /**
   * Reenvía el código de verificación
   */
  async resendVerificationCode(resendCodeDto: ResendCodeDto) {
    const { email } = resendCodeDto;

    // Buscar el usuario
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('El correo ya ha sido verificado');
    }

    // Marcar códigos anteriores como usados
    await this.prisma.emailVerification.updateMany({
      where: {
        userId: user.id,
        isUsed: false,
      },
      data: { isUsed: true },
    });

    // Generar nuevo código
    const code = this.generateVerificationCode();
    const expiresAt = this.getExpirationDate();

    // Guardar nuevo código
    await this.prisma.emailVerification.create({
      data: {
        userId: user.id,
        code,
        expiresAt,
      },
    });

    // Enviar código
    await this.sendVerificationEmail(email, code);

    return {
      message: 'Se ha enviado un nuevo código de verificación al correo',
      email: user.email,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
        employee: true,
        patient: true,
      },
    });

    if (!user || !user.passwordHash || user.isActive === false) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar que el correo esté verificado
    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Debes verificar tu correo antes de iniciar sesión');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    const roleNames = user.roles
      .map((relation) => relation.role?.name)
      .filter((name): name is string => Boolean(name));

    const payload = {
      sub: user.id,
      email: user.email,
      roles: roleNames,
    };

    const displayName = user.employee
      ? `${user.employee.firstName} ${user.employee.lastName}`
      : user.patient
        ? `${user.patient.firstName} ${user.patient.lastName}`
        : user.username;

    return {
      access_token: this.jwtService.sign(payload),
      usuario: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName,
        roles: roleNames,
        employeeId: user.employee?.id,
        patientId: user.patient?.id,
      },
    };
  }

  async validateUser(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
        employee: true,
        patient: true,
      },
    });
  }

  /**
   * Genera y envía un token de recuperación de contraseña
   */
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Mantener consistencia con el estilo actual (errores explícitos)
      throw new BadRequestException('Usuario no encontrado');
    }

    const recoveryToken = randomBytes(32).toString('hex');
    const recoveryExpiresAt = this.getPasswordResetExpiration();

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        recoveryToken,
        recoveryExpiresAt,
      },
    });

    await this.emailService.sendPasswordResetEmail(email, recoveryToken);

    return {
      message: 'Se ha enviado un correo con instrucciones para reestablecer tu contraseña',
      email,
      // No exponemos el token en respuesta
    };
  }

  /**
   * Reestablece la contraseña usando el token de recuperación
   */
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, newPassword } = resetPasswordDto;

    const user = await this.prisma.user.findFirst({
      where: {
        recoveryToken: token,
        recoveryExpiresAt: {
          gte: new Date(),
        },
      },
    });

    if (!user) {
      throw new BadRequestException('Token inválido o expirado');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: hashedPassword,
        recoveryToken: null,
        recoveryExpiresAt: null,
      },
    });

    return {
      message: 'Contraseña actualizada exitosamente',
      email: user.email,
    };
  }
}
