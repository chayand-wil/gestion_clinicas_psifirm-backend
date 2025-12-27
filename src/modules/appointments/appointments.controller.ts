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
import { AppointmentsService } from './appointments.service';
import { AppointmentStatus } from '@prisma/client';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentResponseDto } from './dto/appointment-response.dto';

@ApiTags('appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva cita' })
  @ApiResponse({
    status: 201,
    description: 'Cita creada exitosamente',
    type: AppointmentResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 404, description: 'Paciente o empleado no encontrado' })
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las citas' })
  @ApiQuery({ name: 'patientId', required: false, type: Number })
  @ApiQuery({ name: 'employeeId', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'fromDate', required: false, type: String })
  @ApiQuery({ name: 'toDate', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Lista de citas',
    isArray: true,
    type: AppointmentResponseDto,
  })
  findAll(
    @Query('patientId', new ParseIntPipe({ optional: true }))
    patientId?: number,
    @Query('employeeId', new ParseIntPipe({ optional: true }))
    employeeId?: number,
    @Query('status', new ParseEnumPipe(AppointmentStatus, { optional: true }))
    status?: AppointmentStatus,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    return this.appointmentsService.findAll({
      patientId,
      employeeId,
      status,
      fromDate: fromDate ? new Date(fromDate) : undefined,
      toDate: toDate ? new Date(toDate) : undefined,
    });
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Obtener citas de un paciente específico' })
  @ApiResponse({
    status: 200,
    description: 'Citas del paciente',
    isArray: true,
  })
  @ApiResponse({ status: 404, description: 'Paciente no encontrado' })
  findByPatient(@Param('patientId', ParseIntPipe) patientId: number) {
    return this.appointmentsService.findByPatient(patientId);
  }

  @Get('employee/:employeeId')
  @ApiOperation({ summary: 'Obtener citas de un empleado específico' })
  @ApiResponse({
    status: 200,
    description: 'Citas del empleado',
    isArray: true,
  })
  @ApiResponse({ status: 404, description: 'Empleado no encontrado' })
  findByEmployee(@Param('employeeId', ParseIntPipe) employeeId: number) {
    return this.appointmentsService.findByEmployee(employeeId);
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Obtener citas por estado' })
  @ApiResponse({
    status: 200,
    description: 'Citas con el estado especificado',
    isArray: true,
  })
  findByStatus(
    @Param('status', new ParseEnumPipe(AppointmentStatus)) status: AppointmentStatus,
  ) {
    return this.appointmentsService.findByStatus(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener cita por ID' })
  @ApiResponse({
    status: 200,
    description: 'Cita encontrada',
    type: AppointmentResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Cita no encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una cita' })
  @ApiResponse({
    status: 200,
    description: 'Cita actualizada exitosamente',
    type: AppointmentResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 404, description: 'Cita no encontrada' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.update(id, updateAppointmentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una cita' })
  @ApiResponse({
    status: 200,
    description: 'Cita eliminada exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Cita no encontrada' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentsService.remove(id);
  }
}
