# Sistema de Verificación de Correo Electrónico

## Descripción

Sistema completo de registro y verificación de correo electrónico con código de 4 dígitos para la plataforma PsiFirm.

### Flujo

1. **Usuario se registra** → Proporciona email, usuario y contraseña
2. **Sistema genera código** → Código aleatorio de 4 dígitos con expiración de 15 minutos
3. **Se guarda en BD** → Se almacena en tabla `EmailVerification` con timestamp de expiración
4. **Se envía por correo** → Se envía el código al email del usuario
5. **Usuario envía código** → Valida el código mediante endpoint
6. **Se verifica la cuenta** → Si el código es válido, se marca el email como verificado

## Endpoints

### 1. Registro
**POST** `/auth/register`

```json
{
  "email": "usuario@example.com",
  "username": "usuario123",
  "password": "password123"
}
```

**Respuesta exitosa (201):**
```json
{
  "message": "Usuario registrado exitosamente. Se ha enviado un código de verificación al correo.",
  "email": "usuario@example.com"
}
```

**Errores:**
- `409`: Email o usuario ya registrado

---

### 2. Verificar Correo
**POST** `/auth/verify-email`

```json
{
  "email": "usuario@example.com",
  "code": "1234"
}
```

**Respuesta exitosa (200):**
```json
{
  "message": "Correo verificado exitosamente",
  "email": "usuario@example.com",
  "verified": true
}
```

**Errores:**
- `400`: Código incorrecto (máx 3 intentos)
- `400`: Código expirado
- `400`: Usuario no encontrado

---

### 3. Reenviar Código
**POST** `/auth/resend-code`

```json
{
  "email": "usuario@example.com"
}
```

**Respuesta exitosa (200):**
```json
{
  "message": "Se ha enviado un nuevo código de verificación al correo",
  "email": "usuario@example.com"
}
```

---

### 4. Login (Requiere Verificación)
**POST** `/auth/login`

```json
{
  "email": "usuario@example.com",
  "password": "password123"
}
```

**Respuesta exitosa (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "email": "usuario@example.com",
    "username": "usuario123",
    "displayName": "usuario123",
    "roles": []
  }
}
```

**Errores:**
- `401`: Credenciales inválidas
- `401`: Correo no verificado

---

## Características de Seguridad

### Código de Verificación
- **Formato**: 4 dígitos aleatorios (1000-9999)
- **Expiración**: 15 minutos
- **Máximo de intentos**: 3
- **Incremento de intentos**: Se incrementa con cada código incorrecto

### Validaciones
- Email único en el sistema
- Usuario único en el sistema
- Contraseña hasheada con bcrypt (10 rondas)
- Verificación obligatoria para login
- Manejo de errores detallado sin revelar información sensible

---

## Configuración de Email (TODO)

Actualmente, los códigos se muestran en la consola. Para producción:

### SendGrid
```bash
npm install @sendgrid/mail
```

```typescript
// .env
SENDGRID_API_KEY=your_api_key
SENDGRID_FROM_EMAIL=noreply@psifirm.com
```

### AWS SES
```bash
npm install aws-sdk
```

```typescript
// .env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
```

### Nodemailer
```bash
npm install nodemailer
```

```typescript
// .env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_password
```

---

## Base de Datos

### Tabla `User` (Actualizada)
- `isEmailVerified` (Boolean): Indica si el correo está verificado

### Tabla `EmailVerification` (Nueva)
- `id`: ID único
- `userId`: Referencia al usuario
- `code`: Código de 4 dígitos
- `attempts`: Número de intentos fallidos
- `maxAttempts`: Máximo de intentos (3)
- `expiresAt`: Fecha de expiración del código
- `isUsed`: Si el código ya fue utilizado
- `usedAt`: Fecha de uso
- `createdAt`: Fecha de creación

---

## Flujo Completo (Ejemplo)

```
1. POST /auth/register
   ├─ Email: usuario@example.com
   ├─ Usuario: usuario123
   └─ Contraseña: password123
   
2. Sistema:
   ├─ Genera código: 4892
   ├─ Expira en: 15 minutos
   ├─ Guarda en BD
   └─ Envía al correo
   
3. Usuario recibe correo con código: 4892

4. POST /auth/verify-email
   ├─ Email: usuario@example.com
   └─ Código: 4892
   
5. Sistema:
   ├─ Valida código ✓
   ├─ No ha expirado ✓
   ├─ Marca como usado
   ├─ Actualiza isEmailVerified = true
   └─ Responde: "Correo verificado"
   
6. POST /auth/login
   ├─ Email: usuario@example.com
   └─ Contraseña: password123
   
7. Sistema:
   ├─ Valida credenciales ✓
   ├─ Verifica isEmailVerified = true ✓
   ├─ Genera JWT
   └─ Devuelve access_token
```

---

## Próximos Pasos

- [ ] Integrar servicio de email real (SendGrid, AWS SES, etc.)
- [ ] Añadir plantillas HTML para emails
- [ ] Implementar rate limiting en endpoints
- [ ] Añadir logging y monitoreo
- [ ] Pruebas unitarias para servicio de auth
- [ ] Pruebas de integración
