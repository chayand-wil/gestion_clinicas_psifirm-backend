import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUsuarioDto {
  @ApiProperty({ 
    description: 'El correo electrónico del usuario', 
    example: 'empleado@psifirm.com',
    required: true 
  })
  @IsEmail({}, { message: 'Debe proporcionar un correo válido.' })
  @IsNotEmpty({ message: 'El correo es obligatorio.' })
  email: string;

  @ApiProperty({ 
    description: 'Nombre de usuario único', 
    example: 'empleado.demo',
    required: true 
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre de usuario es obligatorio.' })
  username: string;

  @ApiProperty({ 
    description: 'La contraseña del usuario', 
    example: 'SecurePass123',
    required: true 
  })
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
  passwordHash: string;

  @ApiProperty({ 
    description: 'ID del rol a asignar (1=Admin, 2=Empleado, 3=Paciente)', 
    example: 2,
    required: false 
  })
  @IsOptional()
  @IsNumber()
  roleId?: number;
}
