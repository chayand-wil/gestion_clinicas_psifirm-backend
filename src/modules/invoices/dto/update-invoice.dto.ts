import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsDecimal, IsISO8601 } from 'class-validator';

export class UpdateInvoiceDto {
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
  @IsISO8601()
  dueDate?: string;
}
