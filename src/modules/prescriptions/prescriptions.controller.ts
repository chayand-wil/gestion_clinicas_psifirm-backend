import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PrescriptionsService } from './prescriptions.service';
import { CreateDeliveryDto, CreatePrescriptionDto, UpdatePrescriptionDto } from './dto';

@ApiTags('prescriptions')
@Controller('prescriptions')
export class PrescriptionsController {
  constructor(private readonly service: PrescriptionsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una prescripción' })
  @ApiResponse({ status: 201, description: 'Prescripción creada' })
  create(@Body() dto: CreatePrescriptionDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar prescripciones' })
  @ApiQuery({ name: 'recordId', required: false, type: Number })
  @ApiQuery({ name: 'productId', required: false, type: Number })
  @ApiQuery({ name: 'prescribedBy', required: false, type: Number })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  findAll(
    @Query('recordId', new ParseIntPipe({ optional: true })) recordId?: number,
    @Query('productId', new ParseIntPipe({ optional: true })) productId?: number,
    @Query('prescribedBy', new ParseIntPipe({ optional: true })) prescribedBy?: number,
    @Query('isActive', new ParseBoolPipe({ optional: true })) isActive?: boolean,
  ) {
    return this.service.findAll({ recordId, productId, prescribedBy, isActive });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener prescripción por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar prescripción' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePrescriptionDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar prescripción' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  @Post(':id/deliveries')
  @ApiOperation({ summary: 'Registrar entrega de prescripción' })
  createDelivery(
    @Param('id', ParseIntPipe) prescriptionId: number,
    @Body() dto: CreateDeliveryDto,
  ) {
    return this.service.createDelivery(prescriptionId, dto);
  }

  @Get(':id/deliveries')
  @ApiOperation({ summary: 'Listar entregas de una prescripción' })
  findDeliveries(@Param('id', ParseIntPipe) prescriptionId: number) {
    return this.service.findDeliveries(prescriptionId);
  }
}
