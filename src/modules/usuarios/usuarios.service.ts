import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  private async validateRelations(roleId?: number) {
    if (roleId != null) {
      const role = await this.prisma.role.findUnique({ where: { id: roleId } });
      if (!role) {
        throw new BadRequestException('El rol no existe.');
      }
    }
    return { roleId };
  }

  async create(createUsuarioDto: CreateUsuarioDto) {
    const { passwordHash, roleId, ...rest } = createUsuarioDto;

    const relations = await this.validateRelations(roleId);

    const hashedPassword = passwordHash
      ? passwordHash.startsWith('$2')
        ? passwordHash
        : await bcrypt.hash(passwordHash, 10)
      : await bcrypt.hash('default123', 10);

    const user = await this.prisma.user.create({
      data: {
        ...rest,
        passwordHash: hashedPassword,
        isActive: true,
      },
      include: {
        roles: {
          include: { role: true },
        },
      },
    });

    // Asignar rol si se proporciona
    if (relations.roleId) {
      await this.prisma.userRole.upsert({
        where: { userId_roleId: { userId: user.id, roleId: relations.roleId } },
        update: {},
        create: { userId: user.id, roleId: relations.roleId },
      });
    }

    return user;
  }

  findAll() {
    return this.prisma.user.findMany({
      include: {
        roles: {
          include: { role: true },
        },
        employee: true,
        patient: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        roles: {
          include: { role: true },
        },
        employee: true,
        patient: true,
      },
    });
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    const { passwordHash, roleId, ...rest } = updateUsuarioDto;

    const relations = await this.validateRelations(roleId);

    const hashedPassword = passwordHash
      ? passwordHash.startsWith('$2')
        ? passwordHash
        : await bcrypt.hash(passwordHash, 10)
      : undefined;

    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...rest,
        ...(hashedPassword && { passwordHash: hashedPassword }),
      },
      include: {
        roles: {
          include: { role: true },
        },
        employee: true,
        patient: true,
      },
    });

    // Asignar rol si se proporciona
    if (relations.roleId) {
      await this.prisma.userRole.upsert({
        where: { userId_roleId: { userId: user.id, roleId: relations.roleId } },
        update: {},
        create: { userId: user.id, roleId: relations.roleId },
      });
    }

    return user;
  }

  remove(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
