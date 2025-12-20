import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SpecialtyAreaService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.specialtyArea.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        isActive: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const specialtyArea = await this.prisma.specialtyArea.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        isActive: true,
      },
    });

    if (!specialtyArea) {
      throw new NotFoundException(`Área de especialidad con ID ${id} no encontrada`);
    }

    return specialtyArea;
  }
}
