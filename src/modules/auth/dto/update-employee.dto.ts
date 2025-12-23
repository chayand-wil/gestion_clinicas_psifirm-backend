import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsEnum,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ContractType, PaymentType } from '@prisma/client';
import { Transform, Type } from 'class-transformer';

export class UpdateEmployeeDto {
  @ApiProperty({
    example: 1,
    description: 'ID del empleado a actualizar',
  })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  employeeId: number;

  @ApiProperty({
    example: 'employee@psifirm.test',
    description: 'Email del empleado',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: 'password123',
    description: 'Nueva contraseña (opcional)',
    minLength: 6,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;

  // Datos del empleado
  @ApiProperty({
    example: 'María',
    description: 'Nombre del empleado',
    required: false,
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({
    example: 'López',
    description: 'Apellido del empleado',
    required: false,
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    example: 1,
    description: 'ID del área de especialidad',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  specialtyAreaId?: number;

  @ApiProperty({
    example: 'INDEFINIDO',
    description: 'Tipo de contrato',
    enum: ContractType,
    required: false,
  })
  @IsEnum(ContractType)
  @IsOptional()
  contractType?: ContractType;

  @ApiProperty({
    example: 'MIXTO',
    description: 'Tipo de pago',
    enum: PaymentType,
    required: false,
  })
  @IsEnum(PaymentType)
  @IsOptional()
  paymentType?: PaymentType;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value === '' ? undefined : value)
  baseSalary?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value === '' ? undefined : value)
  sessionRate?: string;

  @ApiProperty({
    example: 'PSI-CL-001',
    description: 'Número de licencia profesional',
    required: false,
  })
  @IsString()
  @IsOptional()
  licenseNumber?: string;

  @ApiProperty({
    example: [1, 2],
    description: 'IDs de los roles a asignar',
    type: [Number],
    required: false,
  })
  @IsNumber({}, { each: true })
  @IsOptional()
  roleIds?: number[];
}
