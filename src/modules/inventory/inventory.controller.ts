import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import {
  CreateInventoryMovementDto,
  CreateProductDto,
  UpdateProductDto,
} from './dto';

@ApiTags('inventory')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly service: InventoryService) {}

  @Post('products')
  @ApiOperation({ summary: 'Crear producto' })
  @ApiResponse({ status: 201, description: 'Producto creado' })
  createProduct(@Body() dto: CreateProductDto) {
    return this.service.createProduct(dto);
  }

  @Get('products')
  @ApiOperation({ summary: 'Listar productos' })
  findAllProducts() {
    return this.service.findAllProducts();
  }

  @Get('products/:id')
  @ApiOperation({ summary: 'Obtener producto por ID' })
  findProduct(@Param('id', ParseIntPipe) id: number) {
    return this.service.findProduct(id);
  }

  @Patch('products/:id')
  @ApiOperation({ summary: 'Actualizar producto' })
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ) {
    return this.service.updateProduct(id, dto);
  }

  @Delete('products/:id')
  @ApiOperation({ summary: 'Eliminar producto' })
  removeProduct(@Param('id', ParseIntPipe) id: number) {
    return this.service.removeProduct(id);
  }

  @Post('movements')
  @ApiOperation({ summary: 'Registrar movimiento de inventario' })
  createMovement(@Body() dto: CreateInventoryMovementDto) {
    return this.service.createMovement(dto);
  }

  @Get('movements')
  @ApiOperation({ summary: 'Listar movimientos de inventario' })
  findMovements(
    @Query('productId', new ParseIntPipe({ optional: true })) productId?: number,
  ) {
    return this.service.findMovements(productId);
  }
}
