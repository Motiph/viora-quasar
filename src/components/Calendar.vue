<template>
	<div class="row items-center justify-between q-pb-md q-mb-md q-pt-md border-bottom">


		<!-- Días de la semana -->
		<div class="col row justify-between items-center text-center">
			<!-- Flecha izquierda -->
			<div class="">
				<q-btn flat dense round icon="chevron_left" @click="shiftDay(-1)" class="q-mr-md" />
			</div>

			<div v-for="(day, index) in days" :key="index" class="cursor-pointer q-px-sm" :class="[
				day.active
					? 'text-black text-weight-bold border-bottom-selected'
					: 'text-grey'
			]" @click="currentDate = day.fullDate">
				<div class="text-caption">{{ day.month }} {{ day.date }}</div>
				<div class="text-h6">{{ day.name }}</div>
			</div>

			<!-- Flecha derecha -->
			<div class="">
				<q-btn flat dense round icon="chevron_right" @click="shiftDay(1)" class="q-ml-md" />
			</div>
		</div>


	</div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import {
	addDays,
	startOfWeek,
	format,
	isToday,
	isSameDay,
} from 'date-fns'
import { es } from 'date-fns/locale'


const emit = defineEmits(
	['date-changed'],
)

const today = new Date()
const initialDate = today
// const dayOfWeek = getDay(today)
const currentDate = ref(initialDate)

// Función para cambiar día
const shiftDay = (direction) => {
	const newDate = addDays(currentDate.value, direction)
	currentDate.value = newDate
}

// Watch para emitir cambios de fecha
watch(currentDate, (newDate) => {
	const formattedDate = format(newDate, 'yyyy-MM-dd')
	console.log('Fecha seleccionada:', formattedDate)
	emit('date-changed', formattedDate)
})

// Computed para los días de la semana
const days = computed(() => {
	const weekStart = startOfWeek(currentDate.value, { weekStartsOn: 1 }) // lunes
	return Array.from({ length: 7 }).map((_, i) => {
		const dayDate = addDays(weekStart, i)
		return {
			date: format(dayDate, 'dd', { locale: es }),
			month: format(dayDate, 'MMM', { locale: es }).toUpperCase(),
			name: format(dayDate, 'EEE', { locale: es }).toUpperCase(),
			today: isToday(dayDate),
			active: isSameDay(dayDate, currentDate.value),
			fullDate: dayDate
		}
	})
})

</script>

<style scoped>
.border-bottom {
	border-bottom: 1px solid #e0e0e0;
}

.border-bottom-selected {
	border-bottom: 2px solid black;
}

/* Asegurar que los días tengan el mismo ancho */
.row>div {
	flex: 1;
	min-width: 0;
}

/* Responsive */
@media (max-width: 600px) {
	.text-h6 {
		font-size: 1rem;
	}

	.text-caption {
		font-size: 0.7rem;
	}

	.q-px-sm {
		padding-left: 4px;
		padding-right: 4px;
	}
}
</style>