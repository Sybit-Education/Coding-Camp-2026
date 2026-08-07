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
    <section class="flex flex-col gap-4">
      <Warning class="w-1/2" />
      <WeatherAlert class="w-1/2 "/>
    </section>
  </main>
</template>

<script setup lang="ts">
import Warning from '@/components/Warning.vue'
import WeatherAlert from '@/components/WeatherAlert.vue';
</script>
