import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsISO8601, IsOptional } from 'class-validator';

export class CreatePsychologicalTestDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  recordId: number;

  @ApiProperty({ example: 'MMPI' })
  @IsString()
  name: string;

  @ApiProperty({ example: '75' })
  @IsString()
  score: string;

  @ApiProperty()
  @IsString()
  interpretation: string;

  @ApiProperty({ example: '2025-12-28T10:00:00Z' })
  @IsISO8601()
  appliedAt: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  attachmentUrl?: string;
}
