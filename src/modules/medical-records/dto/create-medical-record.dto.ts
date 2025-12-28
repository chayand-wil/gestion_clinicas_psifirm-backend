import { ApiProperty } from '@nestjs/swagger';
import { RecordStatus } from '@prisma/client';
import { IsInt, IsString, IsEnum, IsISO8601, IsOptional } from 'class-validator';

export class CreateMedicalRecordDto {
  @ApiProperty({ example: 'MR-0001' })
  @IsString()
  recordNumber: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  patientId: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  psychologistId: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  specialtyAreaId: number;

  @ApiProperty({ example: 'ACTIVE', enum: RecordStatus })
  @IsEnum(RecordStatus)
  status: RecordStatus;

  @ApiProperty({ example: '2025-12-28T10:00:00Z' })
  @IsISO8601()
  openedAt: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsISO8601()
  closedAt?: string;
}
