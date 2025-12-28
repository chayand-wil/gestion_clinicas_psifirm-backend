import { ApiProperty } from '@nestjs/swagger';
import { DischargeReason } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTherapeuticDischargeDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  recordId: number;

  @ApiProperty({ example: '2025-12-28T10:00:00Z' })
  @IsISO8601()
  dischargeDate: string;

  @ApiProperty({ enum: DischargeReason })
  @IsEnum(DischargeReason)
  reason: DischargeReason;

  @ApiProperty({ description: 'Estado del paciente al alta' })
  @IsString()
  patientStatus: string;

  @ApiProperty({ description: 'Recomendaciones al alta' })
  @IsString()
  recommendations: string;

  @ApiProperty({ required: false, description: 'Plan de seguimiento' })
  @IsOptional()
  @IsString()
  followUpPlan?: string;

  @ApiProperty({ required: false, description: 'Firma del paciente' })
  @IsOptional()
  @IsString()
  patientSignature?: string;

  @ApiProperty({ description: 'Firma del terapeuta' })
  @IsString()
  therapistSignature: string;
}
