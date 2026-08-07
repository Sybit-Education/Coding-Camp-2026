<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
import HeaderComponent from '@/components/HeaderComponent.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <HeaderComponent />
  <RouterView />
  <Navbar />
</template>
