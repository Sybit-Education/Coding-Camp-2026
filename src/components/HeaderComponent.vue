<script setup lang="ts">
defineProps<{
  isCompact?: boolean
}>()
</script>

<template>
  <header
    class="header flex items-center justify-center bg-cover bg-no-repeat bg-center"
    :class="{ 'header--compact': isCompact }"
    :style="{
      backgroundImage: isCompact
        ? 'radial-gradient(circle at center 30px, white 0%, transparent 70%), url(/img/Banner.jpg)'
        : `radial-gradient(circle at center 100px, white 0%, transparent 70%), linear-gradient(to bottom, transparent, white), url(/img/Banner.jpg)`,
    }"
  >
    <div class="header-content flex flex-col items-center font-head">
      <span class="header-title text-3xl font-bold text-primary2">Mettnau</span>
      <div class="header-motto flex gap-1">
        <span class="text-primary1 font-bold">Entdecken.</span>
        <span class="text-accent1 font-bold">Schützen.</span>
        <span class="text-primary2 font-bold">Erleben.</span>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  height: 200px;
  flex: 0 0 200px;
  transition: height 300ms ease, flex-basis 300ms ease, background-position 300ms ease;
}

.header-content {
  transition: gap 300ms ease, transform 300ms ease;
}

.header-title,
.header-motto {
  transition: font-size 300ms ease, line-height 300ms ease;
}

.header--compact {
  height: 56px;
  flex-basis: 56px;
  background-position: center 42%;
  -webkit-mask-image: linear-gradient(to bottom, black 0%, black 68%, transparent 100%);
  mask-image: linear-gradient(to bottom, black 0%, black 68%, transparent 100%);
}

.header--compact .header-content {
  flex-direction: row;
  gap: 0.5rem;
  white-space: nowrap;
}

.header--compact .header-title,
.header--compact .header-motto {
  font-size: 1rem;
  line-height: 1.25rem;
}

.header--compact .header-title::after {
  content: ':';
}

@media (max-width: 420px) {
  .header--compact .header-content {
    gap: 0.25rem;
    transform: scale(0.9);
  }
}
</style>
