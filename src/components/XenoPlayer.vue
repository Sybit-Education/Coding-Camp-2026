<template>
  <iframe
    :src="`https://xeno-canto.org/${props.id}/embed`"
    scrolling="no"
    frameborder="0"
    class="w-full"
    height="220"
  />
</template>
<script setup lang="ts">
const props = defineProps<{
  id: string
  darkBackground: boolean
}>()

props.id
</script>
