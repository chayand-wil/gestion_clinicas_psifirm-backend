import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { EmailService } from '../../email/email.service';
import { SharedAuthService } from './shared-auth.service';
import { VerifyEmailDto } from '../dto/verify-email.dto';
import { ResendCodeDto } from '../dto/resend-code.dto';

/**
 * Servicio especializado para manejo de verificación de emails
 */
@Injectable()
export class VerificationService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private sharedAuth: SharedAuthService,
  ) {}

  /**
   * Envía el código de verificación por correo
   */
  private async sendVerificationEmail(
    email: string,
    code: string,
  ): Promise<void> {
    await this.emailService.sendVerificationCode(email, code);
  }

  /**
   * Crea un registro de verificación de email para un usuario
   */
  async createEmailVerification(userId: number): Promise<string> {
    const code = this.sharedAuth.generateVerificationCode();
    const expiresAt = this.sharedAuth.getVerificationCodeExpiration();

    await this.prisma.emailVerification.create({
      data: {
        userId,
        code,
        expiresAt,
      },
    });

    return code;
  }

  /**
   * Envía un código de verificación a un email
   */
  async sendVerificationCode(email: string, userId: number): Promise<void> {
    const code = await this.createEmailVerification(userId);
    await this.sendVerificationEmail(email, code);
  }

  /**
   * Verifica el correo con el código proporcionado
   */
  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const { email, code } = verifyEmailDto;

    // Buscar el usuario
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    // Si ya está verificado
    if (user.isEmailVerified) {
      throw new BadRequestException('El correo ya ha sido verificado');
    }

    // Buscar la verificación pendiente
    const emailVerification = await this.prisma.emailVerification.findFirst({
      where: {
        userId: user.id,
        isUsed: false,
      },
    });

    if (!emailVerification) {
      throw new BadRequestException(
        'No hay un código de verificación pendiente. Solicita uno nuevo.',
      );
    }

    // Verificar si el código ha expirado
    if (new Date() > emailVerification.expiresAt) {
      throw new BadRequestException('El código de verificación ha expirado');
    }

    // Verificar máximo de intentos
    if (emailVerification.attempts >= emailVerification.maxAttempts) {
      throw new BadRequestException(
        'Máximo de intentos alcanzado. Solicita un nuevo código.',
      );
    }

    // Verificar el código
    if (emailVerification.code !== code) {
      // Incrementar intentos
      await this.prisma.emailVerification.update({
        where: { id: emailVerification.id },
        data: { attempts: emailVerification.attempts + 1 },
      });

      const remainingAttempts =
        emailVerification.maxAttempts - emailVerification.attempts - 1;
      throw new BadRequestException(
        `Código incorrecto. Tienes ${remainingAttempts} intentos restantes.`,
      );
    }

    // Marcar como usado y verificar el correo
    await Promise.all([
      this.prisma.emailVerification.update({
        where: { id: emailVerification.id },
        data: {
          isUsed: true,
          usedAt: new Date(),
        },
      }),
      this.prisma.user.update({
        where: { id: user.id },
        data: { isEmailVerified: true },
      }),
    ]);

    return {
      message: 'Correo verificado exitosamente',
      email: user.email,
      verified: true,
    };
  }

  /**
   * Reenvía el código de verificación
   */
  async resendVerificationCode(resendCodeDto: ResendCodeDto) {
    const { email } = resendCodeDto;

    // Buscar el usuario
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('El correo ya ha sido verificado');
    }

    // Marcar códigos anteriores como usados
    await this.prisma.emailVerification.updateMany({
      where: {
        userId: user.id,
        isUsed: false,
      },
      data: { isUsed: true },
    });

    // Generar nuevo código
    const code = this.sharedAuth.generateVerificationCode();
    const expiresAt = this.sharedAuth.getVerificationCodeExpiration();

    // Guardar nuevo código
    await this.prisma.emailVerification.create({
      data: {
        userId: user.id,
        code,
        expiresAt,
      },
    });

    // Enviar código
    await this.sendVerificationEmail(email, code);

    return {
      message: 'Se ha enviado un nuevo código de verificación al correo',
      email: user.email,
    };
  }
}
