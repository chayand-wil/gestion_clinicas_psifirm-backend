import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { SharedAuthService } from './shared-auth.service';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';
import { Prisma } from '@prisma/client';

/**
 * Servicio especializado para gestión de usuarios, empleados y pacientes
 */
@Injectable()
export class UserManagementService {
  constructor(
    private prisma: PrismaService,
    private sharedAuth: SharedAuthService,
  ) {}

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
        const hashedPassword = await this.sharedAuth.hashPassword(password);
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
        employeeUpdateData.baseSalary = baseSalary
          ? new Prisma.Decimal(baseSalary)
          : null;
      }
      if (sessionRate !== undefined) {
        employeeUpdateData.sessionRate = sessionRate
          ? new Prisma.Decimal(sessionRate)
          : null;
      }
      if (licenseNumber !== undefined)
        employeeUpdateData.licenseNumber = licenseNumber;

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
