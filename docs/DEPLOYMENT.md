# Guía de Deployment - Sistema de Verificación de Email

## Pre-requisitos

- Node.js 18+
- npm o yarn
- MySQL 8.0+
- Cuenta en proveedor de email (SendGrid, AWS SES, etc.)

## Pasos de Instalación Local

### 1. Instalar dependencias

```bash
cd /home/jonwilson/Escritorio/backend_plataforma_gestion_psifirm
npm install
```

### 2. Configurar variables de entorno

```bash
# Crear archivo .env basado en .env.example
cp .env.example .env
```

```env
# .env
DATABASE_URL="mysql://user:password@localhost:3306/psifirm_clinics"
JWT_SECRET="super-secret-key-change-this-in-production"


SENDGRID_API_KEY="sg_xxxxxxxxx"
SENDGRID_FROM_EMAIL="noreply@psifirm.com"

 

### 3. Ejecutar migraciones

```bash
# Aplicar todas las migraciones
npx prisma migrate deploy

# O ejecutar en modo dev (genera migración faltante)
npx prisma migrate dev
```

### 4. (Opcional) Ejecutar seed de datos

```bash
npx prisma db seed
```

### 5. Compilar el proyecto

```bash
npm run build
```

### 6. Iniciar en desarrollo

```bash
npm run start:dev
```

## Implementar Proveedor de Email Real

### Opción 1: SendGrid (Recomendado)

#### Instalación

```bash
npm install @sendgrid/mail
```

#### Actualizar `email.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class EmailService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async sendVerificationCode(email: string, code: string): Promise<void> {
    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@psifirm.com',
      subject: 'Código de verificación de correo - PsiFirm',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
          <h1 style="color: #667eea; text-align: center;">Verifica tu correo electrónico</h1>
          
          <p>Hola,</p>
          
          <p>Hemos recibido una solicitud para verificar tu correo electrónico en <strong>PsiFirm</strong>.</p>
          
          <p style="text-align: center; margin: 30px 0;">
            <span style="font-size: 48px; font-weight: bold; letter-spacing: 5px; color: #667eea;">
              ${code}
            </span>
          </p>
          
          <p style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; color: #666;">
            Este código es válido por <strong>15 minutos</strong>. No lo compartas con nadie.
          </p>
          
          <p>Si no solicitaste este código, ignora este mensaje.</p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          
          <footer style="text-align: center; color: #999; font-size: 12px;">
            <p>© 2025 PsiFirm - Gestión Clínica. Todos los derechos reservados.</p>
          </footer>
        </div>
      `,
    };

    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error('Error enviando email:', error);
      throw error;
    }
  }

  async sendWelcomeEmail(email: string, username: string): Promise<void> {
    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@psifirm.com',
      subject: '¡Bienvenido a PsiFirm!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
          <h1 style="color: #667eea; text-align: center;">¡Bienvenido ${username}!</h1>
          <p>Tu cuenta ha sido creada exitosamente.</p>
          <p><a href="https://psifirm.com/login" style="background-color: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Iniciar Sesión</a></p>
        </div>
      `,
    };

    await sgMail.send(msg);
  }
}
```

### Opción 2: AWS SES

#### Instalación

```bash
npm install @aws-sdk/client-ses
```

#### Actualizar `email.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

@Injectable()
export class EmailService {
  private sesClient: SESClient;

  constructor() {
    this.sesClient = new SESClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async sendVerificationCode(email: string, code: string): Promise<void> {
    const command = new SendEmailCommand({
      Source: process.env.SENDGRID_FROM_EMAIL || 'noreply@psifirm.com',
      Destination: { ToAddresses: [email] },
      Message: {
        Subject: { Data: 'Código de verificación de correo - PsiFirm' },
        Body: {
          Html: {
            Data: `
              <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
                <h1 style="color: #667eea; text-align: center;">Verifica tu correo electrónico</h1>
                <p>Tu código de verificación es:</p>
                <p style="text-align: center; font-size: 48px; font-weight: bold; letter-spacing: 5px; color: #667eea;">
                  ${code}
                </p>
                <p style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
                  Este código es válido por 15 minutos.
                </p>
              </div>
            `,
          },
        },
      },
    });

    await this.sesClient.send(command);
  }
}
```

### Opción 3: Nodemailer (Gmail SMTP)

#### Instalación

```bash
npm install nodemailer
npm install -D @types/nodemailer
```

#### Actualizar `email.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendVerificationCode(email: string, code: string): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL || 'noreply@psifirm.com',
      to: email,
      subject: 'Código de verificación de correo - PsiFirm',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
          <h1 style="color: #667eea; text-align: center;">Verifica tu correo</h1>
          <p style="text-align: center; font-size: 48px; font-weight: bold; letter-spacing: 5px; color: #667eea;">
            ${code}
          </p>
          <p>Válido por 15 minutos.</p>
        </div>
      `,
    });
  }
}
```

## Deployment a Producción

### 1. Renderizar (Recomendado para NestJS)

```bash
# 1. Crear cuenta en render.com
# 2. Conectar repositorio GitHub
# 3. Crear nuevo Web Service
# 4. Configurar variables de entorno
# 5. Desplegar automáticamente
```

### 2. Heroku

```bash
# 1. Instalar Heroku CLI
npm install -g heroku

# 2. Login
heroku login

# 3. Crear aplicación
heroku create psifirm-backend

# 4. Configurar BD (ClearDB)
heroku addons:create cleardb:ignite

# 5. Set env vars
heroku config:set DATABASE_URL=...
heroku config:set JWT_SECRET=...

# 6. Deploy
git push heroku main
```

### 3. DigitalOcean App Platform

```bash
# 1. Crear cuenta
# 2. Conectar repositorio
# 3. Crear App
# 4. Configurar variables de entorno
# 5. Deploy automático
```

## Verificación Post-Deployment

### 1. Validar endpoints

```bash
# Salud
curl http://localhost:3000/health

# Registro
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "Test123456"
  }'
```

### 2. Monitoreo

```bash
# Logs
npm run logs  # O desde dashboard

# Errores
npm run errors:log

# Performance
npm run metrics
```

### 3. Backups

```bash
# Backup diario de BD
mysqldump -u user -p psifirm_clinics > backup_$(date +%Y%m%d).sql

# Automatizar con cron
0 2 * * * /usr/bin/mysqldump -u user -p psifirm_clinics > /backups/backup_$(date +\%Y\%m\%d).sql
```

## Checklist Pre-Producción

- [ ] Variables de entorno configuradas
- [ ] BD en producción verificada
- [ ] Proveedor de email implementado y probado
- [ ] SSL/HTTPS habilitado
- [ ] Rate limiting configurado
- [ ] Logs y monitoreo activos
- [ ] Backups automáticos habilitados
- [ ] CORS configurado correctamente
- [ ] Contraseñas y secrets rotadas
- [ ] Tests de carga ejecutados
- [ ] Plan de contingencia documentado
- [ ] Contacto de soporte establecido

## Troubleshooting

### Problema: Email no se envía

```bash
# 1. Verificar API key
echo $SENDGRID_API_KEY

# 2. Verificar permiso de envío
# SendGrid: Settings > API Keys > Scope

# 3. Verificar sender verificado
# SendGrid: Sender Authentication

# 4. Revisar logs
npm run logs | grep -i email
```

### Problema: Migración fallida

```bash
# 1. Verificar conexión a BD
mysql -h localhost -u user -p psifirm_clinics

# 2. Reset de migraciones (⚠️ SOLO DEV)
npx prisma migrate reset

# 3. Crear migración manual
npx prisma migrate dev --name fix_issue
```

### Problema: JWT expirado

```bash
# Aumentar expiración en auth.module.ts
JwtModule.register({
  secret: process.env.JWT_SECRET,
  signOptions: { expiresIn: '7d' }, // Cambiar aquí
})
```

## Monitoreo Recomendado

### Métricas Clave

- [ ] Tasa de error de registro
- [ ] Tasa de error de verificación
- [ ] Tiempo de envío de email
- [ ] Disponibilidad de endpoints
- [ ] Uso de BD
- [ ] Consumo de API de email

### Alertas

```typescript
// Error rate > 5%
if (errorRate > 0.05) {
  await sendAlert('High error rate in auth module');
}

// Email delivery time > 5s
if (emailDeliveryTime > 5000) {
  await sendAlert('Slow email delivery');
}
```

---

**Última actualización**: 18 de Diciembre de 2025
