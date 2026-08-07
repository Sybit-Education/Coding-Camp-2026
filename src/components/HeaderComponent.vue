<script setup lang="ts">
</script>

<template>
  <header
    class="flex items-center justify-center h-50 bg-cover bg-no-repeat bg-center"
    :style="{
      backgroundImage: `radial-gradient(circle at center 100px, white 0%, transparent 70%), linear-gradient(to bottom, transparent, white), url(/img/Banner.jpg)`,
    }"
  >
    <div class="flex flex-col items-center font-head">
      <div class="flex">
        <span class="text-3xl font-bold text-primary2">Mettnau</span>
      </div>
      <div class="flex gap-1">
        <span class="text-primary1 font-bold">Entdecken.</span>
        <span class="text-accent1 font-bold">Schützen.</span>
        <span class="text-primary2 font-bold">Erleben.</span>
      </div>
    </div>
  </header>
</template>
