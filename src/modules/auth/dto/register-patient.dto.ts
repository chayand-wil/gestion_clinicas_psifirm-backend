import { IsEmail, IsNotEmpty, IsString, MinLength, IsDateString, IsEnum, IsOptional, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Gender, CivilStatus, EducationLevel, Relationship, AlcoholLevel, TobaccoLevel } from '@prisma/client';

export class RegisterPatientDto {
  @ApiProperty({
    example: 'patient@example.com',
    description: 'Email del paciente',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'patient.demo',
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

  // Datos del paciente
  @ApiProperty({
    example: 'Juan',
    description: 'Nombre del paciente',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    example: 'Pérez',
    description: 'Apellido del paciente',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example: '1990-01-15',
    description: 'Fecha de nacimiento',
  })
  @IsDateString()
  @IsNotEmpty()
  birthDate: string;

  @ApiProperty({
    example: 'MASCULINO',
    description: 'Género del paciente',
    enum: Gender,
  })
  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @ApiProperty({
    example: 'SOLTERO',
    description: 'Estado civil',
    enum: CivilStatus,
  })
  @IsEnum(CivilStatus)
  @IsNotEmpty()
  civilStatus: CivilStatus;

  @ApiProperty({
    example: 'Ingeniero',
    description: 'Ocupación',
  })
  @IsString()
  @IsNotEmpty()
  occupation: string;

  @ApiProperty({
    example: 'UNIVERSITARIO',
    description: 'Nivel educativo',
    enum: EducationLevel,
  })
  @IsEnum(EducationLevel)
  @IsNotEmpty()
  educationLevel: EducationLevel;

  @ApiProperty({
    example: '50212345678',
    description: 'Teléfono de contacto',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    example: 'Calle Principal #123',
    description: 'Dirección',
    required: false,
  })
  @IsString()
  @IsOptional()
  address?: string;

  // Contacto de emergencia
  @ApiProperty({
    example: 'María Pérez',
    description: 'Nombre del contacto de emergencia',
  })
  @IsString()
  @IsNotEmpty()
  emergencyName: string;

  @ApiProperty({
    example: '50287654321',
    description: 'Teléfono del contacto de emergencia',
  })
  @IsString()
  @IsNotEmpty()
  emergencyPhone: string;

  @ApiProperty({
    example: 'HERMANO',
    description: 'Relación con el contacto de emergencia',
    enum: Relationship,
  })
  @IsEnum(Relationship)
  @IsNotEmpty()
  emergencyRelationship: Relationship;

  @ApiProperty({
    example: 'BAJO',
    description: 'Nivel de consumo de alcohol',
    enum: AlcoholLevel,
  })
  @IsEnum(AlcoholLevel)
  @IsNotEmpty()
  alcoholUse: AlcoholLevel;

  @ApiProperty({
    example: 'NINGUNO',
    description: 'Nivel de consumo de tabaco',
    enum: TobaccoLevel,
  })
  @IsEnum(TobaccoLevel)
  @IsNotEmpty()
  tobaccoUse: TobaccoLevel;
}
