import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUsuarioDto {
  @ApiProperty({ description: 'El correo electrónico del usuario', example: 'usuario@example.com' })
  @IsEmail({}, { message: 'Debe proporcionar un correo válido.' })
  @IsNotEmpty({ message: 'El correo es obligatorio.' })
  email: string;

  @ApiProperty({ description: 'Nombre de usuario único', example: 'usuario.demo' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre de usuario es obligatorio.' })
  username: string;

  @ApiProperty({ description: 'La contraseña del usuario', example: 'password123' })
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
  passwordHash: string;

  @ApiProperty({ description: 'ID del rol', required: false })
  @IsOptional()
  roleId?: number;
}
