<template>
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
</template>

<script setup>
import { getClassDuration, getStartTime } from 'src/composables/useDate.ts'
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

// const { getClassDuration, getStartTime } = useDate()
// Emits
const emit = defineEmits(['session-selected'])

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

// const getStartTime = (startTime) => {
// 	// Implementa tu lógica para formatear la hora de inicio
// 	if (!startTime) return ''
// 	const date = new Date(startTime)
// 	return date.toLocaleTimeString('es-ES', {
// 		hour: '2-digit',
// 		minute: '2-digit'
// 	})
// }

// const getClassDuration = (startTime, endTime) => {
// 	// Implementa tu lógica para calcular la duración
// 	if (!startTime || !endTime) return 0
// 	const start = new Date(startTime)
// 	const end = new Date(endTime)
// 	const diff = end.getTime() - start.getTime()
// 	return Math.round(diff / (1000 * 60))
// }

const setSession = (session) => {
	emit('session-selected', session)
}
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