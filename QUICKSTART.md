# 🚀 Quick Start - Sistema de Verificación de Email

## Inicio Rápido en 5 minutos

### Paso 1: Compilar y Ejecutar

```bash
# Terminal 1 - Backend
cd /home/jonwilson/Escritorio/backend_plataforma_gestion_psifirm
npm install  # Si es primera vez
npm run build
npm run start:dev
```

La aplicación estará disponible en `http://localhost:3000`

### Paso 2: Abrir Swagger Documentation

```
http://localhost:3000/api#
```

### Paso 3: Probar Endpoints

#### 1️⃣ **Registrar Usuario**

Click en `POST /auth/register`

```json
{
  "email": "juan@example.com",
  "username": "juan.perez",
  "password": "SecurePass123"
}
```

**Respuesta**: 201 Created

En consola verás:
```
╔════════════════════════════════════════╗
║  CÓDIGO DE VERIFICACIÓN DE CORREO     ║
╚════════════════════════════════════════╝
Email: juan@example.com
Código: 4892
Válido por: 15 minutos
```

**Copia el código** (ej: 4892)

---

#### 2️⃣ **Verificar Email**

Click en `POST /auth/verify-email`

```json
{
  "email": "juan@example.com",
  "code": "4892"
}
```

**Respuesta**: 200 OK
```json
{
  "message": "Correo verificado exitosamente",
  "email": "juan@example.com",
  "verified": true
}
```

---

#### 3️⃣ **Iniciar Sesión**

Click en `POST /auth/login`

```json
{
  "email": "juan@example.com",
  "password": "SecurePass123"
}
```

**Respuesta**: 200 OK
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "usuario": {
    "id": 1,
    "email": "juan@example.com",
    "username": "juan.perez",
    "displayName": "juan.perez",
    "roles": []
  }
}
```

---

## Casos de Error para Probar

### ❌ Código Incorrecto

```json
{
  "email": "juan@example.com",
  "code": "0000"
}
```

**Respuesta**: 400 Bad Request
```json
{
  "message": "Código incorrecto. Tienes 2 intentos restantes."
}
```

---

### ❌ Email Duplicado

```json
{
  "email": "juan@example.com",
  "username": "otro.usuario",
  "password": "SecurePass123"
}
```

**Respuesta**: 409 Conflict
```json
{
  "message": "El email o usuario ya está registrado"
}
```

---

### ❌ Login sin Verificar

```json
{
  "email": "nuevo@example.com",
  "password": "SecurePass123"
}
```

(Sin verificar antes)

**Respuesta**: 401 Unauthorized
```json
{
  "message": "Debes verificar tu correo antes de iniciar sesión"
}
```

---

## 📊 Diagrama Visual

```
┌─────────────────────┐
│   Usuario Nuevo     │
└──────────┬──────────┘
           │
    POST /auth/register
           │
    ┌──────▼──────┐
    │ 1. Hash pwd │
    │ 2. Gen código
    │ 3. Save BD  │
    └──────┬──────┘
           │
    📧 Ver código en consola
           │
    ┌──────▼──────────┐
    │ POST /verify-   │
    │ email           │
    └──────┬──────────┘
           │
    ┌──────▼──────┐
    │ ✓ Verificado│
    └──────┬──────┘
           │
    POST /auth/login
           │
    ┌──────▼──────┐
    │ 🔐 Logueado │
    │ JWT Token   │
    └─────────────┘
```

---

## 🛠️ Usando Thunder Client / Postman

### Importar Collection

Crear requests manuales:

**1. Registro**
- Method: POST
- URL: `http://localhost:3000/auth/register`
- Body (JSON):
```json
{
  "email": "test@test.com",
  "username": "testuser",
  "password": "Test123456"
}
```

**2. Verificación**
- Method: POST
- URL: `http://localhost:3000/auth/verify-email`
- Body (JSON):
```json
{
  "email": "test@test.com",
  "code": "XXXX"  // Del console output
}
```

**3. Login**
- Method: POST
- URL: `http://localhost:3000/auth/login`
- Body (JSON):
```json
{
  "email": "test@test.com",
  "password": "Test123456"
}
```

---

## 📝 Usando VS Code REST Client

Guardar como `test-auth.http`:

```http
### 1. Registrar usuario
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "email": "prueba@example.com",
  "username": "prueba_user",
  "password": "Password123"
}

### 2. Verificar email (cambiar code)
POST http://localhost:3000/auth/verify-email
Content-Type: application/json

{
  "email": "prueba@example.com",
  "code": "1234"
}

### 3. Login
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "prueba@example.com",
  "password": "Password123"
}

### 4. Reenviar código
POST http://localhost:3000/auth/resend-code
Content-Type: application/json

{
  "email": "prueba@example.com"
}
```

Luego click en "Send Request" sobre cada endpoint.

---

## 🐛 Troubleshooting Rápido

### Error: "Database connection failed"
```bash
# Verificar MySQL está corriendo
mysql -u root -p
```

### Error: "Migration failed"
```bash
# Ejecutar migraciones
npx prisma migrate dev
```

### Error: "Port 3000 in use"
```bash
# Cambiar puerto en main.ts
await app.listen(3001);
```

### Error: "Cannot find module"
```bash
# Reinstalar dependencias
rm -rf node_modules
npm install
npm run build
```

---

## 📚 Documentación Completa

Para más detalles, ver:

- **EMAIL_VERIFICATION.md** - Documentación técnica completa
- **DIAGRAMA_SECUENCIA.md** - Flujos detallados
- **FRONTEND_INTEGRATION.md** - Integración con Nuxt
- **DEPLOYMENT.md** - Guía de producción
- **SWAGGER** - http://localhost:3000/api/docs

---

## ✅ Checklist Básico

- [ ] Backend corriendo en puerto 3000
- [ ] Puedo ver Swagger docs
- [ ] Puedo registrar un usuario
- [ ] Veo código en consola
- [ ] Puedo verificar email
- [ ] Puedo hacer login
- [ ] Recibo JWT token

---

## 🎯 Próximos Pasos

1. **Integrar Frontend** (Ver `FRONTEND_INTEGRATION.md`)
2. **Configurar Email Real** (Ver `DEPLOYMENT.md`)
3. **Tests Unitarios** (Jest)
4. **Deploy a Producción** (Ver `DEPLOYMENT.md`)

---

## 💡 Tips

- Los códigos expiran en 15 minutos
- Máximo 3 intentos fallidos por código
- El email debe estar verificado para hacer login
- Cada usuario solo puede tener un código pendiente activo
- Las contraseñas se hashean automáticamente

---

¡Listo! Ya puedes empezar a probar el sistema de verificación de email. 🎉

**Ayuda**: Revisar `VERIFICACION.md` para checklist completo
