import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNumber, IsOptional, Min } from 'class-validator';
import { PayrollStatus } from '@prisma/client';

export class UpdatePayrollDto {
  @ApiPropertyOptional({ description: 'Salario base', example: 5000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  baseSalary?: number;

  @ApiPropertyOptional({ description: 'Bonificaciones', example: 250 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  bonus?: number;

  @ApiPropertyOptional({ description: 'IGSS calculado', example: 241.5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  igss?: number;

  @ApiPropertyOptional({ description: 'Deducciones', example: 100 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  deductions?: number;

  @ApiPropertyOptional({ description: 'Salario neto', example: 4908.5 })
  @IsOptional()
  @IsNumber()
  netSalary?: number;

  @ApiPropertyOptional({ description: 'Estado de nómina', enum: PayrollStatus, example: 'PENDIENTE' })
  @IsOptional()
  @IsEnum(PayrollStatus)
  status?: PayrollStatus;

  @ApiPropertyOptional({ description: 'Fecha de pago', example: '2025-12-29T12:00:00Z' })
  @IsOptional()
  @IsDateString()
  paymentDate?: string;
}
