<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
import BirdAudio from '@/components/BirdAudio.vue'
</script>

<template>
  <h1 class="text-3xl font-bold underline text-primary">Hello world!</h1>
  <h1 class="text-3xl font-bold underline text-secondary">Hello world2!</h1>

  <button class="btn btn-primary">Zur Karte</button>
  <button class="btn btn-secondary">Infos</button>

  <Navbar />
  <BirdAudio />
</template>
