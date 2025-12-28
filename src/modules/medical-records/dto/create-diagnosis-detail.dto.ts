import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class CreateDiagnosisDetailDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  recordId: number;

  @ApiProperty()
  @IsString()
  predisponentes: string;

  @ApiProperty()
  @IsString()
  precipitantes: string;

  @ApiProperty()
  @IsString()
  mantenedores: string;

  @ApiProperty({ example: 75 })
  @IsInt()
  functioningLevel: number;
}
