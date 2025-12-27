#!/bin/bash

# ============================================================
# Script de pruebas para endpoints del módulo de Citas
# ============================================================
# Descomentar y ejecutar las líneas según sea necesario

BASE_URL="http://localhost:3000"

# ============================================================
# 1. CREAR UNA CITA
# ============================================================

echo "📝 1. Crear una nueva cita..."
curl -X POST $BASE_URL/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": 1,
    "employeeId": 1,
    "date": "2025-12-28T10:00:00Z",
    "status": "PENDIENTE",
    "cost": 50.00
  }' \
  | jq '.'

# ============================================================
# 2. OBTENER TODAS LAS CITAS
# ============================================================

echo -e "\n\n📋 2. Obtener todas las citas..."
curl -X GET $BASE_URL/appointments \
  -H "Content-Type: application/json" \
  | jq '.'

# ============================================================
# 3. FILTRAR CITAS POR PACIENTE
# ============================================================

echo -e "\n\n👤 3. Obtener citas de un paciente específico..."
curl -X GET $BASE_URL/appointments/patient/1 \
  -H "Content-Type: application/json" \
  | jq '.'

# ============================================================
# 4. FILTRAR CITAS POR EMPLEADO
# ============================================================

echo -e "\n\n👨‍⚕️ 4. Obtener citas de un empleado específico..."
curl -X GET $BASE_URL/appointments/employee/1 \
  -H "Content-Type: application/json" \
  | jq '.'

# ============================================================
# 5. FILTRAR CITAS POR ESTADO
# ============================================================

echo -e "\n\n🔍 5. Obtener citas pendientes..."
curl -X GET $BASE_URL/appointments/status/PENDIENTE \
  -H "Content-Type: application/json" \
  | jq '.'

# ============================================================
# 6. OBTENER CITA POR ID
# ============================================================

echo -e "\n\n📌 6. Obtener una cita específica..."
curl -X GET $BASE_URL/appointments/1 \
  -H "Content-Type: application/json" \
  | jq '.'

# ============================================================
# 7. ACTUALIZAR UNA CITA
# ============================================================

echo -e "\n\n✏️ 7. Actualizar estado de cita..."
curl -X PATCH $BASE_URL/appointments/1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "CONFIRMADA"
  }' \
  | jq '.'

# ============================================================
# 8. ACTUALIZAR MULTIPLE CAMPOS
# ============================================================

echo -e "\n\n✏️ 8. Actualizar múltiples campos..."
curl -X PATCH $BASE_URL/appointments/1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "REALIZADA",
    "cost": 55.00,
    "date": "2025-12-28T11:00:00Z"
  }' \
  | jq '.'

# ============================================================
# 9. ELIMINAR UNA CITA
# ============================================================

echo -e "\n\n🗑️ 9. Eliminar una cita..."
curl -X DELETE $BASE_URL/appointments/1 \
  -H "Content-Type: application/json" \
  | jq '.'

# ============================================================
# 10. FILTROS AVANZADOS - RANGO DE FECHAS
# ============================================================

echo -e "\n\n📅 10. Obtener citas en un rango de fechas..."
curl -X GET "$BASE_URL/appointments?fromDate=2025-12-01T00:00:00Z&toDate=2025-12-31T23:59:59Z" \
  -H "Content-Type: application/json" \
  | jq '.'

# ============================================================
# 11. FILTROS AVANZADOS - COMBINAR FILTROS
# ============================================================

echo -e "\n\n🔀 11. Combinar múltiples filtros..."
curl -X GET "$BASE_URL/appointments?patientId=1&status=CONFIRMADA&employeeId=1" \
  -H "Content-Type: application/json" \
  | jq '.'

# ============================================================
# EJEMPLOS ADICIONALES DE ESTADOS
# ============================================================

echo -e "\n\n📊 12. Ejemplos de cambios de estado..."

# Cambiar a CONFIRMADA
echo "Cambiar a CONFIRMADA..."
curl -X PATCH $BASE_URL/appointments/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "CONFIRMADA"}' \
  | jq '.status'

# Cambiar a REALIZADA
echo -e "\nCambiar a REALIZADA..."
curl -X PATCH $BASE_URL/appointments/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "REALIZADA"}' \
  | jq '.status'

# Cambiar a CANCELADA
echo -e "\nCambiar a CANCELADA..."
curl -X PATCH $BASE_URL/appointments/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "CANCELADA"}' \
  | jq '.status'

# Cambiar a NO_ASISTIO
echo -e "\nCambiar a NO_ASISTIO..."
curl -X PATCH $BASE_URL/appointments/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "NO_ASISTIO"}' \
  | jq '.status'

# ============================================================
# NOTAS
# ============================================================

: <<'EOF'

NOTAS IMPORTANTES:

1. Asegúrate de que el servidor está corriendo en http://localhost:3000
   npm run dev

2. Los IDs de patientId y employeeId deben existir en la base de datos

3. Estados válidos:
   - PENDIENTE
   - CONFIRMADA
   - REALIZADA
   - CANCELADA
   - NO_ASISTIO

4. Formato de fecha: ISO 8601 (2025-12-28T10:00:00Z)

5. Para ver respuestas formateadas, instala jq:
   sudo apt-get install jq  (Linux/Mac)
   choco install jq         (Windows)

6. Sin jq, usa python para formatear:
   ... | python -m json.tool

7. Para guardar respuestas en archivos:
   curl ... > response.json

8. Para ver headers de respuesta:
   curl -i -X GET ...

9. Para ver solo headers:
   curl -I -X GET ...

10. Para ver información detallada de la solicitud:
    curl -v -X GET ...

EOF
