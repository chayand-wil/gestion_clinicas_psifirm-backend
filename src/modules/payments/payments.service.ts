import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreatePaymentDto,
  UpdatePaymentDto,
  PaymentResponseDto,
} from './dto';
import { Payment, PaymentStatus } from '@prisma/client';

interface PaymentFilters {
  patientId?: number;
  appointmentId?: number;
  status?: PaymentStatus;
  fromDate?: Date;
  toDate?: Date;
}

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<PaymentResponseDto> {
    // Validar que el paciente existe
    const patient = await this.prisma.patient.findUnique({
      where: { id: createPaymentDto.patientId },
    });

    if (!patient) {
      throw new NotFoundException(
        `Paciente con ID ${createPaymentDto.patientId} no encontrado`,
      );
    }

    // Validar que la cita existe si se proporciona appointmentId
    if (createPaymentDto.appointmentId) {
      const appointment = await this.prisma.appointment.findUnique({
        where: { id: createPaymentDto.appointmentId },
      });

      if (!appointment) {
        throw new NotFoundException(
          `Cita con ID ${createPaymentDto.appointmentId} no encontrada`,
        );
      }

      // Validar que la cita pertenece al paciente
      if (appointment.patientId !== createPaymentDto.patientId) {
        throw new BadRequestException(
          'La cita no pertenece al paciente especificado',
        );
      }
    }

    const payment = await this.prisma.payment.create({
      data: {
        patientId: createPaymentDto.patientId,
        appointmentId: createPaymentDto.appointmentId,
        amount: createPaymentDto.amount,
        status: createPaymentDto.status || 'PENDIENTE',
      },
    });

    return this.formatResponse(payment);
  }

  async findAll(filters?: PaymentFilters): Promise<PaymentResponseDto[]> {
    const payments = await this.prisma.payment.findMany({
      where: {
        patientId: filters?.patientId,
        appointmentId: filters?.appointmentId,
        status: filters?.status,
        createdAt: {
          gte: filters?.fromDate,
          lte: filters?.toDate,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return payments.map(p => this.formatResponse(p));
  }

  async findOne(id: number): Promise<PaymentResponseDto> {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      throw new NotFoundException(`Pago con ID ${id} no encontrado`);
    }

    return this.formatResponse(payment);
  }

  async findByPatient(patientId: number): Promise<PaymentResponseDto[]> {
    // Validar que el paciente existe
    const patient = await this.prisma.patient.findUnique({
      where: { id: patientId },
    });

    if (!patient) {
      throw new NotFoundException(`Paciente con ID ${patientId} no encontrado`);
    }

    const payments = await this.prisma.payment.findMany({
      where: { patientId },
      orderBy: { createdAt: 'desc' },
    });

    return payments.map(p => this.formatResponse(p));
  }

  async findByStatus(status: PaymentStatus): Promise<PaymentResponseDto[]> {
    const payments = await this.prisma.payment.findMany({
      where: { status },
      orderBy: { createdAt: 'desc' },
    });

    return payments.map(p => this.formatResponse(p));
  }

  async update(
    id: number,
    updatePaymentDto: UpdatePaymentDto,
  ): Promise<PaymentResponseDto> {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      throw new NotFoundException(`Pago con ID ${id} no encontrado`);
    }

    const updated = await this.prisma.payment.update({
      where: { id },
      data: {
        status: updatePaymentDto.status,
        amount: updatePaymentDto.amount,
        paidAt: updatePaymentDto.paidAt
          ? new Date(updatePaymentDto.paidAt)
          : undefined,
      },
    });

    return this.formatResponse(updated);
  }

  async remove(id: number): Promise<{ message: string }> {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      throw new NotFoundException(`Pago con ID ${id} no encontrado`);
    }

    // No eliminar, solo cambiar estado a CANCELADO
    await this.prisma.payment.update({
      where: { id },
      data: { status: 'CANCELADO' },
    });

    return { message: `Pago con ID ${id} cancelado exitosamente` };
  }

  private formatResponse(payment: Payment): PaymentResponseDto {
    return {
      id: payment.id,
      patientId: payment.patientId,
      appointmentId: payment.appointmentId,
      amount: payment.amount.toString(),
      status: payment.status,
      paidAt: payment.paidAt,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    };
  }
}
