import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional, Min, IsDecimal } from 'class-validator';

export class CreateDeliveryDto {
  @ApiProperty({ example: 2, description: 'ID del empleado que entrega' })
  @IsInt()
  @Min(1)
  deliveredBy: number;

  @ApiProperty({ example: 1, description: 'Cantidad entregada' })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: '50.00', description: 'Precio unitario al momento de entrega' })
  @IsDecimal({ decimal_digits: '1,2' })
  unitPrice: string;

  @ApiProperty({ example: '2025-01-02T10:00:00Z', required: false })
  @IsDateString()
  @IsOptional()
  deliveredAt?: string;
}
