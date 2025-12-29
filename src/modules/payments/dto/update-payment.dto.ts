import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentStatus } from '@prisma/client';
import {
  IsOptional,
  IsEnum,
  IsDecimal,
  IsISO8601,
} from 'class-validator';

export class UpdatePaymentDto {
  @ApiPropertyOptional({
    example: 'PAGADO',
    description: 'Estado del pago',
    enum: ['PENDIENTE', 'PAGADO', 'PARCIAL', 'CANCELADO'],
  })
  @IsOptional()
  @IsEnum(['PENDIENTE', 'PAGADO', 'PARCIAL', 'CANCELADO'])
  status?: PaymentStatus;

  @ApiPropertyOptional({
    example: '150.00',
    description: 'Monto del pago',
  })
  @IsOptional()
  @IsDecimal({ decimal_digits: '1,2' })
  amount?: string;

  @ApiPropertyOptional({
    example: '2025-12-28T14:30:00Z',
    description: 'Fecha de pago',
  })
  @IsOptional()
  @IsISO8601()
  paidAt?: string;
}
