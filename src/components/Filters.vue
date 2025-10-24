<template>
	<div class="row items-center justify-between q-pt-md q-pb-xl q-mb-md">
		<!-- Título -->
		<div class="col-auto">
			<h1 class="text-h4 text-weight-bold">Tijuana</h1>
		</div>

		<!-- Botones de filtro -->
		<div class="col-auto row items-center gap-xs">
			<!-- Botón Instructor -->
			<div class="relative-position">
				<q-btn outline no-caps label="Instructor" @click="toggleDialog('instructor')" class="q-px-md" />

				<!-- Diálogo flotante -->
				<q-card v-if="openDialog === 'instructor'" class="absolute-top-left z-max q-mt-lg" style="width: 280px;">
					<q-card-section>
						<div class="text-h6 text-weight-medium q-mb-md">Seleccionar instructor</div>
						<div class="column gap-sm">
							<q-checkbox v-for="teacher in teachers" :key="teacher.id" v-model="selectedTeachers" :val="teacher"
								:label="`${teacher.first_name} ${teacher.last_name}`" color="primary" />
						</div>
					</q-card-section>

					<q-card-actions align="right" class="q-px-md q-pb-md">
						<q-btn flat label="Cerrar" color="grey" @click="closeDialog" class="q-mr-sm" />
						<q-btn label="Aplicar" color="primary" @click="applyFilters" />
					</q-card-actions>
				</q-card>
			</div>

			<!-- Botón Tipo de clase -->
			<div class="relative-position">
				<q-btn outline no-caps label="Tipo de clase" @click="toggleDialog('type')" class="q-px-md" />

				<!-- Diálogo flotante -->
				<q-card v-if="openDialog === 'type'" class="absolute-top-left z-max q-mt-lg" style="width: 280px;">
					<q-card-section>
						<div class="text-h6 text-weight-medium q-mb-md">Seleccionar tipo</div>
						<div class="column gap-sm">
							<q-checkbox v-for="classType in classTypes" :key="classType.id" v-model="selectedTypes" :val="classType"
								:label="classType.name" color="primary" />
						</div>
					</q-card-section>

					<q-card-actions align="right" class="q-px-md q-pb-md">
						<q-btn flat label="Cerrar" color="grey" @click="closeDialog" class="q-mr-sm" />
						<q-btn label="Aplicar" color="primary" @click="applyFilters" />
					</q-card-actions>
				</q-card>
			</div>

			<!-- Botón Borrar -->
			<q-btn flat no-caps label="Borrar filtros" color="grey" @click="clearFilters" class="q-px-sm" />
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const emit = defineEmits(['filtersChanged', 'clearFilters'])

// const config = useRuntimeConfig()

const openDialog = ref(null)
const teachers = ref([])
const classTypes = ref([])
const selectedTeachers = ref([])
const selectedTypes = ref([])

onMounted(async () => {
	await fetchTeachers()
	await fetchClassTypes()
})

const toggleDialog = (name) => {
	openDialog.value = openDialog.value === name ? null : name
}

const closeDialog = () => {
	openDialog.value = null
}

const applyFilters = () => {
	console.log("Teachers:", selectedTeachers.value)
	console.log("Types:", selectedTypes.value)
	closeDialog()
	emit('filtersChanged', {
		teachers: selectedTeachers.value,
		types: selectedTypes.value
	})
}

const clearFilters = () => {
	selectedTeachers.value = []
	selectedTypes.value = []
	emit('clearFilters')
}

const fetchTeachers = async () => {
	try {
		// const response = await $fetch(`${config.public.apiBase}/teachers/`)
		// teachers.value = response
	} catch (err) {
		console.error('Error fetching teachers:', err)
	}
}

const fetchClassTypes = async () => {
	try {
		// const response = await $fetch(`${config.public.apiBase}/class-types/`)
		// classTypes.value = response
	} catch (err) {
		console.error('Error fetching class types:', err)
	}
}
</script>

<style scoped>
.gap-xs {
	gap: 8px;
}

.gap-sm {
	gap: 12px;
}

/* Asegurar que los diálogos se posicionen correctamente */
.relative-position {
	position: relative;
}

.absolute-top-left {
	position: absolute;
	top: 100%;
	left: 0;
}

/* Responsive */
@media (max-width: 600px) {
	.row.items-center.justify-between {
		flex-direction: column;
		align-items: flex-start;
		gap: 16px;
	}

	.col-auto:last-child {
		width: 100%;
		justify-content: flex-start;
	}
}
</style>