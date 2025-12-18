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

    // Creación interna: usuario activo y verificado por defecto
    const user = await this.prisma.user.create({
      data: {
        ...rest,
        passwordHash: hashedPassword,
        isActive: true,
        isEmailVerified: true, // Verificado automáticamente para creación interna
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

  async remove(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        employee: { select: { id: true } },
        patient: { select: { id: true } },
        roles: { select: { roleId: true } },
      },
    });

    if (!user) {
      throw new BadRequestException('El usuario no existe.');
    }

    if (user.employee || user.patient) {
      throw new BadRequestException(
        'No se puede eliminar el usuario porque tiene dependencias (empleado o paciente). Desactive el usuario en su lugar o elimine las dependencias primero.'
      );
    }

    return this.prisma.$transaction(async (tx) => {
      if (user.roles?.length) {
        await tx.userRole.deleteMany({ where: { userId: id } });
      }
      return tx.user.delete({ where: { id } });
    });
  }
}
