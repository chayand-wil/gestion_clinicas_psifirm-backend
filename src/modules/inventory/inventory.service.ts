import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InventoryMovementType, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateInventoryMovementDto,
  CreateProductDto,
  UpdateProductDto,
} from './dto';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(dto: CreateProductDto) {
    const existingCode = await this.prisma.product.findUnique({ where: { code: dto.code } });
    if (existingCode) {
      throw new BadRequestException(`Ya existe un producto con el código ${dto.code}`);
    }

    return this.prisma.product.create({
      data: {
        code: dto.code,
        name: dto.name,
        stock: 0,
        minStock: dto.minStock,
        price: new Prisma.Decimal(dto.price),
        isMedication: dto.isMedication,
      },
    });
  }

  findAllProducts() {
    return this.prisma.product.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findLowStockProducts() {
    const products = await this.prisma.product.findMany({
      orderBy: [{ stock: 'asc' }, { name: 'asc' }],
    });

    return products.filter((product) => product.stock <= product.minStock);
  }

  async findProduct(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return product;
  }

  async updateProduct(id: number, dto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    if (dto.code) {
      const codeOwner = await this.prisma.product.findUnique({ where: { code: dto.code } });
      if (codeOwner && codeOwner.id !== id) {
        throw new BadRequestException(`Ya existe un producto con el código ${dto.code}`);
      }
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        code: dto.code ?? undefined,
        name: dto.name ?? undefined,
        minStock: dto.minStock ?? undefined,
        price: dto.price !== undefined ? new Prisma.Decimal(dto.price) : undefined,
        isMedication: dto.isMedication ?? undefined,
      },
    });
  }

  async removeProduct(id: number) {
    await this.findProduct(id);
    return this.prisma.product.delete({ where: { id } });
  }

  async createMovement(dto: CreateInventoryMovementDto) {
    return this.prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({ where: { id: dto.productId } });
      if (!product) {
        throw new NotFoundException(`Producto con ID ${dto.productId} no encontrado`);
      }

      let newStock = product.stock;

      switch (dto.type) {
        case InventoryMovementType.ENTRADA:
          newStock += dto.quantity;
          break;
        case InventoryMovementType.SALIDA:
        case InventoryMovementType.VENCIMIENTO:
          if (product.stock < dto.quantity) {
            throw new BadRequestException('Stock insuficiente para registrar la salida');
          }
          newStock -= dto.quantity;
          break;
        case InventoryMovementType.AJUSTE:
          newStock = dto.quantity;
          break;
        default:
          throw new BadRequestException('Tipo de movimiento inválido');
      }

      const movement = await tx.inventoryMovement.create({
        data: {
          productId: dto.productId,
          type: dto.type,
          quantity: dto.quantity,
          reason: dto.reason ?? null,
        },
      });

      const updatedProduct = await tx.product.update({
        where: { id: product.id },
        data: { stock: newStock },
      });

      return { movement, product: updatedProduct };
    });
  }

  findMovements(productId?: number) {
    return this.prisma.inventoryMovement.findMany({
      where: productId ? { productId } : undefined,
      include: {
        product: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findMovement(id: number) {
    const movement = await this.prisma.inventoryMovement.findUnique({
      where: { id },
      include: { product: true },
    });

    if (!movement) {
      throw new NotFoundException(`Movimiento con ID ${id} no encontrado`);
    }

    return movement;
  }
}
