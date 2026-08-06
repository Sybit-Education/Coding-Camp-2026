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

  <div class="flex overflow-x-auto scrollbar-hide lg:overflow-visible lg:justify-center">
    <RouterLink to="/map">
      <article
        class="flex items-center gap-5 rounded-xl border w-75 border-border bg-background p-4 shadow-sm transition duration-200 ease-out group-hover:-translate-y-0.5 group-hover:border-primary group-hover:shadow-md"
      >
        <img
          :src="map"
          :alt="'Karte'"
          class="aspect-square h-40 w-40 shrink-0 rounded-lg object-cover"
        />
        <div class="min-w-0">
          <h2 class="text-xl font-bold text-heading">Karte</h2>
          <p class="mt-1 text-text">Erkunde die Mettnau!</p>
        </div>
      </article>
    </RouterLink>
    <RouterLink to="/lexiconDetail/9v1wsyol8316l27">
      <article
        class="flex items-center gap-5 rounded-xl border border-border bg-background p-4 shadow-sm transition duration-200 ease-out group-hover:-translate-y-0.5 group-hover:border-primary group-hover:shadow-md"
      >
        <img
          :src="haubentaucher"
          :alt="'Karte'"
          class="aspect-square h-40 w-40 shrink-0 rounded-lg object-cover"
        />
        <div class="min-w-0">
          <h2 class="text-xl font-bold text-heading">Tier der Woche</h2>
          <p class="mt-1 text-text">Haubentaucher</p>
        </div>
      </article>
    </RouterLink>
  </div>


  <div>
    <!-- Simple Import -->
    <WeatherAlert />
  </div>
</template>

<script setup lang="ts">
import WeatherAlert from '@/components/WeatherAlert.vue'
import map from '@/assets/Map.png'
import haubentaucher from '@/assets/Haubentaucher.jpg'
</script>






