<template>
  <q-header class="bg-white">
    <q-toolbar class="justify-center relative">
      <!-- Botón menú hamburguesa (solo visible en móvil) -->
      <q-btn flat icon="menu" class="lt-md absolute-right" text-color="black" @click="toggleMenu" />

      <!-- Logo o título centrado -->
      <!-- <div class="text-h6 text-weight-bold text-black">
				TuLogo
			</div> -->

      <!-- Menú desktop (oculto en móvil) -->
      <div class="gt-sm q-gutter-lg uppercase">
        <q-btn flat label="Inicio" to="/" text-color="black" />
        <q-btn flat label="Tienda" to="#" text-color="black" />
        <q-btn flat label="Servicios" to="#" text-color="black" />
        <q-btn flat label="Reservar" to="/reservar" text-color="black" />
        <q-btn flat label="Cuenta" to="/cuenta" text-color="black" />
      </div>
    </q-toolbar>

    <!-- Menú móvil (solo visible en móvil) -->
    <q-slide-transition class="">
      <q-list v-if="isOpen" class="lt-md bg-white uppercase ">
        <q-item clickable v-ripple to="/" @click="closeMenu">
          <q-item-section class="text-weight-bold text-black">Inicio</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/" @click="closeMenu">
          <q-item-section class="text-weight-bold text-black">Tienda</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/" @click="closeMenu">
          <q-item-section class="text-weight-bold text-black">Servicios</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/reservar" @click="closeMenu">
          <q-item-section class="text-weight-bold text-black">Reservar</q-item-section>
        </q-item>
      </q-list>
    </q-slide-transition>
  </q-header>
</template>

<script setup>
import { ref } from 'vue'

const isOpen = ref(false)

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const closeMenu = () => {
  isOpen.value = false
}
</script>

<style scoped>
.q-toolbar {
  height: 70px;
  border-bottom: 4px solid black;
}

/* Asegurar que el menú móvil ocupe todo el ancho */
.lt-md .q-list {
  width: 100%;
}

.q-list {
  border-bottom: 1px solid #6e6e6e;
}
</style>
