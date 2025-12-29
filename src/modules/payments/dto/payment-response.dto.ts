import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentStatus } from '@prisma/client';

export class PaymentResponseDto {
  @ApiProperty({
    example: 1,
    description: 'ID del pago',
  })
  id: number;

  @ApiProperty({
    example: 1,
    description: 'ID del paciente',
  })
  patientId: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID de la cita',
  })
  appointmentId?: number | null;

  @ApiProperty({
    example: '150.00',
    description: 'Monto del pago',
  })
  amount: string;

  @ApiProperty({
    example: 'PAGADO',
    description: 'Estado del pago',
    enum: ['PENDIENTE', 'PAGADO', 'PARCIAL', 'CANCELADO'],
  })
  status: PaymentStatus;

  @ApiPropertyOptional({
    example: '2025-12-28T14:30:00Z',
    description: 'Fecha de pago',
  })
  paidAt?: Date | null;

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
