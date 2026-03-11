<script setup>
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from './components/Sidebar.vue'
import LightSidebar from './themes/light/components/light_Sidebar.vue'
import { configStore } from './utils/configStore.js'

const route = useRoute()

// Hide the sidebar on LaunchView, BatchRunView and WorkflowWorkbench
const showSidebar = computed(() => route.path !== '/launch' && route.path !== '/batch-run')

const ActiveSidebar = computed(() => (configStore.THEME === 'light' ? LightSidebar : Sidebar))

watch(
  () => configStore.THEME,
  (theme) => {
    if (typeof document === 'undefined') return
    document.documentElement.dataset.theme = theme === 'light' ? 'light' : 'dark'
  },
  { immediate: true }
)
</script>

<template>
  <div class="app-container">
    <component :is="ActiveSidebar" v-if="showSidebar" :key="configStore.THEME" />
    <main class="main-content">
      <router-view :key="`${route.fullPath}-${configStore.THEME}`" />
    </main>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  background-color: white;
}

body {
  margin: 0;
  font-family: system-ui, sans-serif;
}
</style>
