<template>
  <iframe
    :src="`https://xeno-canto.org/${props.id}/embed?darkbg=${props.darkBackground ? 1 : 0}`"
    scrolling="no"
    frameborder="0"
    class="w-full"
    height="220"
  />
</template>
<script setup lang="ts">
const props = defineProps<{
  id: number
  darkBackground: boolean
}>()
</script>
