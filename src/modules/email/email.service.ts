import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
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
    // Simulación: simplemente logueamos
    console.log(`
    ╔════════════════════════════════════════╗
    ║  CÓDIGO DE VERIFICACIÓN DE CORREO     ║
    ╚════════════════════════════════════════╝
    Email: ${email}
    Código: ${code}
    Válido por: 15 minutos
    ════════════════════════════════════════
    `);

    // Para producción, usar algo como:
    /*
    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: 'Código de verificación de correo',
      html: `
        <h1>Verifica tu correo electrónico</h1>
        <p>Tu código de verificación es:</p>
        <h2 style="font-size: 24px; font-weight: bold; color: #007bff;">${code}</h2>
        <p>Este código es válido por 15 minutos.</p>
        <p>No compartas este código con nadie.</p>
      `,
    };
    await sgMail.send(msg);
    */
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
