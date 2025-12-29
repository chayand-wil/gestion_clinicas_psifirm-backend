import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class CalculatePayrollDto {
  @ApiProperty({ description: 'ID del empleado', example: 1 })
  @IsInt()
  employeeId!: number;

  @ApiProperty({ description: 'Inicio del período', example: '2025-12-01' })
  @IsDateString()
  periodStart!: string;

  @ApiProperty({ description: 'Fin del período', example: '2025-12-31' })
  @IsDateString()
  periodEnd!: string;

  @ApiPropertyOptional({ description: 'Salario base (override)', example: 5000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  baseSalary?: number;

  @ApiPropertyOptional({ description: 'Bonificaciones', example: 250 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  bonus?: number;

  @ApiPropertyOptional({ description: 'Deducciones', example: 100 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  deductions?: number;

  @ApiPropertyOptional({ description: 'Tasa IGSS a aplicar (por ejemplo 0.0483)', example: 0.0483 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  igssRate?: number;
}
