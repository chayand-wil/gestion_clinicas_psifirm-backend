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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { PaymentStatus } from '@prisma/client';
import {
  CreatePaymentDto,
  UpdatePaymentDto,
  PaymentResponseDto,
} from './dto';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo pago' })
  @ApiResponse({
    status: 201,
    description: 'Pago creado exitosamente',
    type: PaymentResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 404, description: 'Paciente o cita no encontrado' })
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los pagos' })
  @ApiQuery({ name: 'patientId', required: false, type: Number })
  @ApiQuery({ name: 'appointmentId', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'fromDate', required: false, type: String })
  @ApiQuery({ name: 'toDate', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Lista de pagos',
    isArray: true,
    type: PaymentResponseDto,
  })
  findAll(
    @Query('patientId', new ParseIntPipe({ optional: true }))
    patientId?: number,
    @Query('appointmentId', new ParseIntPipe({ optional: true }))
    appointmentId?: number,
    @Query('status', new ParseEnumPipe(PaymentStatus, { optional: true }))
    status?: PaymentStatus,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    return this.paymentsService.findAll({
      patientId,
      appointmentId,
      status,
      fromDate: fromDate ? new Date(fromDate) : undefined,
      toDate: toDate ? new Date(toDate) : undefined,
    });
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Obtener pagos de un paciente' })
  @ApiResponse({
    status: 200,
    description: 'Pagos del paciente',
    isArray: true,
    type: PaymentResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Paciente no encontrado' })
  findByPatient(@Param('patientId', ParseIntPipe) patientId: number) {
    return this.paymentsService.findByPatient(patientId);
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Obtener pagos por estado' })
  @ApiResponse({
    status: 200,
    description: 'Pagos con el estado especificado',
    isArray: true,
    type: PaymentResponseDto,
  })
  findByStatus(
    @Param('status', new ParseEnumPipe(PaymentStatus)) status: PaymentStatus,
  ) {
    return this.paymentsService.findByStatus(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener pago por ID' })
  @ApiResponse({
    status: 200,
    description: 'Pago encontrado',
    type: PaymentResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Pago no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.paymentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un pago' })
  @ApiResponse({
    status: 200,
    description: 'Pago actualizado exitosamente',
    type: PaymentResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 404, description: 'Pago no encontrado' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ) {
    return this.paymentsService.update(id, updatePaymentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancelar un pago' })
  @ApiResponse({
    status: 200,
    description: 'Pago cancelado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Pago no encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.paymentsService.remove(id);
  }
}
