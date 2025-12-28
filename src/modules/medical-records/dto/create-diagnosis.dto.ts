import { ApiProperty } from '@nestjs/swagger';
import { DiagnosisType } from '@prisma/client';
import { IsInt, IsString, IsEnum } from 'class-validator';

export class CreateDiagnosisDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  recordId: number;

  @ApiProperty({ example: '6B40' })
  @IsString()
  cie11Code: string;

  @ApiProperty({ enum: DiagnosisType })
  @IsEnum(DiagnosisType)
  type: DiagnosisType;

  @ApiProperty()
  @IsString()
  description: string;
}
