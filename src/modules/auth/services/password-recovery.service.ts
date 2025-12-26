import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { EmailService } from '../../email/email.service';
import { SharedAuthService } from './shared-auth.service';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { randomBytes } from 'crypto';

/**
 * Servicio especializado para manejo de recuperación de contraseñas
 */
@Injectable()
export class PasswordRecoveryService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private sharedAuth: SharedAuthService,
  ) {}

  /**
   * Genera y envía un token de recuperación de contraseña
   */
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    const recoveryToken = randomBytes(32).toString('hex');
    const recoveryExpiresAt = this.sharedAuth.getPasswordResetExpiration();

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        recoveryToken,
        recoveryExpiresAt,
      },
    });

    await this.emailService.sendPasswordResetEmail(email, recoveryToken);

    return {
      message:
        'Se ha enviado un correo con instrucciones para reestablecer tu contraseña',
      email,
    };
  }

  /**
   * Reestablece la contraseña usando el token de recuperación
   */
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, newPassword } = resetPasswordDto;

    const user = await this.prisma.user.findFirst({
      where: {
        recoveryToken: token,
        recoveryExpiresAt: {
          gte: new Date(),
        },
      },
    });

    if (!user) {
      throw new BadRequestException('Token inválido o expirado');
    }

    const hashedPassword = await this.sharedAuth.hashPassword(newPassword);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: hashedPassword,
        recoveryToken: null,
        recoveryExpiresAt: null,
      },
    });

    return {
      message: 'Contraseña actualizada exitosamente',
      email: user.email,
    };
  }
}
