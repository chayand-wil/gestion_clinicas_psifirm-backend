import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { AppointmentStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAppointmentDto: CreateAppointmentDto) {
    // Validar que el paciente existe
    const patient = await this.prisma.patient.findUnique({
      where: { id: createAppointmentDto.patientId },
    });

    if (!patient) {
      throw new NotFoundException(
        `Paciente con ID ${createAppointmentDto.patientId} no encontrado`,
      );
    }

    // Validar que el empleado existe
    const employee = await this.prisma.employee.findUnique({
      where: { id: createAppointmentDto.employeeId },
    });

    if (!employee) {
      throw new NotFoundException(
        `Empleado con ID ${createAppointmentDto.employeeId} no encontrado`,
      );
    }

    // Validar que la sesión existe si se proporciona
    if (createAppointmentDto.sessionId) {
      const session = await this.prisma.therapySession.findUnique({
        where: { id: createAppointmentDto.sessionId },
      });

      if (!session) {
        throw new NotFoundException(
          `Sesión con ID ${createAppointmentDto.sessionId} no encontrada`,
        );
      }
    }

    // Crear la cita
    return this.prisma.appointment.create({
      data: {
        patientId: createAppointmentDto.patientId,
        employeeId: createAppointmentDto.employeeId,
        date: new Date(createAppointmentDto.date),
        status: createAppointmentDto.status,
        cost: createAppointmentDto.cost,
        sessionId: createAppointmentDto.sessionId ?? null,
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async findAll(filters?: {
    patientId?: number;
    employeeId?: number;
    status?: AppointmentStatus;
    fromDate?: Date;
    toDate?: Date;
  }) {
    const where: any = {};

    if (filters?.patientId) {
      where.patientId = filters.patientId;
    }

    if (filters?.employeeId) {
      where.employeeId = filters.employeeId;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.fromDate || filters?.toDate) {
      where.date = {};
      if (filters.fromDate) {
        where.date.gte = filters.fromDate;
      }
      if (filters.toDate) {
        where.date.lte = filters.toDate;
      }
    }

    return this.prisma.appointment.findMany({
      where,
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            birthDate: true,
            gender: true,
          },
        },
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            specialtyArea: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!appointment) {
      throw new NotFoundException(`Cita con ID ${id} no encontrada`);
    }

    return appointment;
  }

  async update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    // Verificar que la cita existe
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      throw new NotFoundException(`Cita con ID ${id} no encontrada`);
    }

    // Validar que el nuevo paciente existe si se proporciona
    if (
      updateAppointmentDto.patientId &&
      updateAppointmentDto.patientId !== appointment.patientId
    ) {
      const patient = await this.prisma.patient.findUnique({
        where: { id: updateAppointmentDto.patientId },
      });

      if (!patient) {
        throw new NotFoundException(
          `Paciente con ID ${updateAppointmentDto.patientId} no encontrado`,
        );
      }
    }

    // Validar que el nuevo empleado existe si se proporciona
    if (
      updateAppointmentDto.employeeId &&
      updateAppointmentDto.employeeId !== appointment.employeeId
    ) {
      const employee = await this.prisma.employee.findUnique({
        where: { id: updateAppointmentDto.employeeId },
      });

      if (!employee) {
        throw new NotFoundException(
          `Empleado con ID ${updateAppointmentDto.employeeId} no encontrado`,
        );
      }
    }

    // Validar que la sesión existe si se proporciona
    if (updateAppointmentDto.sessionId) {
      const session = await this.prisma.therapySession.findUnique({
        where: { id: updateAppointmentDto.sessionId },
      });

      if (!session) {
        throw new NotFoundException(
          `Sesión con ID ${updateAppointmentDto.sessionId} no encontrada`,
        );
      }
    }

    // Actualizar la cita
    return this.prisma.appointment.update({
      where: { id },
      data: {
        patientId: updateAppointmentDto.patientId || undefined,
        employeeId: updateAppointmentDto.employeeId || undefined,
        date: updateAppointmentDto.date
          ? new Date(updateAppointmentDto.date)
          : undefined,
        status: updateAppointmentDto.status ?? undefined,
        cost: updateAppointmentDto.cost || undefined,
        sessionId: updateAppointmentDto.sessionId ?? undefined,
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    // Verificar que la cita existe
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      throw new NotFoundException(`Cita con ID ${id} no encontrada`);
    }

    // Eliminar la cita
    return this.prisma.appointment.delete({
      where: { id },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async findByPatient(patientId: number) {
    const patient = await this.prisma.patient.findUnique({
      where: { id: patientId },
    });

    if (!patient) {
      throw new NotFoundException(`Paciente con ID ${patientId} no encontrado`);
    }

    return this.prisma.appointment.findMany({
      where: { patientId },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            specialtyArea: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });
  }

  async findByEmployee(employeeId: number) {
    const employee = await this.prisma.employee.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      throw new NotFoundException(`Empleado con ID ${employeeId} no encontrado`);
    }

    return this.prisma.appointment.findMany({
      where: { employeeId },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    });
  }

  async findByStatus(status: AppointmentStatus) {
    return this.prisma.appointment.findMany({
      where: { status },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    });
  }
}
