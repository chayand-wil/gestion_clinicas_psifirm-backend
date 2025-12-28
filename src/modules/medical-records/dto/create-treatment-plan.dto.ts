import { ApiProperty } from '@nestjs/swagger';
import {
  SessionFrequency,
  TherapyModality,
  TherapeuticApproach,
} from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateTreatmentPlanDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  recordId: number;

  @ApiProperty({ description: 'Metas a corto plazo' })
  @IsString()
  shortTermGoal: string;

  @ApiProperty({ required: false, description: 'Metas a mediano plazo' })
  @IsOptional()
  @IsString()
  mediumTermGoal?: string;

  @ApiProperty({ required: false, description: 'Metas a largo plazo' })
  @IsOptional()
  @IsString()
  longTermGoal?: string;

  @ApiProperty({ enum: TherapyModality })
  @IsEnum(TherapyModality)
  modality: TherapyModality;

  @ApiProperty({ enum: TherapeuticApproach })
  @IsEnum(TherapeuticApproach)
  therapeuticFocus: TherapeuticApproach;

  @ApiProperty({ enum: SessionFrequency })
  @IsEnum(SessionFrequency)
  frequency: SessionFrequency;

  @ApiProperty({ example: 1, description: 'Sesiones por semana', default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  sessionsPerWeek?: number;

  @ApiProperty({ example: 12, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  estimatedWeeks?: number;

  @ApiProperty({ example: 350.5 })
  @IsNumber({ allowInfinity: false, allowNaN: false })
  @Min(0)
  costPerSession: number;

  @ApiProperty({ required: false, example: '2025-01-01T00:00:00Z' })
  @IsOptional()
  @IsISO8601()
  startDate?: string;

  @ApiProperty({ required: false, example: '2025-03-31T00:00:00Z' })
  @IsOptional()
  @IsISO8601()
  estimatedEndDate?: string;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
