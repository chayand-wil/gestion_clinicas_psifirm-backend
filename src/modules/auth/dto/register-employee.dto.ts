import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, IsNumber, IsDecimal, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ContractType, PaymentType } from '@prisma/client';
import { Type } from 'class-transformer';

export class RegisterEmployeeDto {
  @ApiProperty({
    example: 'employee@psifirm.test',
    description: 'Email del empleado',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'employee.demo',
    description: 'Nombre de usuario',
    minLength: 3,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @ApiProperty({
    example: 'password123',
    description: 'Contraseña',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  // Datos del empleado
  @ApiProperty({
    example: 'María',
    description: 'Nombre del empleado',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    example: 'López',
    description: 'Apellido del empleado',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example: 1,
    description: 'ID del área de especialidad',
  })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  specialtyAreaId: number;

  @ApiProperty({
    example: 'INDEFINIDO',
    description: 'Tipo de contrato',
    enum: ContractType,
  })
  @IsEnum(ContractType)
  @IsNotEmpty()
  contractType: ContractType;

  @ApiProperty({
    example: 'MIXTO',
    description: 'Tipo de pago',
    enum: PaymentType,
  })
  @IsEnum(PaymentType)
  @IsNotEmpty()
  paymentType: PaymentType;

  @ApiProperty({
    example: '8500',
    description: 'Salario base mensual',
  })
  @IsString()
  @IsNotEmpty()
  baseSalary: string;

  @ApiProperty({
    example: '350',
    description: 'Tarifa por sesión',
  })
  @IsString()
  @IsNotEmpty()
  sessionRate: string;

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
  })
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  roleIds: number[];
}
