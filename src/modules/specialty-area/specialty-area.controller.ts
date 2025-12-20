import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SpecialtyAreaService } from './specialty-area.service';

@ApiTags('specialty-areas')
@Controller('specialty-areas')
export class SpecialtyAreaController {
  constructor(private readonly specialtyAreaService: SpecialtyAreaService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las áreas de especialidad' })
  @ApiResponse({ status: 200, description: 'Lista de áreas de especialidad' })
  findAll() {
    return this.specialtyAreaService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener área de especialidad por ID' })
  @ApiResponse({ status: 200, description: 'Área de especialidad encontrada' })
  @ApiResponse({ status: 404, description: 'Área de especialidad no encontrada' })
  findOne(@Param('id') id: string) {
    return this.specialtyAreaService.findOne(+id);
  }
}
