<template>
  <main class="space-y-8">
    <h1 class="text-3xl font-bold text-primary">Mettnau</h1>

    <Warning />
    <WeatherAlert />
  </main>
</template>

<script setup lang="ts">
import Warning from '@/components/Warning.vue'
import WeatherAlert from '@/components/WeatherAlert.vue';
</script>
