import { ApiProperty } from '@nestjs/swagger';
import { WeekDay } from '@prisma/client';
import { IsEnum, IsISO8601, IsOptional } from 'class-validator';

export class UpdateEmployeeScheduleDto {
  @ApiProperty({
    example: 'LUNES',
    description: 'Día de la semana',
    enum: WeekDay,
    required: false,
  })
  @IsEnum(WeekDay)
  @IsOptional()
  dayOfWeek?: WeekDay;

  @ApiProperty({
    example: '2025-01-01T08:00:00Z',
    description: 'Hora de inicio (solo se usa la hora)',
    required: false,
  })
  @IsISO8601()
  @IsOptional()
  startTime?: string;

  @ApiProperty({
    example: '2025-01-01T17:00:00Z',
    description: 'Hora de fin (solo se usa la hora)',
    required: false,
  })
  @IsISO8601()
  @IsOptional()
  endTime?: string;
}
