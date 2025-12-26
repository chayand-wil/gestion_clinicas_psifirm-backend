import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { SharedAuthService } from './shared-auth.service';
import { VerificationService } from './verification.service';
import { RegisterEmployeeDto } from '../dto/register-employee.dto';
import { Prisma } from '@prisma/client';

/**
 * Servicio especializado para registro de empleados
 */
@Injectable()
export class EmployeeRegistrationService {
  constructor(
    private prisma: PrismaService,
    private sharedAuth: SharedAuthService,
    private verification: VerificationService,
  ) {}

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

    // Verificar que los roles existan
    const roles = await this.prisma.role.findMany({
      where: { id: { in: roleIds } },
    });

    if (roles.length !== roleIds.length) {
      throw new BadRequestException('Uno o más roles no existen');
    }

    // Hashear la contraseña
    const hashedPassword = await this.sharedAuth.hashPassword(password);

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
          licenseNumber: employeeData.licenseNumber,
          isActive: false,
        },
      });

      return newUser;
    });

    // Enviar código de verificación
    await this.verification.sendVerificationCode(email, user.id);

    return {
      message:
        'Empleado registrado exitosamente. Se ha enviado un código de verificación al correo.',
      email: user.email,
    };
  }
}
