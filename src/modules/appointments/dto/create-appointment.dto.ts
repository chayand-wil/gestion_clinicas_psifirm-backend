import { ApiProperty } from '@nestjs/swagger';
import { AppointmentStatus } from '@prisma/client';
import { IsInt, IsPositive, IsISO8601, IsEnum, IsOptional, IsDecimal } from 'class-validator';

export class CreateAppointmentDto {
  @ApiProperty({
    example: 1,
    description: 'ID del paciente',
  })
  @IsInt()
  @IsPositive()
  patientId: number;

  @ApiProperty({
    example: 1,
    description: 'ID del empleado (psicólogo/terapeuta)',
  })
  @IsInt()
  @IsPositive()
  employeeId: number;

  @ApiProperty({
    example: '2025-12-28T10:00:00Z',
    description: 'Fecha y hora de la cita',
  })
  @IsISO8601()
  date: string;

  @ApiProperty({
    example: 'PENDIENTE',
    description: 'Estado de la cita',
    enum: AppointmentStatus,
  })
  @IsEnum(AppointmentStatus)
  status: AppointmentStatus;

  @ApiProperty({
    example: 50.00,
    description: 'Costo de la cita',
  })
  @IsDecimal()
  cost: number;

  @ApiProperty({
    example: 1,
    description: 'ID de la sesión terapéutica (opcional)',
    required: false,
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  sessionId?: number;
}
