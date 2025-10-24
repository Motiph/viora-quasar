<template>
  <q-dialog v-model="isVisible" persistent>
    <q-card class="rounded-borders w-full max-w-md ">
      <!-- Imagen del instructor -->
      <q-img v-if="session?.teacher?.photo" :src="session.teacher.photo" alt="Instructor photo" class="h-48">
        <template v-slot:loading>
          <q-spinner color="primary" />
        </template>
        <template v-slot:error>
          <div class="flex flex-center text-grey">No image</div>
        </template>
      </q-img>

      <div v-else class="flex flex-center bg-grey-2 text-grey">
        <q-icon name="person" size="250px" />
      </div>

      <!-- Contenido -->
      <q-card-section>
        <div class="text-h6 text-primary q-mb-sm text-black">
          Reservar {{ session?.class_type?.name }}
        </div>

        <div class="text-body2 text-grey-8 q-mb-md">
          <p><span class="text-weight-medium">Instructor:</span>
            {{ session?.teacher?.first_name }} {{ session?.teacher?.last_name }}
          </p>
          <p><span class="text-weight-medium">Fecha:</span> {{ session?.date }}</p>
          <p><span class="text-weight-medium">Hora:</span>
            {{ session?.start_time }} - {{ session?.end_time }}
          </p>
          <p><span class="text-weight-medium">Lugares disponibles:</span>
            {{ session?.spots_left }}
          </p>
        </div>

        <!-- Botón de pagar -->
        <q-btn unelevated color="black" class="full-width" @click="emitPay" :loading="loading"
          label="Pagar reservación" />
      </q-card-section>

      <!-- Botón cerrar -->
      <q-btn flat round dense icon="close" class="absolute-top-right q-ma-sm bg-white text-dark shadow-2"
        @click="emitClose" />
    </q-card>
  </q-dialog>
</template>

<script setup>
import { onUnmounted, ref, watch } from 'vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  session: { type: Object, default: null },
  count: { type: Number }
})

const emit = defineEmits(['close', 'pay'])
const loading = ref(false)
const isVisible = ref(props.show)

// Sincronizar el v-model con el prop "show"
watch(() => props.show, (val) => {
  isVisible.value = val
})
watch(isVisible, (val) => {
  if (!val) emit('close')
})

// Métodos
const emitPay = () => {
  // loading.value = true
  emit('pay', props.session)
}

const emitClose = () => {
  loading.value = false
  emit('close')
}

onUnmounted(() => {
  loading.value = false
})
</script>

<style scoped>
.rounded-borders {
  border-radius: 12px;
}

.full-width {
  width: 100%;
}
</style>
