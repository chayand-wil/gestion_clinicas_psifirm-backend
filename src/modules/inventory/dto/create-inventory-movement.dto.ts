import { ApiProperty } from '@nestjs/swagger';
import { InventoryMovementType } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateInventoryMovementDto {
  @ApiProperty({ example: 1, description: 'ID del producto' })
  @IsInt()
  @Min(1)
  productId: number;

  @ApiProperty({ enum: InventoryMovementType, description: 'Tipo de movimiento' })
  @IsEnum(InventoryMovementType)
  type: InventoryMovementType;

  @ApiProperty({ example: 5, description: 'Cantidad involucrada en el movimiento' })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: 'Recepción de proveedor', required: false })
  @IsString()
  @IsOptional()
  reason?: string;
}
