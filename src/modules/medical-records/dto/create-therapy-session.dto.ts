import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsISO8601, IsBoolean, IsOptional } from 'class-validator';

export class CreateTherapySessionDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  recordId: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  employeeId: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  sessionNumber: number;

  @ApiProperty({ example: '2025-12-28T10:00:00Z' })
  @IsISO8601()
  date: string;

  @ApiProperty()
  @IsBoolean()
  attended: boolean;

  @ApiProperty()
  @IsString()
  interventions: string;

  @ApiProperty()
  @IsString()
  patientResponse: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  assignedTasks?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  observations?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsISO8601()
  nextSessionDate?: string;
}
