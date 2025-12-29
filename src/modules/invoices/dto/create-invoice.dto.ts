import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsPositive,
  IsOptional,
  IsDecimal,
  IsString,
  ArrayNotEmpty,
  IsArray,
} from 'class-validator';

export class CreateInvoiceItemDto {
  @ApiProperty({
    example: 1,
    description: 'ID de la cita (opcional, mutuamente excluyente con prescriptionDeliveryId)',
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  appointmentId?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID de la entrega de prescripción',
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  prescriptionDeliveryId?: number;

  @ApiProperty({
    example: 'Sesión terapéutica',
    description: 'Descripción del item',
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: 1,
    description: 'Cantidad',
  })
  @IsInt()
  @IsPositive()
  quantity: number;

  @ApiProperty({
    example: '150.00',
    description: 'Precio unitario',
  })
  @IsDecimal({ decimal_digits: '1,2' })
  unitPrice: string;

  @ApiProperty({
    example: '150.00',
    description: 'Total (cantidad x precio unitario)',
  })
  @IsDecimal({ decimal_digits: '1,2' })
  total: string;
}

export class CreateInvoiceDto {
  @ApiProperty({
    example: 1,
    description: 'ID del pago',
  })
  @IsInt()
  @IsPositive()
  paymentId: number;

  @ApiPropertyOptional({
    example: '100.00',
    description: 'Subtotal',
  })
  @IsOptional()
  @IsDecimal({ decimal_digits: '1,2' })
  subtotal?: string;

  @ApiPropertyOptional({
    example: '10.00',
    description: 'Impuestos',
  })
  @IsOptional()
  @IsDecimal({ decimal_digits: '1,2' })
  taxes?: string;

  @ApiPropertyOptional({
    example: '2025-12-28T23:59:59Z',
    description: 'Fecha de vencimiento',
  })
  @IsOptional()
  @IsString()
  dueDate?: string;

  @ApiProperty({
    description: 'Items de la factura',
    type: [CreateInvoiceItemDto],
  })
  @IsArray()
  @ArrayNotEmpty()
  items: CreateInvoiceItemDto[];
}
