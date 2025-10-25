<template>
  <q-banner class="bg-black text-white q-pa-md q-mb-md rounded-borders" v-if="timeLeft > 0">
    <div class="text-weight-bold">
      Tiempo restante: {{ Math.floor(timeLeft / 60) }}m {{ timeLeft % 60 }}s
    </div>
    <div>
      Por favor termina de pagar en el link
    </div>
  </q-banner>


  <q-card flat bordered class="rounded-borders q-mb-md overflow-hidden">
    <!-- Encabezado con fecha -->
    <q-card-section class="bg-black q-pa-md">
      <div class="text-subtitle1 text-weight-semibold text-white">
        {{ formatDate(currentDate) }}
      </div>
    </q-card-section>

    <!-- Estado de carga -->
    <div v-if="loadingSessions" class="column items-center justify-center q-pa-xl">
      <q-spinner size="3rem" color="primary" />
      <div class="q-mt-md text-caption text-grey">Cargando...</div>
    </div>

    <!-- Lista de sesiones -->
    <template v-else>
      <div v-for="(cls, index) in currentClassSessions" :key="index"
        class="column md-row items-stretch md-items-center q-pa-lg border-bottom">
        <!-- Hora y duración -->
        <div class="col-auto q-mb-md md:q-mb-none md:q-mr-lg" style="min-width: 96px;">
          <div class="text-body1 text-weight-semibold text-grey-8">
            {{ getStartTime(cls.start_time) }}
          </div>
          <div class="text-caption text-grey-6">
            {{ getClassDuration(cls.start_time, cls.end_time) }} mins
          </div>
        </div>

        <!-- Información del instructor y clase -->
        <div class="col row items-center gap-md flex-1">
          <q-avatar size="56px" class="q-mr-sm">
            <img v-if="cls.teacher.photo" :src="cls.teacher.photo"
              :alt="`${cls.teacher.first_name} ${cls.teacher.last_name}`" class="object-cover" />
            <q-icon v-else name="person" size="28px" color="grey-5" />
          </q-avatar>

          <div class="col">
            <div class="text-body1 text-weight-semibold">
              {{ cls.class_type.name }}
            </div>
            <div class="text-caption text-grey-7 text-weight-semibold">
              {{ cls.teacher.first_name }} {{ cls.teacher.last_name }}
            </div>
            <div class="text-caption text-grey-6 text-weight-semibold">
              {{ cls.spots_left }} espacios disponibles
            </div>
          </div>
        </div>

        <!-- Botón de reserva -->
        <div class="col-auto q-pt-md q-mt-md md:q-mt-none md:q-ml-auto">
          <q-btn :disable="cls.spots_left === 0" label="Reservar" color="black" class="full-width md-width-auto"
            padding="8px 20px" no-caps @click="setSession(cls)" />
        </div>
      </div>

      <!-- Mensaje cuando no hay sesiones -->
      <div v-if="currentClassSessions.length === 0" class="column items-center justify-center q-pa-xl text-grey-6">
        <q-icon name="event_busy" size="48px" class="q-mb-sm" />
        <div>No hay clases disponibles para esta fecha</div>
      </div>
    </template>
  </q-card>

  <SessionModal :show="showReservationModal" :session="selectedClassSession" @close="closeReservationModal"
    @pay="handlePay" />
</template>

<script setup>
import { ref, watch } from 'vue'
import { getClassDuration, getStartTime } from 'src/composables/useDate.ts'
import { useCoreStore } from 'src/stores/core.js'
import { api } from 'src/boot/axios';
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

import SessionModal from 'src/components/SessionModal.vue'

import { Browser } from '@capacitor/browser'
import { Capacitor } from '@capacitor/core'

defineProps({
  currentDate: {
    type: [Date, String],
    required: true
  },
  loadingSessions: {
    type: Boolean,
    default: false
  },
  currentClassSessions: {
    type: Array,
    default: () => []
  }
})

const coreStore = useCoreStore()
const router = useRouter()
const $q = useQuasar()

const showReservationModal = ref(false)
const selectedClassSession = ref(null)
const reservation = ref(null)



const timeLeft = ref(0)
let intervalTimer = null
let pollingTimer = null


// Emits
// const emit = defineEmits(['session-selected'])




// Métodos
const formatDate = (date) => {
  // Implementa tu lógica de formato de fecha
  if (typeof date === 'string') {
    return new Date(date).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// const setSession = (session) => {
//   emit('session-selected', session)
// }

const setSession = (session) => {

  if (coreStore.user) {
    showReservationModal.value = true
    selectedClassSession.value = session
  } else {
    router.push('/login')
  }

}

const closeReservationModal = () => {
  showReservationModal.value = false
  selectedClassSession.value = null
}


const payReservation = async (session) => {
  try {
    const response = await api.post(
      '/reservations/',
      {
        class_session: session.id, // 👈 cuerpo de la petición
      },
      {
        headers: {
          Authorization: `Bearer ${coreStore.token}`, // 👈 configuración
        },
      }
    )

    const data = response.data // 👈 siempre accede a .data en axios

    if (data.pay && data.pay.error) {
      return alert('error')
    }

    reservation.value = data.data
    startCountdown()
    startPolling()

    // abrir link según plataforma
    // if (Capacitor.isNativePlatform()) {
    //   await Browser.open({ url: data.pay.url })
    // } else {
    //   window.open(data.pay.url, '_blank')
    // }

    if (Capacitor.getPlatform() === 'android' || Capacitor.getPlatform() === 'ios') {
      try {
        await Browser.open({ url: data.pay.url, presentationStyle: 'popover' })
      } catch (e) {
        console.log('No se pudo abrir en el emulador, prueba en un dispositivo real', e)
        // fallback para testing
        window.open(data.pay.url, '_blank')
      }
    } else {
      window.open(data.pay.url, '_blank')
    }

    // window.open(data.pay.url, '_blank')

    console.log(data)
  } catch (err) {
    console.error('Error al pagar:', err)
    if (err?.response?.status === 401) {
      return 'refresh'
    }
  }
}


const handlePay = async (session) => {
  const response = await payReservation(session)
  console.log(response)
  if (response == 'refresh') {
    await coreStore.refresh()
    const r = await payReservation(session)
    console.log(r)
  }
}


const startCountdown = () => {

  if (!reservation.value?.held_until) return
  const endTime = new Date(reservation.value.held_until).getTime()

  intervalTimer = setInterval(() => {
    const diff = Math.max(0, endTime - Date.now())
    timeLeft.value = Math.floor(diff / 1000) // segundos

    if (diff <= 0) clearInterval(intervalTimer)
  }, 1000)
}


const startPolling = () => {
  pollingTimer = setInterval(async () => {
    if (!reservation.value) return
    console.log(reservation.value)
    console.log('Consultando estado de reservación...', reservation.value.id)
    try {
      const res = await api.get(
        `/reservations/${reservation.value.id}/`,
        {
          headers: {
            Authorization: `Bearer ${coreStore.token}`,
          },
        }
      )

      const data = res.data  // 👈 la respuesta real está aquí

      if (data.status === 'PAID') {
        clearInterval(pollingTimer)
        clearInterval(intervalTimer)
        timeLeft.value = 0
        // alert('Pago recibido, tu reservación está confirmada!')
        $q.notify({
          type: 'positive',
          message: 'Pago recibido, tu reservación está confirmada ✨',
          position: 'top-right'
        })

      }

      if (data.status === 'CANCELLED') {
        clearInterval(pollingTimer)
        clearInterval(intervalTimer)
        alert('La reservación fue cancelada')
        timeLeft.value = 0
      }

    } catch (err) {
      console.error('Error al consultar reservación:', err)
    }
  }, 10000) // cada 10 segundos
}

// reinicia el countdown si session cambia
watch(() => reservation, () => {
  clearInterval(intervalTimer)
  startCountdown()
}, { immediate: true })


</script>

<style scoped>
.border-bottom {
  border-bottom: 1px solid #e0e0e0;
}

.border-bottom:last-of-type {
  border-bottom: none;
}

/* Responsive */
@media (max-width: 768px) {
  .md-row {
    flex-direction: column;
  }

  .md-items-center {
    align-items: stretch;
  }

  .md\:q-mb-none {
    margin-bottom: 0;
  }

  .md\:q-mr-lg {
    margin-right: 0;
  }

  .md\:q-mt-none {
    margin-top: 0;
  }

  .md\:q-ml-auto {
    margin-left: 0;
  }

  .full-width {
    width: 100%;
  }

  .md-width-auto {
    width: auto;
  }
}

@media (min-width: 769px) {
  .md-row {
    flex-direction: row;
  }

  .md-items-center {
    align-items: center;
  }

  .full-width {
    width: 100%;
  }

  .md-width-auto {
    width: auto;
  }
}

/* Asegurar que las imágenes del avatar se vean bien */
.q-avatar img {
  object-fit: cover;
}
</style>
