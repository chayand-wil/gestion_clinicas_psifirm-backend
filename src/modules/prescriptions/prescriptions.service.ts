import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InventoryMovementType, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateDeliveryDto,
  CreatePrescriptionDto,
  UpdatePrescriptionDto,
} from './dto';

@Injectable()
export class PrescriptionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePrescriptionDto) {
    await this.ensureRecord(dto.recordId);
    await this.ensureProduct(dto.productId);
    await this.ensureEmployee(dto.prescribedBy);

    return this.prisma.prescription.create({
      data: {
        recordId: dto.recordId,
        productId: dto.productId,
        prescribedBy: dto.prescribedBy,
        dosage: dto.dosage,
        instructions: dto.instructions,
        prescriptionDate: new Date(),
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        isActive: dto.isActive ?? true,
      },
    });
  }

  findAll(filters?: {
    recordId?: number;
    productId?: number;
    prescribedBy?: number;
    isActive?: boolean;
  }) {
    const where: any = {};

    if (filters?.recordId) where.recordId = filters.recordId;
    if (filters?.productId) where.productId = filters.productId;
    if (filters?.prescribedBy) where.prescribedBy = filters.prescribedBy;
    if (filters?.isActive !== undefined) where.isActive = filters.isActive;

    return this.prisma.prescription.findMany({
      where,
      include: {
        product: true,
        doctor: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
      orderBy: { prescriptionDate: 'desc' },
    });
  }

  async findOne(id: number) {
    const prescription = await this.prisma.prescription.findUnique({
      where: { id },
      include: {
        product: true,
        doctor: { select: { id: true, firstName: true, lastName: true } },
        deliveries: true,
      },
    });

    if (!prescription) {
      throw new NotFoundException(`Prescripción con ID ${id} no encontrada`);
    }

    return prescription;
  }

  async update(id: number, dto: UpdatePrescriptionDto) {
    const prescription = await this.prisma.prescription.findUnique({ where: { id } });
    if (!prescription) {
      throw new NotFoundException(`Prescripción con ID ${id} no encontrada`);
    }

    if (dto.recordId && dto.recordId !== prescription.recordId) {
      await this.ensureRecord(dto.recordId);
    }

    if (dto.productId && dto.productId !== prescription.productId) {
      await this.ensureProduct(dto.productId);
    }

    if (dto.prescribedBy && dto.prescribedBy !== prescription.prescribedBy) {
      await this.ensureEmployee(dto.prescribedBy);
    }

    return this.prisma.prescription.update({
      where: { id },
      data: {
        recordId: dto.recordId ?? undefined,
        productId: dto.productId ?? undefined,
        prescribedBy: dto.prescribedBy ?? undefined,
        dosage: dto.dosage ?? undefined,
        instructions: dto.instructions ?? undefined,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        isActive: dto.isActive ?? undefined,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.prescription.delete({ where: { id } });
  }

  async createDelivery(prescriptionId: number, dto: CreateDeliveryDto) {
    const prescription = await this.prisma.prescription.findUnique({ where: { id: prescriptionId } });
    if (!prescription) {
      throw new NotFoundException(`Prescripción con ID ${prescriptionId} no encontrada`);
    }

    await this.ensureEmployee(dto.deliveredBy);

    return this.prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: prescription.productId },
        select: { id: true, stock: true },
      });

      if (!product) {
        throw new NotFoundException('Producto asociado a la prescripción no existe');
      }

      if (product.stock < dto.quantity) {
        throw new BadRequestException('Stock insuficiente para la entrega');
      }

      const unitPrice = parseFloat(dto.unitPrice);
      const totalPrice = unitPrice * dto.quantity;

      const delivery = await tx.prescriptionDelivery.create({
        data: {
          prescriptionId,
          deliveredBy: dto.deliveredBy,
          quantity: dto.quantity,
          unitPrice,
          totalPrice,
          deliveredAt: dto.deliveredAt ? new Date(dto.deliveredAt) : undefined,
        },
      });

      const remainingStock = product.stock - dto.quantity;

      await tx.product.update({
        where: { id: product.id },
        data: { stock: remainingStock },
      });

      await tx.inventoryMovement.create({
        data: {
          productId: product.id,
          type: InventoryMovementType.SALIDA,
          quantity: dto.quantity,
          reason: `Entrega prescripción ${prescriptionId}`,
        },
      });

      return { delivery, remainingStock };
    });
  }

  async findDeliveries(prescriptionId: number) {
    await this.findOne(prescriptionId);
    return this.prisma.prescriptionDelivery.findMany({
      where: { prescriptionId },
      include: {
        employee: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { deliveredAt: 'desc' },
    });
  }

  async findDeliveriesForBilling(paid?: boolean) {
    const where: Prisma.PrescriptionDeliveryWhereInput = {};

    // paid = true  -> entregas ya facturadas (tienen invoiceItem)
    // paid = false -> entregas sin facturar (invoiceItem es null)
    if (paid === true) {
      where.invoiceItem = { isNot: null };
    } else if (paid === false) {
      where.invoiceItem = { is: null };
    }

    return this.prisma.prescriptionDelivery.findMany({
      where,
      include: {
        employee: { select: { id: true, firstName: true, lastName: true } },
        prescription: {
          include: {
            product: { select: { id: true, name: true, price: true } },
            record: {
              select: {
                id: true,
                patient: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    phone: true,
                  },
                },
              },
            },
          },
        },
        invoiceItem: {
          include: {
            invoice: {
              select: {
                id: true,
                number: true,
                paymentId: true,
              },
            },
          },
        },
      },
      orderBy: { deliveredAt: 'desc' },
    });
  }

  private async ensureRecord(recordId: number) {
    const record = await this.prisma.medicalRecord.findUnique({ where: { id: recordId } });
    if (!record) {
      throw new NotFoundException(`Historia clínica con ID ${recordId} no encontrada`);
    }
    return record;
  }

  private async ensureProduct(productId: number) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException(`Producto con ID ${productId} no encontrado`);
    }
    return product;
  }

  private async ensureEmployee(employeeId: number) {
    const employee = await this.prisma.employee.findUnique({ where: { id: employeeId } });
    if (!employee) {
      throw new NotFoundException(`Empleado con ID ${employeeId} no encontrado`);
    }
    return employee;
  }
}
