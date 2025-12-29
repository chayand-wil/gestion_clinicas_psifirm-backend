import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDecimal, IsNotEmpty, IsString, IsInt, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'MED-001', description: 'Código único del producto' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 'Paracetamol 500mg', description: 'Nombre descriptivo del producto' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 10, description: 'Stock mínimo recomendado' })
  @IsInt()
  @Min(0)
  minStock: number;

  @ApiProperty({ example: '12.50', description: 'Precio unitario' })
  @IsDecimal()
  price: string;

  @ApiProperty({ example: true, description: 'Indica si el producto es un medicamento' })
  @IsBoolean()
  isMedication: boolean;
}
