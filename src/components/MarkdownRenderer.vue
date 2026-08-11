<script setup lang="ts">
import DOMPurify from 'dompurify'
import { marked } from 'marked'
import { computed } from 'vue'

const props = defineProps<{
  source: string
}>()

const renderedHtml = computed(() => {
  if (!props.source) return ''
  return DOMPurify.sanitize(marked.parse(props.source, { async: false }))
})
</script>

<template>
  <div class="prose max-w-none" v-html="renderedHtml" />
</template>

<style scoped>
.prose {
  --tw-prose-body: var(--color-text);
  --tw-prose-headings: var(--color-heading);
  --tw-prose-links: var(--color-primary);
  --tw-prose-bold: var(--color-text);
  --tw-prose-counters: var(--color-text);
  --tw-prose-bullets: var(--color-primary);
  --tw-prose-hr: var(--color-border);
  --tw-prose-quotes: var(--color-text);
  --tw-prose-quote-borders: var(--color-primary);
  --tw-prose-code: var(--color-text);
  --tw-prose-pre-code: var(--color-text);
  --tw-prose-pre-bg: var(--color-background-mute);
  --tw-prose-th-borders: var(--color-border);
  --tw-prose-td-borders: var(--color-border);
  --tw-prose-captions: var(--color-text);
}

.prose :deep(h1) {
  color: var(--color-primary);
}

.prose :deep(h2),
.prose :deep(h3),
.prose :deep(h4),
.prose :deep(h5),
.prose :deep(h6) {
  color: var(--color-secondary);
}
</style>