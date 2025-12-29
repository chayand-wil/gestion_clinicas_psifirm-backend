import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentStatus } from '@prisma/client';
import {
  IsInt,
  IsPositive,
  IsEnum,
  IsOptional,
  IsDecimal,
  Validate,
} from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({
    example: 1,
    description: 'ID del paciente',
  })
  @IsInt()
  @IsPositive()
  patientId: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID de la cita (opcional)',
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  appointmentId?: number;

  @ApiProperty({
    example: '150.00',
    description: 'Monto del pago',
  })
  @IsDecimal({ decimal_digits: '1,2' })
  amount: string;

  @ApiPropertyOptional({
    example: 'PENDIENTE',
    description: 'Estado del pago',
    enum: ['PENDIENTE', 'PAGADO', 'PARCIAL', 'CANCELADO'],
  })
  @IsOptional()
  @IsEnum(['PENDIENTE', 'PAGADO', 'PARCIAL', 'CANCELADO'])
  status?: PaymentStatus;
}
