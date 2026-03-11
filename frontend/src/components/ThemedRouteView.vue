<!-- AI-generated: Theme-aware route wrapper -->
<script setup>
import { computed, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import { configStore } from '../utils/configStore.js'

const props = defineProps({
  dark: { type: Function, required: true },
  light: { type: Function, required: true },
})

const route = useRoute()

const activeLoader = computed(() => (configStore.THEME === 'light' ? props.light : props.dark))
const ActiveComponent = computed(() => defineAsyncComponent(activeLoader.value))
</script>

<template>
  <component :is="ActiveComponent" :key="`${route.fullPath}-${configStore.THEME}`" />
</template>

