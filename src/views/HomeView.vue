<template>
  <div class="space-y-8">
    <h1 class="text-3xl font-bold underline text-primary">Hello world!</h1>
    <h1 class="text-3xl font-bold underline text-secondary">Hello world2!</h1>

    <div class="flex gap-4">
      <button class="btn btn-primary">Zur Karte</button>
      <button class="btn btn-secondary">Infos</button>
      <RouterLink to="/DangerGuide" class="btn btn-primary"> Danger Guide </RouterLink>
    </div>

    <!-- Simple Import -->
    <Warning />
  </div>
</template>

<script setup lang="ts">
import Warning from '@/components/Warning.vue'
</script>
