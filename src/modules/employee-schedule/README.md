# Módulo de Horarios de Empleados (Employee Schedule)

## Endpoints

### 1. Crear Horario
**POST** `/employee-schedules`

Crea un nuevo horario para un empleado.

**Body:**
```json
{
  "employeeId": 1,
  "dayOfWeek": "LUNES",
  "startTime": "2025-01-01T08:00:00Z",
  "endTime": "2025-01-01T17:00:00Z"
}
```

**Días válidos:** LUNES, MARTES, MIERCOLES, JUEVES, VIERNES, SABADO, DOMINGO

**Respuesta (201):**
```json
{
  "id": 1,
  "employeeId": 1,
  "dayOfWeek": "LUNES",
  "startTime": "2025-01-01T08:00:00.000Z",
  "endTime": "2025-01-01T17:00:00.000Z",
  "employee": {
    "id": 1,
    "firstName": "Dr.",
    "lastName": "García"
  }
}
```

### 2. Obtener Horarios
**GET** `/employee-schedules`

Obtiene todos los horarios, opcionalmente filtrados por empleado.

**Parámetro query opcional:**
- `employeeId` (number) - Filtrar por empleado específico

**Ejemplos:**
```bash
# Todos los horarios
GET /employee-schedules

# Horarios de un empleado
GET /employee-schedules?employeeId=1
```

**Respuesta (200):**
```json
[
  {
    "id": 1,
    "employeeId": 1,
    "dayOfWeek": "LUNES",
    "startTime": "2025-01-01T08:00:00.000Z",
    "endTime": "2025-01-01T17:00:00.000Z",
    "employee": {
      "id": 1,
      "firstName": "Dr.",
      "lastName": "García"
    }
  }
]
```

## Validaciones

- `employeeId`: Número positivo, empleado debe existir
- `dayOfWeek`: Uno de los días del enum WeekDay
- `startTime`: Fecha ISO8601 (solo se usa la hora)
- `endTime`: Fecha ISO8601 (solo se usa la hora)

## Ejemplos con cURL

```bash
# Crear horario
curl -X POST http://localhost:3000/employee-schedules \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": 1,
    "dayOfWeek": "LUNES",
    "startTime": "2025-01-01T08:00:00Z",
    "endTime": "2025-01-01T17:00:00Z"
  }'

# Obtener todos los horarios
curl http://localhost:3000/employee-schedules

# Obtener horarios de un empleado
curl http://localhost:3000/employee-schedules?employeeId=1
```
