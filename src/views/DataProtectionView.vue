<template>
  <div class="min-h-screen py-8 pb-32">
    <div class="mx-auto max-w-2xl px-4 text-gray-700">
      <h1>Datenschutzerklärung</h1>

      <div class="space-y-8">
        <section>
          <p class="leading-7">
            Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren
            personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene
            Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
          </p>
        </section>

        <section>
          <h2>Datenerfassung auf dieser Website</h2>

          <h3>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</h3>

          <p class="leading-7">
            Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen
            Kontaktdaten können Sie dem Abschnitt „Hinweis zur verantwortlichen Stelle“ in dieser
            Datenschutzerklärung entnehmen.
          </p>
        </section>

        <section>
          <h3>Wie erfassen wir Ihre Daten?</h3>

          <p class="leading-7">
            Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann
            es sich beispielsweise um Daten handeln, die Sie in ein Kontaktformular eingeben.
          </p>

          <p class="leading-7">
            Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website
            durch unsere IT-Systeme erfasst. Das sind vor allem technische Daten, beispielsweise
            Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs.
          </p>
        </section>

        <section>
          <h2>Verantwortliche Stelle</h2>

          <div class="card-soft">
            <p class="font-semibold">Sybit GmbH</p>
            <p>Sankt-Johannis-Str. 1-5</p>
            <p>78315 Radolfzell, Germany</p>

            <div class="my-4 border-t"></div>

            <p>Telefon: +49 7732 9508-0</p>
            <p>E-Mail: sales@sybit.de</p>
          </div>
        </section>

        <section>
          <h2>Datenschutzbeauftragter</h2>

          <div class="card-soft">
            <p class="font-semibold">PROLIANCE GmbH</p>
            <p>Leopoldstraße 21</p>
            <p>80802 München</p>
            <p>Deutschland</p>
            <p>E-Mail: datenschutzbeauftragter@datenschutzexperte.de</p>
          </div>
        </section>

        <section>
          <h2>Ihre Rechte</h2>

          <ul class="list-disc space-y-2 pl-6 leading-7">
            <li>Auskunft über gespeicherte personenbezogene Daten</li>
            <li>Berichtigung unrichtiger Daten</li>
            <li>Löschung personenbezogener Daten</li>
            <li>Einschränkung der Verarbeitung</li>
            <li>Datenübertragbarkeit</li>
            <li>Widerruf erteilter Einwilligungen</li>
            <li>Beschwerde bei der zuständigen Aufsichtsbehörde</li>
          </ul>
        </section>

        <div class="flex flex-wrap gap-3 pt-4">
          <RouterLink to="/">
            <button class="btn btn-primary">Zurück zur Startseite</button>
          </RouterLink>

          <a href="https://www.sybit.com/de/impressum" target="_blank" rel="noopener noreferrer">
            <button class="btn btn-primary w-full">Impressum</button>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
