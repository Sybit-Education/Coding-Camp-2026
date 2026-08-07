<script setup lang="ts">
import { Ban, CheckCircle } from '@lucide/vue'
</script>

<template>
  <div>
    <h1>Badebereiche Mettnau</h1>

    <section>
      <div>
        <h2>Erlaubt</h2>
      </div>

      <p>
        Das Schwimmen im Bodensee ist auf der Mettnau ausschließlich in den dafür vorgesehenen,
        bewachten Zonen gestattet.
      </p>

      <ul>
        <li>
          <strong>Strandbad Mettnau:</strong>
          Größter offizieller Badebereich mit Liegewiesen und familienfreundlichem Ufer.
        </li>
        <li>
          <strong>Seebad Mettnau:</strong>
          Modernisiertes Freibad mit Holzterrasse, Kiosk und Spielplatz.
        </li>
      </ul>
    </section>

    <section>
      <div>
        <h2>Verboten</h2>
      </div>

      <p>
        Laut der städtischen Umweltschutz-Verordnung herrscht am restlichen Uferbereich ein
        allgemeines Badeverbot.
      </p>

      <ul>
        <li>Naturschutzgebiet Mettnau</li>
        <li>Liebesinsel</li>
        <li>Grün- und Erholungsanlagen außerhalb der Strandbäder</li>
      </ul>
    </section>
  </div>
</template>
