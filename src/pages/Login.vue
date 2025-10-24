<template>
  <div class="row items-center justify-center full-height full-width bg-white">
    <div class="col-12 col-md-6 col-lg-4">
      <q-card class="q-pa-xl shadow-1 rounded-borders">
        <q-card-section class="q-pa-none">
          <!-- Título -->
          <h1 class="text-h4 text-weight-bold text-black q-mb-xs">Inicie sesión</h1>
          <p class="text-caption text-grey-7 q-mb-xl">Inicie sesión para ver su cuenta.</p>

          <!-- Formulario -->
          <q-form @submit="handleLogin" class="q-gutter-y-lg">
            <!-- Email -->
            <div>
              <q-input v-model="email" type="email" placeholder="you@example.com" standout="bg-black text-white"
                label="Correo Electrónico" :rules="[
                  val => !!val || 'El correo es requerido',
                  val => /.+@.+\..+/.test(val) || 'Correo electrónico inválido'
                ]" required>
                <template v-slot:prepend>
                  <q-icon name="email" color="gray-6" />
                </template>
              </q-input>
            </div>

            <!-- Password -->
            <div>
              <q-input v-model="password" :type="isPwd ? 'password' : 'text'" placeholder="••••••••"
                standout="bg-black text-white" label="Contraseña"
                :rules="[val => !!val || 'La contraseña es requerida']" required>
                <template v-slot:append>
                  <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                    @click="isPwd = !isPwd" />
                </template>
              </q-input>
            </div>

            <!-- Error Message -->
            <q-banner v-if="error" class="bg-red-1 text-red-8 rounded-borders" dense>
              <template v-slot:avatar>
                <q-icon name="error" color="red" />
              </template>
              {{ error }}
            </q-banner>

            <!-- Submit Button -->
            <q-btn type="submit" label="Entrar" color="black" class="full-width q-py-md" :loading="loading" no-caps>
              <template v-slot:loading>
                <q-spinner size="20px" class="q-mr-sm" />
                Iniciando...
              </template>
            </q-btn>
          </q-form>

          <!-- Enlace de registro -->
          <p class="text-caption text-grey-6 q-mt-lg q-mb-none text-center">
            ¿Aún no tienes cuenta?
            <router-link to="/register" class="text-primary text-weight-medium text-no-underline">
              Regístrate
            </router-link>
          </p>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useCoreStore } from 'src/stores/core.js'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const router = useRouter()

// Reactive data
const email = ref('edwyn@gmail.com')
const password = ref('Solecismo1')
const error = ref('')
const loading = ref(false)
const isPwd = ref(true)

// Auth store (ajusta según tu implementación)
// const authStore = useAuthStore()
const coreStore = useCoreStore()

const handleLogin = async () => {
  try {
    error.value = ''
    loading.value = true

    // Validar formulario antes de enviar
    if (!email.value || !password.value) {
      error.value = 'Por favor completa todos los campos'
      return
    }

    // await authStore.login(email.value, password.value)

    await coreStore.login({
      email: email.value,
      password: password.value
    })

    // Mostrar notificación de éxito
    $q.notify({
      type: 'positive',
      message: '¡Inicio de sesión exitoso!',
      position: 'top'
    })

    router.push('/')

    // Redirigir a la página principal
    // navigateTo('/')

  } catch (err) {
    console.error('Error en login:', err)
    error.value = 'Error al iniciar sesión. Por favor, verifica tus credenciales.'

    // Mostrar notificación de error
    $q.notify({
      type: 'negative',
      message: 'Error al iniciar sesión',
      caption: 'Verifica tus credenciales',
      position: 'top'
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Estilos personalizados */
.rounded-borders {
  border-radius: 12px;
}

.shadow-1 {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.full-height {
  height: 100vh;
}

/* Asegurar que los inputs tengan el estilo deseado */
:deep(.q-field--outlined .q-field__control) {
  border-radius: 8px;
}

:deep(.q-field--dense .q-field__control) {
  min-height: 56px;
}

:deep(.q-field--outlined .q-field__control:before) {
  border-color: #424242;
}

:deep(.q-field--focused .q-field__control:before) {
  border-color: var(--q-primary);
  border-width: 2px;
}

/* Enlace de registro */
.text-no-underline {
  text-decoration: none;
}

.text-no-underline:hover {
  text-decoration: underline;
}
</style>
