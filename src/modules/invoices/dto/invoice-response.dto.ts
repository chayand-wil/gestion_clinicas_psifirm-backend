import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class InvoiceItemResponseDto {
  @ApiProperty({
    example: 1,
    description: 'ID del item',
  })
  id: number;

  @ApiProperty({
    example: 'Sesión terapéutica',
    description: 'Descripción del item',
  })
  description: string;

  @ApiProperty({
    example: 1,
    description: 'Cantidad',
  })
  quantity: number;

  @ApiProperty({
    example: '150.00',
    description: 'Precio unitario',
  })
  unitPrice: string;

  @ApiProperty({
    example: '150.00',
    description: 'Total',
  })
  total: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID de la cita',
  })
  appointmentId?: number | null;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID de la entrega de prescripción',
  })
  prescriptionDeliveryId?: number | null;

  @ApiProperty({
    example: '2025-12-28T10:00:00Z',
    description: 'Fecha de creación',
  })
  createdAt: Date;
}

export class InvoiceResponseDto {
  @ApiProperty({
    example: 1,
    description: 'ID de la factura',
  })
  id: number;

  @ApiProperty({
    example: 'INV-001',
    description: 'Número de factura',
  })
  number: string;

  @ApiProperty({
    example: 1,
    description: 'ID del pago',
  })
  paymentId: number;

  @ApiProperty({
    example: '100.00',
    description: 'Subtotal',
  })
  subtotal: string;

  @ApiProperty({
    example: '10.00',
    description: 'Impuestos',
  })
  taxes: string;

  @ApiProperty({
    example: '110.00',
    description: 'Total',
  })
  total: string;

  @ApiProperty({
    example: '2025-12-28T10:00:00Z',
    description: 'Fecha de emisión',
  })
  issueDate: Date;

  @ApiPropertyOptional({
    example: '2025-12-28T23:59:59Z',
    description: 'Fecha de vencimiento',
  })
  dueDate?: Date | null;

  @ApiProperty({
    description: 'Items de la factura',
    type: [InvoiceItemResponseDto],
  })
  items: InvoiceItemResponseDto[];

  @ApiProperty({
    example: '2025-12-28T10:00:00Z',
    description: 'Fecha de creación',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-12-28T14:30:00Z',
    description: 'Fecha de actualización',
  })
  updatedAt: Date;
}
