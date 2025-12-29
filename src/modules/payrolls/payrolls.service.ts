import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PayrollStatus } from '@prisma/client';
import { CreatePayrollDto } from './dto/create-payroll.dto';
import { UpdatePayrollDto } from './dto/update-payroll.dto';
import { PayrollResponseDto } from './dto/payroll-response.dto';
import { CalculatePayrollDto } from './dto/calculate-payroll.dto';

interface PayrollFilters {
  employeeId?: number;
  status?: PayrollStatus;
  fromDate?: Date;
  toDate?: Date;
}

@Injectable()
export class PayrollsService {
  constructor(private prisma: PrismaService) {}

  private getDefaultIgssRate(): number {
    const env = process.env.IGSS_RATE;
    const rate = env ? parseFloat(env) : 0.0483; // configurable, default 4.83%
    return isNaN(rate) ? 0.0483 : rate;
  }

  private compute(
    baseSalary: number,
    bonus: number,
    deductions: number,
    igssRate?: number,
  ) {
    const rate = igssRate ?? this.getDefaultIgssRate();
    const igss = +(baseSalary * rate).toFixed(2);
    const netSalary = +(baseSalary + bonus - igss - deductions).toFixed(2);
    return { igss, netSalary };
  }

  async calculate(dto: CalculatePayrollDto) {
    const employee = await this.prisma.employee.findUnique({
      where: { id: dto.employeeId },
    });
    if (!employee) {
      throw new NotFoundException(`Empleado con ID ${dto.employeeId} no encontrado`);
    }
    const baseSalary = dto.baseSalary ?? Number(employee.baseSalary ?? 0);
    const bonus = dto.bonus ?? 0;
    const deductions = dto.deductions ?? 0;
    const { igss, netSalary } = this.compute(baseSalary, bonus, deductions, dto.igssRate);
    return {
      employeeId: dto.employeeId,
      periodStart: new Date(dto.periodStart),
      periodEnd: new Date(dto.periodEnd),
      baseSalary,
      bonus,
      igss,
      deductions,
      netSalary,
    };
  }

  async create(dto: CreatePayrollDto): Promise<PayrollResponseDto> {
    const employee = await this.prisma.employee.findUnique({ where: { id: dto.employeeId } });
    if (!employee) {
      throw new NotFoundException(`Empleado con ID ${dto.employeeId} no encontrado`);
    }

    const periodStart = new Date(dto.periodStart);
    const periodEnd = new Date(dto.periodEnd);
    if (isNaN(periodStart.getTime()) || isNaN(periodEnd.getTime()) || periodEnd < periodStart) {
      throw new BadRequestException('Rango de fechas inválido');
    }

    const baseSalary = dto.baseSalary ?? Number(employee.baseSalary ?? 0);
    const bonus = dto.bonus ?? 0;
    const deductions = dto.deductions ?? 0;
    const { igss, netSalary } = this.compute(baseSalary, bonus, deductions, dto.igssRate);

    const created = await this.prisma.payroll.create({
      data: {
        employeeId: dto.employeeId,
        periodStart,
        periodEnd,
        baseSalary,
        bonus,
        igss,
        deductions,
        netSalary,
        status: 'PENDIENTE',
      },
    });

    await this.prisma.auditLog.create({
      data: {
        action: 'INSERT',
        entity: 'Payroll',
        entityId: String(created.id),
        newData: created as unknown as any,
      },
    });

    return this.formatResponse(created);
  }

  async findAll(filters?: PayrollFilters): Promise<PayrollResponseDto[]> {
    const payrolls = await this.prisma.payroll.findMany({
      where: {
        employeeId: filters?.employeeId,
        status: filters?.status,
        createdAt: { gte: filters?.fromDate, lte: filters?.toDate },
      },
      orderBy: { createdAt: 'desc' },
    });
    return payrolls.map(p => this.formatResponse(p));
  }

  async findOne(id: number): Promise<PayrollResponseDto> {
    const p = await this.prisma.payroll.findUnique({ where: { id } });
    if (!p) throw new NotFoundException(`Nómina con ID ${id} no encontrada`);
    return this.formatResponse(p);
  }

  async update(id: number, dto: UpdatePayrollDto): Promise<PayrollResponseDto> {
    const existing = await this.prisma.payroll.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Nómina con ID ${id} no encontrada`);

    const updated = await this.prisma.payroll.update({
      where: { id },
      data: {
        baseSalary: dto.baseSalary,
        bonus: dto.bonus,
        igss: dto.igss,
        deductions: dto.deductions,
        netSalary: dto.netSalary,
        status: dto.status,
        paymentDate: dto.paymentDate ? new Date(dto.paymentDate) : undefined,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        action: 'UPDATE',
        entity: 'Payroll',
        entityId: String(id),
        oldData: existing as unknown as any,
        newData: updated as unknown as any,
      },
    });

    return this.formatResponse(updated);
  }

  async pay(id: number, paymentDate?: string): Promise<PayrollResponseDto> {
    const existing = await this.prisma.payroll.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Nómina con ID ${id} no encontrada`);
    if (existing.status === 'CANCELADO') throw new BadRequestException('No se puede pagar una nómina cancelada');

    const updated = await this.prisma.payroll.update({
      where: { id },
      data: {
        status: 'PAGADO',
        paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
      },
    });

    await this.prisma.auditLog.create({
      data: {
        action: 'UPDATE',
        entity: 'Payroll',
        entityId: String(id),
        oldData: existing as unknown as any,
        newData: updated as unknown as any,
      },
    });

    return this.formatResponse(updated);
  }

  async cancel(id: number): Promise<{ message: string }> {
    const existing = await this.prisma.payroll.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Nómina con ID ${id} no encontrada`);

    const updated = await this.prisma.payroll.update({
      where: { id },
      data: { status: 'CANCELADO' },
    });

    await this.prisma.auditLog.create({
      data: {
        action: 'UPDATE',
        entity: 'Payroll',
        entityId: String(id),
        oldData: existing as unknown as any,
        newData: updated as unknown as any,
      },
    });

    return { message: `Nómina con ID ${id} cancelada exitosamente` };
  }

  private formatResponse(p: any): PayrollResponseDto {
    return {
      id: p.id,
      employeeId: p.employeeId,
      periodStart: p.periodStart,
      periodEnd: p.periodEnd,
      baseSalary: p.baseSalary.toString(),
      bonus: p.bonus.toString(),
      igss: p.igss.toString(),
      deductions: p.deductions.toString(),
      netSalary: p.netSalary.toString(),
      status: p.status,
      paymentDate: p.paymentDate,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    };
  }
}
