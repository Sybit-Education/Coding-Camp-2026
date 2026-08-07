<template>
  <main class="space-y-8">
    <h1 class="text-3xl font-bold text-primary">Mettnau</h1>

    <section class="flex flex-col gap-4">
      <p>
        Willkommen auf der App für die Mettnau! Entdecken Sie die Schönheit und Vielfalt dieses einzigartigen Naturgebiets, das sich entlang des Bodensees erstreckt. Die Mettnau bietet eine Vielzahl von Freizeitmöglichkeiten, darunter Wanderungen, Vogelbeobachtungen und entspannende Spaziergänge inmitten unberührter Natur.
      </p>
      <p>
        Erfahren Sie mehr über die Flora und Fauna der Region, die Geschichte der Mettnau und die verschiedenen Veranstaltungen, die das ganze Jahr über stattfinden. Ob Sie ein Naturliebhaber, ein Fotograf oder einfach nur auf der Suche nach einem ruhigen Rückzugsort sind – die Mettnau hat für jeden etwas zu bieten.
      </p>
    </section>
    <div class="flex overflow-x-auto scrollbar-hide lg:overflow-visible lg:justify-center gap-3">
      <RouterLink to="/map">
        <article
          class="flex items-center gap-5 rounded-xl border w-75 border-border bg-background p-4 shadow-sm transition duration-200 ease-out group-hover:-translate-y-0.5 group-hover:border-primary group-hover:shadow-md"
        >
          <img
            :src="'/img/Map.png'"
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
            :src="'/img/Haubentaucher.jpg'"
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
    <section class="flex flex-col gap-4">
      <Warning class="w-1/2" />
      <WeatherAlert class="w-1/2 "/>
    </section>
  </main>
</template>

<script setup lang="ts">
import Warning from '@/components/Warning.vue'
import WeatherAlert from '@/components/WeatherAlert.vue'
</script>
