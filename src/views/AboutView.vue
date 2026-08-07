<template>
  <main>
      <h1>About Us</h1>

      <div class="flex items-center justify-center m-0">
        <img src="/team.jpeg" class="rounded-lg" />
      </div>

      <section class="my-5">
      <h2 class="flex-md"><InfoIcon /> Infos</h2>
      <div class="flex-sm flex-col md:flex-row">
        <h3>Über das Projekt</h3>
        <p>
          Diese Website wurde im Rahmen des SYBIT Coding Camps 2026 entwickelt ‐ von jungen
          Talenten, die mit Neugier ihre ersten Schritte in der professionellen
          Softwareentwicklung gegangen sind. Unser Ziel war es, nicht nur Code zu schreiben,
          sondern etwas Sinnvolles zu erschaffen, das funktioniert, nützlich ist und unsere Ideen
          sichtbar macht. Einen besonderen Dank gilt all umserem Teilnehmern, die mit
          Leidenschaft, Teamgeist und Ausdauer an diesem Projekt gearbeitet haben. Jede
          Komponente, jede Zeile Code und jede Entscheidung dahinter spiegelt den Lernprozess und
          das Engagement aller Beteiligten wieder.
        </p>

        <h2 class="flex-md"><UsersIcon /> Das Team</h2>
        <!-- Right -->
        <div class="flex-1 flex-sm flex-col">
          <!-- Participant -->
          <div class="flex-1">
            <h3>Teilnehmer</h3>
            <p>
              Carlton Gauthier, Elias Wieland, Felix Riedinger, Jannick Hüttel, Lars Klopfer, Pan
              Walser, Patrick Burberg, Pino Hirsch
            </p>
          </div>
          <!-- Coaches -->
          <div class="flex-1">
            <h3>Coaches von SYBIT</h3>
            <p>
              Elias Frank, Fiona Krause, Franz Strittmatter, Jimmy Bergstaedt, Stephan Strittmatter,
              Thiara Adrian, Tobias Jentzsch, Yannik Schwarz
            </p>
          </div>
        </div>
      </div>
      </section>

      <div class="card-sybit my-5">
        <h2 class="text-white">Das SYBIT Coding Camp - Eine Erfolgsgeschichte</h2>
        <p>
          Das SYBIT Coding Camp - Eine Erfolgsgeschichte Das SYBIT Coding Camp findet seit 2015
          jährlich in der ersten vollen Woche der Sommerferien im Rahmen des Ferienprogramms der
          Stadt Radolfzell statt. Viele ehemalige Teilnehmende sind heute fester Bestandteil des
          Unternehmens und besuchen das Coding Camp regelmäßig, um sich inspirieren zu lassen und
          den aktuellen Projekten zu folgen.
        </p>

        <a class="flex items-center text-[#c9ff29]" href="https://www.sybit.education/">
          Website Nachwuchskräfte SYBIT
          <ExternalLinkIcon class="size-5" />
        </a>
      </div>

      <!-- Sybit -->
      <div class="card-sybit my-5">
        <h2 class="text-white">SYBIT GmbH</h2>
        <p>
          SYBIT ist Europas führender Full-Service-Anbieter für Customer Experience (CX) mit
          umfassender Expertise in Business Consulting, Process Consulting und Solution Consulting.
          Als strategischer Partner begleitet SYBIT Unternehmen dabei, kundenzentrierte Prozesse zu
          gestalten und innovative Lösungen entlang der gesamten Customer Journey zu implementieren.
          Mit über 25 Jahren Erfahrung und als Teil der NTT Data Business Solutions treibt SYBIT die
          digitale Transformation nachhaltig voran. We create Customer Experience Champions!
        </p>
        <a class="flex items-center text-[#c9ff29]" href="https://www.sybit.education/">
          SYBIT GmbH
          <ExternalLinkIcon class="size-5" />
        </a>
      </div>
  </main>
</template>

<script setup lang="ts">
import { ExternalLinkIcon, InfoIcon, UsersIcon } from '@lucide/vue'
</script>
