import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
        employee: true,
        patient: true,
      },
    });

    if (!user || !user.passwordHash || user.isActive === false) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    const roleNames = user.roles
      .map((relation) => relation.role?.name)
      .filter((name): name is string => Boolean(name));

    const payload = {
      sub: user.id,
      email: user.email,
      roles: roleNames,
    };

    const displayName = user.employee
      ? `${user.employee.firstName} ${user.employee.lastName}`
      : user.patient
        ? `${user.patient.firstName} ${user.patient.lastName}`
        : user.username;

    return {
      access_token: this.jwtService.sign(payload),
      usuario: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName,
        roles: roleNames,
        employeeId: user.employee?.id,
        patientId: user.patient?.id,
      },
    };
  }

  async validateUser(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
        employee: true,
        patient: true,
      },
    });
  }
}
