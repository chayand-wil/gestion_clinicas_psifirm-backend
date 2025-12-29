import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateInvoiceDto,
  UpdateInvoiceDto,
  InvoiceResponseDto,
  InvoiceItemResponseDto,
} from './dto';
import { Invoice, InvoiceItem } from '@prisma/client';

@Injectable()
export class InvoicesService {
  constructor(private prisma: PrismaService) {}

  async create(createInvoiceDto: CreateInvoiceDto): Promise<InvoiceResponseDto> {
    // Validar que el pago existe
    const payment = await this.prisma.payment.findUnique({
      where: { id: createInvoiceDto.paymentId },
    });

    if (!payment) {
      throw new NotFoundException(
        `Pago con ID ${createInvoiceDto.paymentId} no encontrado`,
      );
    }

    // Validar que el pago no tenga ya una factura
    const existingInvoice = await this.prisma.invoice.findUnique({
      where: { paymentId: createInvoiceDto.paymentId },
    });

    if (existingInvoice) {
      throw new ConflictException(
        `El pago con ID ${createInvoiceDto.paymentId} ya tiene una factura asociada`,
      );
    }

    // Calcular totales
    let calculatedSubtotal = 0;
    for (const item of createInvoiceDto.items) {
      calculatedSubtotal += parseFloat(item.total);
    }

    const subtotal = createInvoiceDto.subtotal
      ? parseFloat(createInvoiceDto.subtotal)
      : calculatedSubtotal;
    const taxes = createInvoiceDto.taxes
      ? parseFloat(createInvoiceDto.taxes)
      : 0;
    const total = subtotal + taxes;

    // Generar número de factura único
    const invoiceNumber = await this.generateInvoiceNumber();

    // Crear factura con items
    const invoice = await this.prisma.invoice.create({
      data: {
        number: invoiceNumber,
        paymentId: createInvoiceDto.paymentId,
        subtotal,
        taxes,
        total,
        dueDate: createInvoiceDto.dueDate
          ? new Date(createInvoiceDto.dueDate)
          : null,
        items: {
          create: createInvoiceDto.items.map(item => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.total,
            appointmentId: item.appointmentId,
            prescriptionDeliveryId: item.prescriptionDeliveryId,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return this.formatResponse(invoice);
  }

  async findAll(): Promise<InvoiceResponseDto[]> {
    const invoices = await this.prisma.invoice.findMany({
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return invoices.map(i => this.formatResponse(i));
  }

  async findOne(id: number): Promise<InvoiceResponseDto> {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    if (!invoice) {
      throw new NotFoundException(`Factura con ID ${id} no encontrada`);
    }

    return this.formatResponse(invoice);
  }

  async findByNumber(number: string): Promise<InvoiceResponseDto> {
    const invoice = await this.prisma.invoice.findUnique({
      where: { number },
      include: {
        items: true,
      },
    });

    if (!invoice) {
      throw new NotFoundException(`Factura con número ${number} no encontrada`);
    }

    return this.formatResponse(invoice);
  }

  async findByPayment(paymentId: number): Promise<InvoiceResponseDto> {
    const invoice = await this.prisma.invoice.findUnique({
      where: { paymentId },
      include: {
        items: true,
      },
    });

    if (!invoice) {
      throw new NotFoundException(
        `Factura para el pago con ID ${paymentId} no encontrada`,
      );
    }

    return this.formatResponse(invoice);
  }

  async update(
    id: number,
    updateInvoiceDto: UpdateInvoiceDto,
  ): Promise<InvoiceResponseDto> {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
    });

    if (!invoice) {
      throw new NotFoundException(`Factura con ID ${id} no encontrada`);
    }

    // Recalcular total si se actualizan subtotal o taxes
    let dataToUpdate: any = {
      subtotal: updateInvoiceDto.subtotal,
      taxes: updateInvoiceDto.taxes,
      dueDate: updateInvoiceDto.dueDate
        ? new Date(updateInvoiceDto.dueDate)
        : undefined,
    };

    if (updateInvoiceDto.subtotal || updateInvoiceDto.taxes) {
      const newSubtotal = updateInvoiceDto.subtotal
        ? parseFloat(updateInvoiceDto.subtotal)
        : parseFloat(invoice.subtotal.toString());
      const newTaxes = updateInvoiceDto.taxes
        ? parseFloat(updateInvoiceDto.taxes)
        : parseFloat(invoice.taxes.toString());
      dataToUpdate.total = newSubtotal + newTaxes;
    }

    const updated = await this.prisma.invoice.update({
      where: { id },
      data: dataToUpdate,
      include: {
        items: true,
      },
    });

    return this.formatResponse(updated);
  }

  async remove(id: number): Promise<{ message: string }> {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
    });

    if (!invoice) {
      throw new NotFoundException(`Factura con ID ${id} no encontrada`);
    }

    // Eliminar factura y sus items (cascade)
    await this.prisma.invoice.delete({
      where: { id },
    });

    return { message: `Factura con ID ${id} eliminada exitosamente` };
  }

  private async generateInvoiceNumber(): Promise<string> {
    const count = await this.prisma.invoice.count();
    const nextNumber = count + 1;
    return `INV-${nextNumber.toString().padStart(6, '0')}`;
  }

  private formatResponse(
    invoice: Invoice & { items: InvoiceItem[] },
  ): InvoiceResponseDto {
    return {
      id: invoice.id,
      number: invoice.number,
      paymentId: invoice.paymentId,
      subtotal: invoice.subtotal.toString(),
      taxes: invoice.taxes.toString(),
      total: invoice.total.toString(),
      issueDate: invoice.issueDate,
      dueDate: invoice.dueDate,
      items: invoice.items.map(this.formatItemResponse),
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt,
    };
  }

  private formatItemResponse(item: InvoiceItem): InvoiceItemResponseDto {
    return {
      id: item.id,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice.toString(),
      total: item.total.toString(),
      appointmentId: item.appointmentId,
      prescriptionDeliveryId: item.prescriptionDeliveryId,
      createdAt: item.createdAt,
    };
  }
}
