<template>
  <RouterLink
    :to="`/lexiconDetail/${placeholder.id}`"
    class="group block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
  >
    <article
      class="flex items-center gap-5 rounded-xl border border-border bg-background p-4 shadow-sm transition duration-200 ease-out group-hover:-translate-y-0.5 group-hover:border-primary group-hover:shadow-md"
    >
      <img
        :src="placeholder.imageUrl"
        :alt="placeholder.name"
        class="aspect-square h-24 w-24 shrink-0 rounded-lg object-cover"
      />
      <div class="min-w-0">
        <h2 class="text-xl font-bold text-heading">Karte</h2>
        <p class="mt-1 text-text">Erkunde die Mettnau!</p>
      </div>
    </article>
  </RouterLink>
</template>
