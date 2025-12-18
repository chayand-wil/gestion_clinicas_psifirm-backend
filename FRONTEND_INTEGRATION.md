# Guía de Implementación - Frontend (Nuxt 3)

## Componentes necesarios para el flujo de registro y verificación

### 1. Página de Registro (`pages/register.vue`)

```vue
<template>
  <div class="register-container">
    <div class="register-card">
      <h1>Crear Cuenta</h1>
      
      <form @submit.prevent="handleRegister" v-if="!verificationStep">
        <div class="form-group">
          <label for="email">Correo Electrónico</label>
          <input 
            v-model="form.email" 
            type="email" 
            required
            placeholder="tu@email.com"
          />
        </div>

        <div class="form-group">
          <label for="username">Usuario</label>
          <input 
            v-model="form.username" 
            type="text" 
            required
            minlength="3"
            placeholder="nombre_usuario"
          />
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>
          <input 
            v-model="form.password" 
            type="password" 
            required
            minlength="6"
            placeholder="Mínimo 6 caracteres"
          />
        </div>

        <button type="submit" :disabled="loading">
          {{ loading ? 'Registrando...' : 'Registrarse' }}
        </button>

        <p v-if="error" class="error-message">{{ error }}</p>
      </form>

      <div v-else>
        <h2>Verifica tu Correo</h2>
        <p>Hemos enviado un código de 4 dígitos a {{ form.email }}</p>
        
        <form @submit.prevent="handleVerify">
          <div class="form-group">
            <label for="code">Código de Verificación</label>
            <input 
              v-model="verificationCode" 
              type="text" 
              maxlength="4"
              placeholder="0000"
              pattern="[0-9]{4}"
            />
          </div>

          <button type="submit" :disabled="loading">
            {{ loading ? 'Verificando...' : 'Verificar' }}
          </button>

          <button 
            type="button" 
            @click="handleResendCode" 
            :disabled="loading"
            class="secondary"
          >
            Reenviar código
          </button>

          <p v-if="error" class="error-message">{{ error }}</p>
          <p v-if="success" class="success-message">{{ success }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { $axios } = useNuxtApp()

const form = ref({
  email: '',
  username: '',
  password: '',
})

const verificationCode = ref('')
const verificationStep = ref(false)
const loading = ref(false)
const error = ref('')
const success = ref('')

const handleRegister = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const response = await $axios.post('/auth/register', {
      email: form.value.email,
      username: form.value.username,
      password: form.value.password,
    })
    
    verificationStep.value = true
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Error en el registro'
  } finally {
    loading.value = false
  }
}

const handleVerify = async () => {
  try {
    loading.value = true
    error.value = ''
    success.value = ''
    
    const response = await $axios.post('/auth/verify-email', {
      email: form.value.email,
      code: verificationCode.value,
    })
    
    success.value = 'Correo verificado correctamente. Redirigiendo...'
    
    // Redirigir a login después de 2 segundos
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Error verificando código'
  } finally {
    loading.value = false
  }
}

const handleResendCode = async () => {
  try {
    loading.value = true
    error.value = ''
    
    await $axios.post('/auth/resend-code', {
      email: form.value.email,
    })
    
    success.value = 'Nuevo código enviado a tu correo'
    verificationCode.value = ''
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Error reenviando código'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.register-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
}

h1, h2 {
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

button {
  width: 100%;
  padding: 0.75rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
  margin-top: 1rem;
}

button:hover:not(:disabled) {
  background: #5568d3;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

button.secondary {
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
  margin-top: 0.5rem;
}

button.secondary:hover:not(:disabled) {
  background: #f0f3ff;
}

.error-message {
  color: #d32f2f;
  margin-top: 1rem;
  text-align: center;
}

.success-message {
  color: #388e3c;
  margin-top: 1rem;
  text-align: center;
}

p {
  text-align: center;
  color: #666;
}
</style>
```

### 2. Composable para manejo de autenticación (`composables/useAuth.ts`)

```typescript
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

export const useAuth = () => {
  const router = useRouter()
  const { $axios } = useNuxtApp()

  const user = ref(null)
  const token = ref(null)

  // Cargar usuario desde sesión (en componente onMounted)
  const loadUser = async () => {
    try {
      const sessionData = useCookie('session').value
      if (sessionData) {
        user.value = sessionData
      }
    } catch (error) {
      console.error('Error cargando usuario:', error)
    }
  }

  // Registrar usuario
  const register = async (email: string, username: string, password: string) => {
    try {
      const response = await $axios.post('/auth/register', {
        email,
        username,
        password,
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error en registro')
    }
  }

  // Verificar email
  const verifyEmail = async (email: string, code: string) => {
    try {
      const response = await $axios.post('/auth/verify-email', {
        email,
        code,
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error verificando email')
    }
  }

  // Reenviar código
  const resendCode = async (email: string) => {
    try {
      const response = await $axios.post('/auth/resend-code', {
        email,
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error reenviando código')
    }
  }

  // Iniciar sesión
  const login = async (email: string, password: string) => {
    try {
      const response = await $axios.post('/auth/login', {
        email,
        password,
      })
      
      token.value = response.data.access_token
      user.value = response.data.usuario
      
      // Guardar en sesión/cookie
      const sessionCookie = useCookie('session')
      sessionCookie.value = response.data.usuario
      
      // Guardar token para requests futuros
      const tokenCookie = useCookie('auth_token')
      tokenCookie.value = response.data.access_token
      
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error en login')
    }
  }

  // Cerrar sesión
  const logout = () => {
    user.value = null
    token.value = null
    
    const sessionCookie = useCookie('session')
    sessionCookie.value = null
    
    const tokenCookie = useCookie('auth_token')
    tokenCookie.value = null
    
    router.push('/login')
  }

  // Verificar si está autenticado
  const isAuthenticated = computed(() => !!user.value && !!token.value)

  return {
    user: readonly(user),
    token: readonly(token),
    isAuthenticated,
    loadUser,
    register,
    verifyEmail,
    resendCode,
    login,
    logout,
  }
}
```

### 3. Middleware de protección (`middleware/requireVerification.ts`)

```typescript
export default defineRouteMiddleware(async (to, from) => {
  const { $axios } = useNuxtApp()
  const tokenCookie = useCookie('auth_token')

  if (!tokenCookie.value) {
    return navigateTo('/login')
  }

  // Configurar header de autorización
  $axios.defaults.headers.common['Authorization'] = `Bearer ${tokenCookie.value}`
})
```

## Flujo de Integración en el Frontend

### 1. Página de Registro (Paso 1-2)
- Usuario completa formulario de registro
- Sistema envía datos a `/auth/register`
- Backend genera código y lo muestra en consola
- Frontend muestra pantalla de verificación de email

### 2. Verificación de Email (Paso 3)
- Usuario ingresa código recibido
- Sistema valida con `/auth/verify-email`
- Si es correcto, redirige a login

### 3. Login (Paso 4)
- Usuario ingresa email y contraseña
- Sistema valida y devuelve JWT
- Frontend almacena token en cookie/localStorage

## Variables de Entorno Frontend

```env
VITE_API_URL=http://localhost:3000/api
VITE_JWT_EXPIRY=24h
```

## Rutas Protegidas

Todas las rutas después de login deben incluir el JWT en headers:

```typescript
Authorization: Bearer {token}
```

## Próximos Pasos

- [ ] Implementar página de login
- [ ] Implementar páginas protegidas
- [ ] Agregar recuperación de contraseña
- [ ] Implementar 2FA (autenticación de dos factores)
