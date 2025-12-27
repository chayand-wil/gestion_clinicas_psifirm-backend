import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEmployeeScheduleDto } from './dto/create-employee-schedule.dto';
import { UpdateEmployeeScheduleDto } from './dto/update-employee-schedule.dto';

@Injectable()
export class EmployeeScheduleService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createEmployeeScheduleDto: CreateEmployeeScheduleDto) {
    // Validar que el empleado existe
    const employee = await this.prisma.employee.findUnique({
      where: { id: createEmployeeScheduleDto.employeeId },
    });

    if (!employee) {
      throw new NotFoundException(
        `Empleado con ID ${createEmployeeScheduleDto.employeeId} no encontrado`,
      );
    }

    // Crear el horario
    return this.prisma.employeeSchedule.create({
      data: {
        employeeId: createEmployeeScheduleDto.employeeId,
        dayOfWeek: createEmployeeScheduleDto.dayOfWeek,
        startTime: new Date(createEmployeeScheduleDto.startTime),
        endTime: new Date(createEmployeeScheduleDto.endTime),
      },
      include: {
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

  async findAll(employeeId?: number) {
    const where: any = {};

    if (employeeId) {
      where.employeeId = employeeId;
    }

    return this.prisma.employeeSchedule.findMany({
      where,
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: [
        {
          employeeId: 'asc',
        },
        {
          dayOfWeek: 'asc',
        },
      ],
    });
  }

  async findOne(id: number) {
    const schedule = await this.prisma.employeeSchedule.findUnique({
      where: { id },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!schedule) {
      throw new NotFoundException(`Horario con ID ${id} no encontrado`);
    }

    return schedule;
  }

  async update(id: number, updateEmployeeScheduleDto: UpdateEmployeeScheduleDto) {
    const schedule = await this.prisma.employeeSchedule.findUnique({
      where: { id },
    });

    if (!schedule) {
      throw new NotFoundException(`Horario con ID ${id} no encontrado`);
    }

    return this.prisma.employeeSchedule.update({
      where: { id },
      data: {
        dayOfWeek: updateEmployeeScheduleDto.dayOfWeek ?? undefined,
        startTime: updateEmployeeScheduleDto.startTime
          ? new Date(updateEmployeeScheduleDto.startTime)
          : undefined,
        endTime: updateEmployeeScheduleDto.endTime
          ? new Date(updateEmployeeScheduleDto.endTime)
          : undefined,
      },
      include: {
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
    const schedule = await this.prisma.employeeSchedule.findUnique({
      where: { id },
    });

    if (!schedule) {
      throw new NotFoundException(`Horario con ID ${id} no encontrado`);
    }

    return this.prisma.employeeSchedule.delete({
      where: { id },
      include: {
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
}
