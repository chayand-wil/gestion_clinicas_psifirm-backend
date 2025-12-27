import { ApiProperty } from '@nestjs/swagger';
import { WeekDay } from '@prisma/client';
import { IsInt, IsPositive, IsEnum, IsISO8601 } from 'class-validator';

export class CreateEmployeeScheduleDto {
  @ApiProperty({
    example: 1,
    description: 'ID del empleado',
  })
  @IsInt()
  @IsPositive()
  employeeId: number;

  @ApiProperty({
    example: 'LUNES',
    description: 'Día de la semana',
    enum: WeekDay,
  })
  @IsEnum(WeekDay)
  dayOfWeek: WeekDay;

  @ApiProperty({
    example: '2025-01-01T08:00:00Z',
    description: 'Hora de inicio (solo se usa la hora)',
  })
  @IsISO8601()
  startTime: string;

  @ApiProperty({
    example: '2025-01-01T17:00:00Z',
    description: 'Hora de fin (solo se usa la hora)',
  })
  @IsISO8601()
  endTime: string;
}
