<template>
  <q-page class="q-pa-md">
    <!-- Filtros -->
    <div class="row justify-center q-mt-md">
      <div class="col-12 col-md-8 col-lg-8">
        <Filters />
      </div>
    </div>
    <!-- Calendario -->
    <div class="row justify-center">
      <div class="col-12 col-md-8 col-lg-8">
        <Calendar @date-changed="handleDateChange" />
      </div>
    </div>
    <div class="row justify-center">
      <div class="col-12 col-md-8 col-lg-8">
        <Schedule :current-date="selectedDate" :loading-sessions="loadingSessions" :current-class-sessions="sessions"
          @session-selected="handleDateChange" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import Calendar from 'src/components/Calendar.vue'
import Filters from 'src/components/Filters.vue'
import Schedule from 'src/components/Schedule.vue'

import { ref } from 'vue'
import { api } from 'src/boot/axios'

const selectedDate = ref(new Date())
const sessions = ref([])
const loadingSessions = ref(false)

// Manejar cambio de fecha desde el componente Calendar
const handleDateChange = async (newDate) => {
  selectedDate.value = newDate
  await fetchClassSessions({ date: selectedDate.value })
}


const fetchClassSessions = async (params = {}) => {
  console.log(params)
  try {
    loadingSessions.value = true

    const query = new URLSearchParams(params).toString()
    const endpoint = query ? `class-sessions/?${query}` : 'class-sessions/'

    console.log(endpoint)

    // ✅ Usa tu instancia configurada de axios
    const { data } = await api.get(endpoint)
    sessions.value = data
    console.log('Fetched class sessions:', data)
  } catch (error) {
    console.error('Error fetching classes:', error)
    throw error
  } finally {
    loadingSessions.value = false
  }
}
</script>
