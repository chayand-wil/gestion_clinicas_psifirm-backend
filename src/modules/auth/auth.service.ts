import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RegisterPatientDto } from './dto/register-patient.dto';
import { RegisterEmployeeDto } from './dto/register-employee.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResendCodeDto } from './dto/resend-code.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { randomBytes } from 'crypto';
import { Prisma } from '@prisma/client';

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
  private async sendVerificationEmail(
    email: string,
    code: string,
  ): Promise<void> {
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
      message:
        'Usuario registrado exitosamente. Se ha enviado un código de verificación al correo.',
      email: user.email,
    };
  }

  /**
   * Registra un nuevo paciente con su perfil completo
   */
  async registerPatient(registerPatientDto: RegisterPatientDto) {
    // destructuring con rest operator (...) en JavaScript/TypeScript.
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
      message:
        'Paciente registrado exitosamente. Se ha enviado un código de verificación al correo.',
      email: user.email,
    };
  }

  /**
   * Registra un nuevo empleado con su perfil completo
   */
  async registerEmployee(registerEmployeeDto: RegisterEmployeeDto) {
    const { email, username, password, roleIds, ...employeeData } =
      registerEmployeeDto;

    // Verificar si el usuario ya existe
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      throw new ConflictException('El email o usuario ya está registrado');
    }

    // // Verificar que el área de especialidad exista
    // const specialtyArea = await this.prisma.specialtyArea.findUnique({
    //   where: { id: employeeData.specialtyAreaId },
    // });

    // if (!specialtyArea) {
    //   throw new BadRequestException('El área de especialidad no existe');
    // }

    // Verificar que los roles existan
    const roles = await this.prisma.role.findMany({
      where: { id: { in: roleIds } },
    });

    if (roles.length !== roleIds.length) {
      throw new BadRequestException('Uno o más roles no existen');
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario y empleado en una transacción
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

      // Asignar roles
      for (const roleId of roleIds) {
        await prisma.userRole.create({
          data: {
            userId: newUser.id,
            roleId: roleId,
          },
        });
      }

      // Crear perfil de empleado
      await prisma.employee.create({
        data: {
          userId: newUser.id,
          firstName: employeeData.firstName,
          lastName: employeeData.lastName,
          specialtyAreaId: employeeData.specialtyAreaId,
          contractType: employeeData.contractType,
          paymentType: employeeData.paymentType,
          baseSalary: employeeData.baseSalary
            ? new Prisma.Decimal(employeeData.baseSalary)
            : null,

          sessionRate: employeeData.sessionRate
            ? new Prisma.Decimal(employeeData.sessionRate)
            : null,

          // baseSalary: new Prisma.Decimal(employeeData.baseSalary),
          // sessionRate: new Prisma.Decimal(employeeData.sessionRate),
          licenseNumber: employeeData.licenseNumber,
          isActive: false,
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
      message:
        'Empleado registrado exitosamente. Se ha enviado un código de verificación al correo.',
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
      throw new BadRequestException(
        'No hay un código de verificación pendiente. Solicita uno nuevo.',
      );
    }

    // Verificar si el código ha expirado
    if (new Date() > emailVerification.expiresAt) {
      throw new BadRequestException('El código de verificación ha expirado');
    }

    // Verificar máximo de intentos
    if (emailVerification.attempts >= emailVerification.maxAttempts) {
      throw new BadRequestException(
        'Máximo de intentos alcanzado. Solicita un nuevo código.',
      );
    }

    // Verificar el código
    if (emailVerification.code !== code) {
      // Incrementar intentos
      await this.prisma.emailVerification.update({
        where: { id: emailVerification.id },
        data: { attempts: emailVerification.attempts + 1 },
      });

      const remainingAttempts =
        emailVerification.maxAttempts - emailVerification.attempts - 1;
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
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
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
      throw new UnauthorizedException(
        'Debes verificar tu correo antes de iniciar sesión',
      );
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

    // Recopilar permisos únicos de todos los roles del usuario
    const permissionsSet = new Set<string>();
    user.roles.forEach((userRole) => {
      userRole.role?.permissions?.forEach((rolePermission) => {
        if (rolePermission.permission?.name) {
          permissionsSet.add(rolePermission.permission.name);
        }
      });
    });
    const permissions = Array.from(permissionsSet);

    // Payload mínimo para JWT: solo identificador, rol principal y jti corto
    const primaryRole = roleNames[0] ?? 'usuario';
    const payload = {
      sub: user.id,
      role: primaryRole,
      jti: randomBytes(8).toString('hex'),
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
        permissions,
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
      message:
        'Se ha enviado un correo con instrucciones para reestablecer tu contraseña',
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

  /**
   * Actualiza la información de un empleado
   */
  async updateEmployee(updateEmployeeDto: UpdateEmployeeDto) {
    const {
      employeeId,
      email,
      password,
      firstName,
      lastName,
      specialtyAreaId,
      contractType,
      paymentType,
      baseSalary,
      sessionRate,
      licenseNumber,
      roleIds,
    } = updateEmployeeDto;

    // Verificar que el empleado existe
    const employee = await this.prisma.employee.findUnique({
      where: { id: employeeId },
      include: {
        user: true,
      },
    });

    if (!employee) {
      throw new BadRequestException('El empleado no existe');
    }

    // Si se proporciona un nuevo email, verificar que no esté en uso
    if (email && email !== employee.user.email) {
      const existingUser = await this.prisma.user.findFirst({
        where: {
          email,
          id: { not: employee.userId },
        },
      });

      if (existingUser) {
        throw new ConflictException('El email ya está en uso');
      }
    }

    // Si se proporcionan roleIds, verificar que existan
    if (roleIds && roleIds.length > 0) {
      const roles = await this.prisma.role.findMany({
        where: { id: { in: roleIds } },
      });

      if (roles.length !== roleIds.length) {
        throw new BadRequestException('Uno o más roles no existen');
      }
    }

    // Actualizar en una transacción
    const updatedUser = await this.prisma.$transaction(async (prisma) => {
      // Preparar datos para actualizar el usuario
      const userUpdateData: Prisma.UserUpdateInput = {};
      if (email) userUpdateData.email = email;
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        userUpdateData.passwordHash = hashedPassword;
      }

      // Actualizar usuario
      const user = await prisma.user.update({
        where: { id: employee.userId },
        data: userUpdateData,
      });

      // Preparar datos para actualizar el empleado
      const employeeUpdateData: any = {};
      if (firstName !== undefined) employeeUpdateData.firstName = firstName;
      if (lastName !== undefined) employeeUpdateData.lastName = lastName;
      if (specialtyAreaId !== undefined) {
        employeeUpdateData.specialtyAreaId = specialtyAreaId;
      }
      if (contractType !== undefined) employeeUpdateData.contractType = contractType;
      if (paymentType !== undefined) employeeUpdateData.paymentType = paymentType;
      if (baseSalary !== undefined) {
        employeeUpdateData.baseSalary = baseSalary ? new Prisma.Decimal(baseSalary) : null;
      }
      if (sessionRate !== undefined) {
        employeeUpdateData.sessionRate = sessionRate ? new Prisma.Decimal(sessionRate) : null;
      }
      if (licenseNumber !== undefined) employeeUpdateData.licenseNumber = licenseNumber;

      // Actualizar empleado
      await prisma.employee.update({
        where: { id: employeeId },
        data: employeeUpdateData,
      });

      // Actualizar roles si se proporcionan
      if (roleIds && roleIds.length > 0) {
        // Eliminar roles actuales
        await prisma.userRole.deleteMany({
          where: { userId: employee.userId },
        });

        // Crear nuevos roles
        await prisma.userRole.createMany({
          data: roleIds.map((roleId) => ({
            userId: employee.userId,
            roleId,
          })),
        });
      }

      return user;
    });

    return {
      message: 'Empleado actualizado exitosamente',
      email: updatedUser.email,
    };
  }

  /**
   * Obtiene la información de un empleado específico
   */
  async getEmployee(employeeId: number) {
    const employee = await this.prisma.employee.findUnique({
      where: { id: employeeId },
      include: {
        user: {
          include: {
            roles: {
              include: {
                role: true,
              },
            },
          },
        },
      },
    });

    if (!employee) {
      throw new BadRequestException('El empleado no existe');
    }

    return employee;
  }

  /**
   * Obtiene la lista de todos los empleados
   */
  async listEmployees() {
    const employees = await this.prisma.employee.findMany({
      include: {
        user: {
          select: {
            email: true,
            username: true,
            isActive: true,
            roles: {
              include: {
                role: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        specialtyArea: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        firstName: 'asc',
      },
    });

    return employees;
  }

  /**
   * Obtiene la información de un paciente específico
   */
  async getPatient(patientId: number) {
    const patient = await this.prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        user: {
          include: {
            roles: {
              include: {
                role: true,
              },
            },
          },
        },
      },
    });

    if (!patient) {
      throw new BadRequestException('El paciente no existe');
    }

    return patient;
  }

  /**
   * Obtiene la lista de todos los pacientes
   */
  async listPatients() {
    const patients = await this.prisma.patient.findMany({
      include: {
        user: {
          select: {
            email: true,
            username: true,
            isActive: true,
          },
        },
      },
      orderBy: {
        firstName: 'asc',
      },
    });

    return patients;
  }
}
