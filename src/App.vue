<template>
  <div class="app-shell">
    <HeaderComponent v-if="showHeader" :is-compact="isHeaderCompact" class="shrink-0" />

    <main
      ref="contentRef"
      class="app-content"
      :class="{
        'map-content': route.name === 'map',
        'header-compact-content': isHeaderCompact,
      }"
      @scroll="updateHeaderState"
    >
      <RouterView />
    </main>

    <Navbar />
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
import HeaderComponent from '@/components/HeaderComponent.vue'
import { RouterView, useRoute } from 'vue-router'
import { computed, onMounted, shallowRef, useTemplateRef } from 'vue'

const route = useRoute()
const showHeader = computed(() => route.name !== 'map')
const contentRef = useTemplateRef<HTMLElement>('contentRef')
const isHeaderCompact = shallowRef(false)

function updateHeaderState() {
  const scrollTop = contentRef.value?.scrollTop ?? 0
  isHeaderCompact.value = scrollTop > 0
}

onMounted(updateHeaderState)
</script>

<style scoped>
.header-compact-content {
  padding-bottom: 90px;
}
</style>
