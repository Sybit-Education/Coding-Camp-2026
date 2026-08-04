<template>
  <div class="flex flex-row lg:flex-row p-4">
    <img :src="imagePath" :alt="imageDescription" class="aspect-square rounded-lg w-32" />
    <div class="p-8">
      <h1 class="text-xl font-bold">{{ title }}</h1>
      <p>{{ description }}</p>
    </div>
  </div>
</template>
<script setup lang="ts">
const title = 'Haubentaucher'
const description = 'Der Haubentaucher ist eine Vogelart aus der Familie der Lappentaucher.'
const imagePath = '../assets/Haubentaucher.jpg'
const imageDescription = 'Ein Haubentaucher.'
</script>
