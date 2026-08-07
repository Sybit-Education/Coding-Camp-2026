<script setup lang="ts">
import AutoTextToSpeech from '@/components/AutoTextToSpeech.vue';
</script>

<template>
  <main>
    <h1>Badebereiche Mettnau</h1>

    <AutoTextToSpeech :targetSelector="'main'" lang="de-DE" />

    <h2>Erlaubt</h2>

    <p>
      Das Schwimmen im Bodensee ist auf der Mettnau ausschließlich in den dafür vorgesehenen,
      bewachten Zonen gestattet.
    </p>

    <ul class="list-disc ml-5">
      <li>
        <strong>Strandbad Mettnau:</strong>
        Größter offizieller Badebereich mit Liegewiesen und familienfreundlichem Ufer.
      </li>
      <li>
        <strong>Seebad Mettnau:</strong>
        Modernisiertes Freibad mit Holzterrasse, Kiosk und Spielplatz.
      </li>
    </ul>

    <h2>Verboten</h2>

    <p>
      Laut der städtischen Umweltschutz-Verordnung herrscht am restlichen Uferbereich ein allgemeines Badeverbot:
    </p>
    <ul class="list-disc ml-5">
      <li>Naturschutzgebiet Mettnau</li>
      <li>Liebesinsel</li>
      <li>Grün- und Erholungsanlagen außerhalb der Strandbäder</li>
    </ul>
  </main>
</template>
