import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  ParseIntPipe,
  Patch,
  Delete,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { EmployeeScheduleService } from './employee-schedule.service';
import { CreateEmployeeScheduleDto } from './dto/create-employee-schedule.dto';
import { UpdateEmployeeScheduleDto } from './dto/update-employee-schedule.dto';
import { EmployeeScheduleResponseDto } from './dto/employee-schedule-response.dto';

@ApiTags('employee-schedules')
@Controller('employee-schedules')
export class EmployeeScheduleController {
  constructor(
    private readonly employeeScheduleService: EmployeeScheduleService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo horario de empleado' })
  @ApiResponse({
    status: 201,
    description: 'Horario creado exitosamente',
    type: EmployeeScheduleResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 404, description: 'Empleado no encontrado' })
  create(@Body() createEmployeeScheduleDto: CreateEmployeeScheduleDto) {
    return this.employeeScheduleService.create(createEmployeeScheduleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los horarios de empleados' })
  @ApiQuery({ name: 'employeeId', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Lista de horarios',
    isArray: true,
    type: EmployeeScheduleResponseDto,
  })
  findAll(
    @Query('employeeId', new ParseIntPipe({ optional: true }))
    employeeId?: number,
  ) {
    return this.employeeScheduleService.findAll(employeeId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener horario por ID' })
  @ApiResponse({
    status: 200,
    description: 'Horario encontrado',
    type: EmployeeScheduleResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Horario no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.employeeScheduleService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un horario' })
  @ApiResponse({
    status: 200,
    description: 'Horario actualizado exitosamente',
    type: EmployeeScheduleResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 404, description: 'Horario no encontrado' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEmployeeScheduleDto: UpdateEmployeeScheduleDto,
  ) {
    return this.employeeScheduleService.update(id, updateEmployeeScheduleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un horario' })
  @ApiResponse({
    status: 200,
    description: 'Horario eliminado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Horario no encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.employeeScheduleService.remove(id);
  }
}
