# Módulo de Citas (Appointments)

Este módulo proporciona los endpoints necesarios para gestionar las citas clínicas del sistema PsiFirm.

## Estructura del Módulo

```
appointments/
├── dto/
│   ├── create-appointment.dto.ts      # DTO para crear citas
│   ├── update-appointment.dto.ts      # DTO para actualizar citas
│   ├── appointment-response.dto.ts    # DTO de respuesta
│   └── index.ts
├── appointments.service.ts             # Lógica de negocio
├── appointments.controller.ts          # Controlador con endpoints
└── appointments.module.ts              # Módulo
```

## Endpoints Disponibles

### 1. Crear una cita
**POST** `/appointments`

**Body:**
```json
{
  "patientId": 1,
  "employeeId": 1,
  "date": "2025-12-28T10:00:00Z",
  "status": "PENDIENTE",
  "cost": 50.00,
  "sessionId": 1
}
```

**Estados válidos:**
- `PENDIENTE` - Cita pendiente de confirmación
- `CONFIRMADA` - Cita confirmada
- `REALIZADA` - Cita ya realizada
- `CANCELADA` - Cita cancelada
- `NO_ASISTIO` - Paciente no asistió

**Respuesta (201):**
```json
{
  "id": 1,
  "patientId": 1,
  "employeeId": 1,
  "date": "2025-12-28T10:00:00.000Z",
  "status": "PENDIENTE",
  "cost": "50.00",
  "sessionId": 1,
  "createdAt": "2025-12-27T15:30:00.000Z",
  "updatedAt": "2025-12-27T15:30:00.000Z",
  "patient": {
    "id": 1,
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan@example.com",
    "phone": "1234567890"
  },
  "employee": {
    "id": 1,
    "firstName": "Dr.",
    "lastName": "García"
  }
}
```

### 2. Obtener todas las citas
**GET** `/appointments`

**Parámetros de consulta opcionales:**
- `patientId` (number) - Filtrar por paciente
- `employeeId` (number) - Filtrar por empleado
- `status` (string) - Filtrar por estado (PENDIENTE, CONFIRMADA, REALIZADA, etc.)
- `fromDate` (ISO8601) - Fecha inicial
- `toDate` (ISO8601) - Fecha final

**Ejemplo:**
```
GET /appointments?patientId=1&status=CONFIRMADA&fromDate=2025-12-01T00:00:00Z
```

**Respuesta (200):**
Array de citas con la estructura del endpoint anterior.

### 3. Obtener citas de un paciente
**GET** `/appointments/patient/:patientId`

**Respuesta (200):**
Array de citas del paciente especificado, ordenadas por fecha descendente.

### 4. Obtener citas de un empleado
**GET** `/appointments/employee/:employeeId`

**Respuesta (200):**
Array de citas del empleado especificado, ordenadas por fecha ascendente.

### 5. Obtener citas por estado
**GET** `/appointments/status/:status`

**Parámetro:**
- `status` (string) - PENDIENTE, CONFIRMADA, REALIZADA, CANCELADA, NO_ASISTIO

**Respuesta (200):**
Array de citas con el estado especificado.

### 6. Obtener una cita por ID
**GET** `/appointments/:id`

**Respuesta (200):**
```json
{
  "id": 1,
  "patientId": 1,
  "employeeId": 1,
  "date": "2025-12-28T10:00:00.000Z",
  "status": "PENDIENTE",
  "cost": "50.00",
  "sessionId": 1,
  "createdAt": "2025-12-27T15:30:00.000Z",
  "updatedAt": "2025-12-27T15:30:00.000Z",
  "patient": {
    "id": 1,
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan@example.com",
    "phone": "1234567890",
    "birthDate": "1990-01-15T00:00:00.000Z",
    "gender": "MASCULINO"
  },
  "employee": {
    "id": 1,
    "firstName": "Dr.",
    "lastName": "García",
    "specialtyArea": {
      "name": "Psicología Clínica"
    }
  }
}
```

### 7. Actualizar una cita
**PATCH** `/appointments/:id`

**Body (todos los campos opcionales):**
```json
{
  "patientId": 1,
  "employeeId": 1,
  "date": "2025-12-29T11:00:00Z",
  "status": "CONFIRMADA",
  "cost": 55.00,
  "sessionId": 1
}
```

**Respuesta (200):**
Cita actualizada con la nueva información.

### 8. Eliminar una cita
**DELETE** `/appointments/:id`

**Respuesta (200):**
Cita eliminada con su información.

## Validaciones

- **patientId**: Debe ser un número positivo y el paciente debe existir
- **employeeId**: Debe ser un número positivo y el empleado debe existir
- **date**: Debe ser una fecha válida en formato ISO8601
- **status**: Debe ser uno de los estados válidos
- **cost**: Número decimal válido
- **sessionId**: Opcional, debe ser un número positivo si se proporciona

## Códigos de Respuesta

- **200**: Operación exitosa (GET, PATCH, DELETE)
- **201**: Cita creada exitosamente
- **400**: Datos inválidos en la solicitud
- **404**: Recurso no encontrado (paciente, empleado, sesión o cita)
- **500**: Error interno del servidor

## Ejemplo de Uso con cURL

```bash
# Crear una cita
curl -X POST http://localhost:3000/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": 1,
    "employeeId": 1,
    "date": "2025-12-28T10:00:00Z",
    "status": "PENDIENTE",
    "cost": 50.00
  }'

# Obtener todas las citas
curl http://localhost:3000/appointments

# Obtener citas de un paciente
curl http://localhost:3000/appointments/patient/1

# Actualizar una cita
curl -X PATCH http://localhost:3000/appointments/1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "CONFIRMADA"
  }'

# Eliminar una cita
curl -X DELETE http://localhost:3000/appointments/1
```

## Integración con otros módulos

El módulo de citas se integra con:
- **Pacientes**: Validación de existencia y relación
- **Empleados**: Validación de existencia y información del terapeuta
- **Sesiones Terapéuticas**: Vinculación opcional con sesiones realizadas

## Notas Importantes

- Las citas se ordenan por fecha por defecto
- Las citas pueden vincularse con sesiones terapéuticas mediante `sessionId`
- El módulo incluye validaciones de integridad referencial
- Todos los endpoints están documentados en Swagger
