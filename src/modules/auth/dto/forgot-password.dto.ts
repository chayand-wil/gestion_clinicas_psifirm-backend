import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'usuario@psifirm.test' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
