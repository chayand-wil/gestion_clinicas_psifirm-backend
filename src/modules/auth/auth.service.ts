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
import { SharedAuthService } from './services/shared-auth.service';
import { VerificationService } from './services/verification.service';
import { PasswordRecoveryService } from './services/password-recovery.service';
import { PatientRegistrationService } from './services/patient-registration.service';
import { EmployeeRegistrationService } from './services/employee-registration.service';
import { UserManagementService } from './services/user-management.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
    private sharedAuth: SharedAuthService,
    private verification: VerificationService,
    private passwordRecovery: PasswordRecoveryService,
    private patientRegistration: PatientRegistrationService,
    private employeeRegistration: EmployeeRegistrationService,
    private userManagement: UserManagementService,
  ) {}

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
    const hashedPassword = await this.sharedAuth.hashPassword(password);

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

    // Enviar código de verificación
    await this.verification.sendVerificationCode(email, user.id);

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
    return this.patientRegistration.registerPatient(registerPatientDto);
  }

  /**
   * Registra un nuevo empleado con su perfil completo
   */
  async registerEmployee(registerEmployeeDto: RegisterEmployeeDto) {
    return this.employeeRegistration.registerEmployee(registerEmployeeDto);
  }

  /**
   * Verifica el correo con el código proporcionado
   */
  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    return this.verification.verifyEmail(verifyEmailDto);
  }

  /**
   * Reenvía el código de verificación
   */
  async resendVerificationCode(resendCodeDto: ResendCodeDto) {
    return this.verification.resendVerificationCode(resendCodeDto);
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
    return this.passwordRecovery.forgotPassword(forgotPasswordDto);
  }

  /**
   * Reestablece la contraseña usando el token de recuperación
   */
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    return this.passwordRecovery.resetPassword(resetPasswordDto);
  }

  /**
   * Actualiza la información de un empleado
   */
  async updateEmployee(updateEmployeeDto: UpdateEmployeeDto) {
    return this.userManagement.updateEmployee(updateEmployeeDto);
  }

  /**
   * Obtiene la información de un empleado específico
   */
  async getEmployee(employeeId: number) {
    return this.userManagement.getEmployee(employeeId);
  }

  /**
   * Obtiene la lista de todos los empleados
   */
  async listEmployees() {
    return this.userManagement.listEmployees();
  }

  /**
   * Obtiene la información de un paciente específico
   */
  async getPatient(patientId: number) {
    return this.userManagement.getPatient(patientId);
  }

  /**
   * Obtiene la lista de todos los pacientes
   */
  async listPatients() {
    return this.userManagement.listPatients();
  }
}
