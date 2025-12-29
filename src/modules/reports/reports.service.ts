import { Injectable } from '@nestjs/common';
import { AppointmentStatus, PaymentStatus, PayrollStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

interface IncomeReportParams {
  fromDate?: string;
  toDate?: string;
  groupBy?: 'day' | 'month';
}

interface PayrollReportParams {
  fromDate?: string;
  toDate?: string;
  employeeId?: number;
}

interface SalesReportParams {
  fromDate?: string;
  toDate?: string;
  patientId?: number;
}

interface PatientsBySpecialtyParams {
  fromDate?: string;
  toDate?: string;
}

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async getIncomeReport(params: IncomeReportParams) {
    const from = this.parseDate(params.fromDate);
    const to = this.parseDate(params.toDate);

    const payments = await this.prisma.payment.findMany({
      where: { status: PaymentStatus.PAGADO },
      select: { id: true, amount: true, paidAt: true, createdAt: true },
      orderBy: { paidAt: 'asc' },
    });

    const filtered = payments.filter(p => this.isWithinRange(p.paidAt ?? p.createdAt, from, to));

    const totalCents = filtered.reduce((acc, p) => acc + this.toCents(p.amount), 0);

    const grouped: Record<string, { totalCents: number; count: number }> = {};
    if (params.groupBy) {
      for (const p of filtered) {
        const date = p.paidAt ?? p.createdAt;
        const key = params.groupBy === 'month'
          ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
          : date.toISOString().slice(0, 10);
        grouped[key] = grouped[key] || { totalCents: 0, count: 0 };
        grouped[key].totalCents += this.toCents(p.amount);
        grouped[key].count += 1;
      }
    }

    return {
      totalAmount: this.toAmount(totalCents),
      count: filtered.length,
      groupBy: params.groupBy,
      byPeriod: Object.entries(grouped).map(([period, info]) => ({
        period,
        totalAmount: this.toAmount(info.totalCents),
        count: info.count,
      })),
    };
  }

  async getPayrollsReport(params: PayrollReportParams) {
    const from = this.parseDate(params.fromDate);
    const to = this.parseDate(params.toDate);

    const payrolls = await this.prisma.payroll.findMany({
      where: {
        status: PayrollStatus.PAGADO,
        employeeId: params.employeeId,
      },
      select: {
        id: true,
        employeeId: true,
        netSalary: true,
        paymentDate: true,
        createdAt: true,
      },
      orderBy: { paymentDate: 'asc' },
    });

    const filtered = payrolls.filter(p => this.isWithinRange(p.paymentDate ?? p.createdAt, from, to));

    const totalCents = filtered.reduce((acc, p) => acc + this.toCents(p.netSalary), 0);

    const byEmployee: Record<number, { totalCents: number; count: number }> = {};
    for (const p of filtered) {
      if (!byEmployee[p.employeeId]) {
        byEmployee[p.employeeId] = { totalCents: 0, count: 0 };
      }
      byEmployee[p.employeeId].totalCents += this.toCents(p.netSalary);
      byEmployee[p.employeeId].count += 1;
    }

    return {
      totalPaid: this.toAmount(totalCents),
      count: filtered.length,
      byEmployee: Object.entries(byEmployee).map(([employeeId, data]) => ({
        employeeId: Number(employeeId),
        totalPaid: this.toAmount(data.totalCents),
        count: data.count,
      })),
    };
  }

  async getSalesReport(params: SalesReportParams) {
    const from = this.parseDate(params.fromDate);
    const to = this.parseDate(params.toDate);

    const invoices = await this.prisma.invoice.findMany({
      where: {
        issueDate: {
          gte: from,
          lte: to,
        },
        payment: params.patientId
          ? {
              patientId: params.patientId,
            }
          : undefined,
      },
      include: {
        payment: true,
        items: true,
      },
      orderBy: { issueDate: 'desc' },
    });

    const subtotalCents = invoices.reduce((acc, inv) => acc + this.toCents(inv.subtotal), 0);
    const taxesCents = invoices.reduce((acc, inv) => acc + this.toCents(inv.taxes), 0);
    const totalCents = invoices.reduce((acc, inv) => acc + this.toCents(inv.total), 0);

    return {
      count: invoices.length,
      subtotal: this.toAmount(subtotalCents),
      taxes: this.toAmount(taxesCents),
      total: this.toAmount(totalCents),
      invoices: invoices.map(inv => ({
        id: inv.id,
        number: inv.number,
        paymentId: inv.paymentId,
        patientId: inv.payment?.patientId,
        issueDate: inv.issueDate,
        total: inv.total.toString(),
        taxes: inv.taxes.toString(),
        subtotal: inv.subtotal.toString(),
        createdAt: inv.createdAt,
        items: inv.items.map(item => ({
          id: item.id,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice.toString(),
          total: item.total.toString(),
          appointmentId: item.appointmentId,
          prescriptionDeliveryId: item.prescriptionDeliveryId,
          createdAt: item.createdAt,
        })),
      })),
    };
  }

  async getPatientsBySpecialty(params: PatientsBySpecialtyParams) {
    const from = this.parseDate(params.fromDate);
    const to = this.parseDate(params.toDate);

    const appointments = await this.prisma.appointment.findMany({
      where: {
        status: AppointmentStatus.COMPLETADA,
        date: {
          gte: from,
          lte: to,
        },
      },
      select: {
        id: true,
        patientId: true,
        employee: {
          select: {
            specialtyAreaId: true,
            specialtyArea: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    const grouped: Record<string, { specialtyAreaId: number | null; specialtyAreaName: string; uniquePatients: Set<number>; appointments: number }> = {};

    for (const appt of appointments) {
      const areaId = appt.employee.specialtyAreaId;
      const key = areaId !== null ? String(areaId) : 'sin_area';
      const areaName = appt.employee.specialtyArea?.name ?? 'Sin área asignada';

      if (!grouped[key]) {
        grouped[key] = {
          specialtyAreaId: areaId,
          specialtyAreaName: areaName,
          uniquePatients: new Set<number>(),
          appointments: 0,
        };
      }

      grouped[key].appointments += 1;
      grouped[key].uniquePatients.add(appt.patientId);
    }

    return Object.values(grouped).map(group => ({
      specialtyAreaId: group.specialtyAreaId,
      specialtyAreaName: group.specialtyAreaName,
      totalAppointments: group.appointments,
      uniquePatients: group.uniquePatients.size,
    }));
  }

  private parseDate(value?: string): Date | undefined {
    if (!value) return undefined;
    const date = new Date(value);
    return isNaN(date.getTime()) ? undefined : date;
  }

  private isWithinRange(date: Date, from?: Date, to?: Date): boolean {
    if (from && date < from) return false;
    if (to && date > to) return false;
    return true;
  }

  private toCents(value: any): number {
    return Math.round(Number(value) * 100);
  }

  private toAmount(cents: number): string {
    return (cents / 100).toFixed(2);
  }
}
