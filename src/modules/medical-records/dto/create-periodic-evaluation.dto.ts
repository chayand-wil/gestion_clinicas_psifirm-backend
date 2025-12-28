import { ApiProperty } from '@nestjs/swagger';
import { EvaluationType } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreatePeriodicEvaluationDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  recordId: number;

  @ApiProperty({ enum: EvaluationType })
  @IsEnum(EvaluationType)
  type: EvaluationType;

  @ApiProperty({ description: 'Progreso observado' })
  @IsString()
  observedProgress: string;

  @ApiProperty({ description: 'Metas alcanzadas' })
  @IsString()
  achievedGoals: string;

  @ApiProperty({ description: 'Metas pendientes' })
  @IsString()
  pendingGoals: string;

  @ApiProperty({ description: 'Recomendaciones' })
  @IsString()
  recommendations: string;

  @ApiProperty({ example: 8, description: 'Escala de progreso 1-10' })
  @IsInt()
  @Min(1)
  @Max(10)
  progressScale: number;

  @ApiProperty({ required: false, example: '2025-12-28T10:00:00Z' })
  @IsOptional()
  @IsISO8601()
  evaluatedAt?: string;
}
