import { Injectable } from '@nestjs/common';
import type { MailService } from '@sendgrid/mail';

// Usamos require para evitar problemas de default/ESM con setApiKey
const sgMail: MailService = require('@sendgrid/mail');

@Injectable()
export class EmailService {
  constructor() {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      console.warn('[EmailService] SENDGRID_API_KEY no está definido. Se omitirá el envío real de correos.');
    } else {
      sgMail.setApiKey(apiKey);
    }
  }

  /**
   * Envía un correo con código de verificación
   * 
   * TODO: Implementar con un proveedor real como:
   * - SendGrid (npm install @sendgrid/mail)
   * - AWS SES
   * - Nodemailer
   * - Mailgun
   */
  async sendVerificationCode(email: string, code: string): Promise<void> {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      console.log('[EmailService] SendGrid sin configurar. Logeando código en consola.');
      console.log(`Código para ${email}: ${code}`);
      return;
    }
    try {
      const msg = {
        to: email,
        from: process.env.SENDGRID_FROM_EMAIL || 'noreply@psifirm.com',
        subject: 'Código de verificación - PsiFirm',
        html: `
          <h1>Verifica tu correo</h1>
          <p>Tu código es: <strong>${code}</strong></p>
          <p>Válido por 15 minutos</p>
        `,
      };
      await sgMail.send(msg);
    } catch (error) {
      console.error('Error enviando email:', error);
      // En desarrollo, no fallar si SendGrid no está configurado
      if (process.env.NODE_ENV === 'production') {
        throw error;
      }
    }
  }

  /**
   * Envía un correo de bienvenida después de verificación
   */
  async sendWelcomeEmail(email: string, username: string): Promise<void> {
    console.log(`[EMAIL] Correo de bienvenida enviado a ${email} para usuario ${username}`);
    
    // TODO: Implementar envío real
  }

  /**
   * Envía un correo de reestablecimiento de contraseña
   */
  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    console.log(`[EMAIL] Correo de reestablecimiento enviado a ${email}`);
    
    // TODO: Implementar envío real
  }
}
