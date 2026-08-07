<template>
  <div class="page-view flex flex-col gap-4">
    <div class="grid gap-4 sm:grid-cols-2">
      <RouterLink to="/map" class="min-w-0">
        <section
          class="card flex min-w-0 items-center gap-4 rounded-xl border shadow-sm transition duration-200 ease-out hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
        >
          <img
            src="/img/Map.png"
            alt="Karte"
            class="h-20 w-20 shrink-0 rounded-tl-xl rounded-bl-xl object-cover sm:h-24 sm:w-24"
          />
          <div class="min-w-0">
            <h2 class="text-xl font-bold text-heading">Karte</h2>
            <p class="mt-1 text-text">Erkunde die Mettnau!</p>
          </div>
        </section>
      </RouterLink>

      <RouterLink v-if="newestBird" :to="`/lexiconDetail/${newestBird.id}`" class="min-w-0">
        <article
          class="card flex h-full min-w-0 items-center gap-4 shadow-sm transition duration-200 ease-out hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
        >  
            <img
            :src="newestBird.imageUrl ?? '/img/Haubentaucher.jpg'"
            :alt="newestBird.name"
            class="h-20 w-20 shrink-0 rounded-tl-xl rounded-bl-xl object-cover sm:h-24 sm:w-24"
          />
          <div class="min-w-0">
            <h2 class="text-xl font-bold text-heading">Tier der Woche</h2>

            <p class="mt-1 text-text">
              {{ newestBird?.name ?? 'Lade Vogel...' }}
            </p>
          </div>
        </article>
      </RouterLink>
    </div>

    <section class="flex flex-col gap-3">
      <p>
        Willkommen auf der App für die Mettnau! Entdecken Sie die Schönheit und Vielfalt dieses
        einzigartigen Naturgebiets, das sich entlang des Bodensees erstreckt. Die Mettnau bietet
        eine Vielzahl von Freizeitmöglichkeiten, darunter Wanderungen, Vogelbeobachtungen und
        entspannende Spaziergänge inmitten unberührter Natur.
      </p>
      <p>
        Erfahren Sie mehr über die Flora und Fauna der Region, die Geschichte der Mettnau und die
        verschiedenen Veranstaltungen, die das ganze Jahr über stattfinden. Ob Sie ein
        Naturliebhaber, ein Fotograf oder einfach nur auf der Suche nach einem ruhigen Rückzugsort
        sind – die Mettnau hat für jeden etwas zu bieten.
      </p>
    </section>
    <section class="grid gap-3 md:grid-cols-2">
      <Warning />
      <WeatherAlert />
    </section>
  </div>
</template>

<script setup lang="ts">
import Warning from '@/components/Warning.vue'
import WeatherAlert from '@/components/WeatherAlert.vue'
import { ref, onMounted } from 'vue'
import { ObservationService } from '@/services/observation.service'
import { PocketBaseService } from '@/services/pocket-base.service'

// Newest bird variabel
const newestBird = ref<LexiconEntry | undefined>(null)

// On mount
onMounted(async () => {
  const service = new ObservationService(new PocketBaseService())

  newestBird.value = await service.getNewestBird()
})
</script>
