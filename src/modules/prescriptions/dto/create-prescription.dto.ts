import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreatePrescriptionDto {
  @ApiProperty({ example: 1, description: 'ID de la historia clínica' })
  @IsInt()
  @Min(1)
  recordId: number;

  @ApiProperty({ example: 1, description: 'ID del producto prescrito' })
  @IsInt()
  @Min(1)
  productId: number;

  @ApiProperty({ example: 3, description: 'ID del empleado que prescribe' })
  @IsInt()
  @Min(1)
  prescribedBy: number;

  @ApiProperty({ example: '2 veces al día', description: 'Posología o dosis' })
  @IsString()
  @IsNotEmpty()
  dosage: string;

  @ApiProperty({ example: 'Después de las comidas', description: 'Instrucciones adicionales' })
  @IsString()
  @IsNotEmpty()
  instructions: string;

  @ApiProperty({ example: '2025-01-01T12:00:00Z', description: 'Fecha de inicio' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2025-01-15T12:00:00Z', required: false, description: 'Fecha de fin' })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({ example: true, required: false, description: 'Indica si la prescripción está activa' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
