import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

/**
 * Servicio compartido para operaciones de autenticación comunes
 * Contiene utilidades reutilizables en todos los servicios de auth
 */
@Injectable()
export class SharedAuthService {
  /**
   * Genera un código de 4 dígitos aleatorio
   */
  generateVerificationCode(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  /**
   * Calcula la fecha de expiración (15 minutos desde ahora)
   */
  getVerificationCodeExpiration(): Date {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);
    return expiresAt;
  }

  /**
   * Calcula la fecha de expiración del token de recuperación (60 minutos desde ahora)
   */
  getPasswordResetExpiration(): Date {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 60);
    return expiresAt;
  }

  /**
   * Hashea una contraseña usando bcrypt
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  /**
   * Valida una contraseña contra su hash
   */
  async validatePassword(
    password: string,
    passwordHash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
  }
}
