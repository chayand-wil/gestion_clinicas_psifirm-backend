import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ReportsService } from './reports.service';

@ApiTags('reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('income')
  @ApiOperation({ summary: 'Ingresos por período' })
  @ApiQuery({ name: 'fromDate', required: false, type: String })
  @ApiQuery({ name: 'toDate', required: false, type: String })
  @ApiQuery({ name: 'groupBy', required: false, enum: ['day', 'month'] })
  income(
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('groupBy') groupBy?: 'day' | 'month',
  ) {
    return this.reportsService.getIncomeReport({ fromDate, toDate, groupBy });
  }

  @Get('payrolls')
  @ApiOperation({ summary: 'Pagos realizados a empleados' })
  @ApiQuery({ name: 'fromDate', required: false, type: String })
  @ApiQuery({ name: 'toDate', required: false, type: String })
  @ApiQuery({ name: 'employeeId', required: false, type: Number })
  payrolls(
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('employeeId') employeeId?: string,
  ) {
    return this.reportsService.getPayrollsReport({
      fromDate,
      toDate,
      employeeId: employeeId ? Number(employeeId) : undefined,
    });
  }

  @Get('sales')
  @ApiOperation({ summary: 'Historial de ventas (facturas)' })
  @ApiQuery({ name: 'fromDate', required: false, type: String })
  @ApiQuery({ name: 'toDate', required: false, type: String })
  @ApiQuery({ name: 'patientId', required: false, type: Number })
  sales(
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('patientId') patientId?: string,
  ) {
    return this.reportsService.getSalesReport({
      fromDate,
      toDate,
      patientId: patientId ? Number(patientId) : undefined,
    });
  }

  @Get('patients-by-specialty')
  @ApiOperation({ summary: 'Pacientes atendidos por especialidad' })
  @ApiQuery({ name: 'fromDate', required: false, type: String })
  @ApiQuery({ name: 'toDate', required: false, type: String })
  patientsBySpecialty(
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    return this.reportsService.getPatientsBySpecialty({ fromDate, toDate });
  }
}
