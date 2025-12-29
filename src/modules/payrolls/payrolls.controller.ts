import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  ParseEnumPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { PayrollsService } from './payrolls.service';
import { PayrollStatus } from '@prisma/client';
import { CreatePayrollDto } from './dto/create-payroll.dto';
import { UpdatePayrollDto } from './dto/update-payroll.dto';
import { PayrollResponseDto } from './dto/payroll-response.dto';
import { CalculatePayrollDto } from './dto/calculate-payroll.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('payrolls')
@UseGuards(JwtAuthGuard)
@Controller('payrolls')
export class PayrollsController {
  constructor(private readonly payrollsService: PayrollsService) {}

  @Post('calculate')
  @ApiOperation({ summary: 'Calcular nómina (sin persistir)' })
  @ApiResponse({ status: 200, description: 'Cálculo de nómina', })
  calculate(@Body() dto: CalculatePayrollDto) {
    return this.payrollsService.calculate(dto);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una nómina' })
  @ApiResponse({ status: 201, description: 'Nómina creada', type: PayrollResponseDto })
  create(@Body() dto: CreatePayrollDto) {
    return this.payrollsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar nóminas' })
  @ApiQuery({ name: 'employeeId', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'fromDate', required: false, type: String })
  @ApiQuery({ name: 'toDate', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Lista de nóminas', isArray: true, type: PayrollResponseDto })
  findAll(
    @Query('employeeId', new ParseIntPipe({ optional: true })) employeeId?: number,
    @Query('status', new ParseEnumPipe(PayrollStatus, { optional: true })) status?: PayrollStatus,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    return this.payrollsService.findAll({
      employeeId,
      status,
      fromDate: fromDate ? new Date(fromDate) : undefined,
      toDate: toDate ? new Date(toDate) : undefined,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener nómina por ID' })
  @ApiResponse({ status: 200, description: 'Nómina encontrada', type: PayrollResponseDto })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.payrollsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar nómina' })
  @ApiResponse({ status: 200, description: 'Nómina actualizada', type: PayrollResponseDto })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePayrollDto) {
    return this.payrollsService.update(id, dto);
  }

  @Post(':id/pay')
  @ApiOperation({ summary: 'Marcar nómina como pagada' })
  @ApiResponse({ status: 200, description: 'Nómina pagada', type: PayrollResponseDto })
  pay(@Param('id', ParseIntPipe) id: number, @Body('paymentDate') paymentDate?: string) {
    return this.payrollsService.pay(id, paymentDate);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancelar nómina' })
  @ApiResponse({ status: 200, description: 'Nómina cancelada' })
  cancel(@Param('id', ParseIntPipe) id: number) {
    return this.payrollsService.cancel(id);
  }
}
