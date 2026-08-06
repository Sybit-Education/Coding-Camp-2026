<script setup lang="ts">
import { Ban, CheckCircle } from 'lucide-vue-next'
</script>

<template>
  <div class="mx-auto max-w-2xl px-4 py-8">
    <h1 class="mb-8 text-4xl font-bold text-green-700">Badebereiche Mettnau</h1>

    <section class="mb-8">
      <div class="mb-4 flex items-center gap-2">
        <CheckCircle class="h-6 w-6 text-green-600" />
        <h2 class="text-2xl font-semibold text-green-700">Erlaubt</h2>
      </div>

      <p>
        Das Schwimmen im Bodensee ist auf der Mettnau ausschließlich in den dafür vorgesehenen,
        bewachten Zonen gestattet.
      </p>

      <ul class="mt-4 list-disc space-y-2 pl-6">
        <li>
          <strong>Strandbad Mettnau:</strong> Größter offizieller Badebereich mit Liegewiesen und
          familienfreundlichem Ufer.
        </li>
        <li>
          <strong>Seebad Mettnau:</strong> Modernisiertes Freibad mit Holzterrasse, Kiosk und
          Spielplatz.
        </li>
      </ul>
    </section>

    <section>
      <div class="mb-4 flex items-center gap-2">
        <Ban class="h-6 w-6 text-red-600" />
        <h2 class="text-2xl font-semibold text-red-600">Verboten</h2>
      </div>

      <p>
        Laut der städtischen Umweltschutz-Verordnung herrscht am restlichen Uferbereich ein
        allgemeines Badeverbot.
      </p>

      <ul class="mt-4 list-disc space-y-2 pl-6">
        <li>Naturschutzgebiet Mettnau</li>
        <li>Liebesinsel</li>
        <li>Grün- und Erholungsanlagen außerhalb der Strandbäder</li>
      </ul>
    </section>
  </div>
</template>
