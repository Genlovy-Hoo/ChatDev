<template>
  <div class="workflow-workbench">
    <div class="workflow-sidebar" :class="{ open: isSidebarOpen }">
      <WorkflowList
        ref="workflowListRef"
        :use-routing="false"
        :selected="selectedWorkflow"
        @select="handleSelect"
      />
    </div>
    <!-- Sidebar toggle button, positioned next to the sidebar -->
    <button 
      class="sidebar-toggle-btn" 
      :class="{ 'sidebar-open': isSidebarOpen }"
      @click="handleToggleSidebar" 
      aria-label="Toggle sidebar"
    >
      <span v-if="isSidebarOpen">‹</span>
      <span v-else>›</span>
    </button>
    <div class="workflow-viewer" :class="{ 'sidebar-open': isSidebarOpen }">
      <WorkflowView
        v-if="selectedWorkflow"
        :workflow-name="selectedWorkflow"
        :key="selectedWorkflow"
        @refresh-workflows="handleRefreshWorkflows"
      />
      <div v-else class="placeholder">
        <div class="placeholder-title"> Select a workflow</div>
        <div class="placeholder-subtitle">Choose a workflow from the list to view or edit.</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import WorkflowList from './light_WorkflowList.vue'
import WorkflowView from './light_WorkflowView.vue'

const route = useRoute()
const router = useRouter()
const workflowListRef = ref(null)

const normalizeName = (name) => name?.replace?.('.yaml', '') ?? ''
const selectedWorkflow = ref(normalizeName(route.params.name))
const isSidebarOpen = ref(true)

watch(
  () => route.params.name,
  (name) => {
    selectedWorkflow.value = normalizeName(name)
  },
  { immediate: true }
)

function handleToggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value
  window.dispatchEvent(new CustomEvent('workflow-sidebar-state', { detail: { open: isSidebarOpen.value } }))
}

onMounted(() => {
  window.addEventListener('toggle-workflow-sidebar', handleToggleSidebar)
})

onBeforeUnmount(() => {
  window.removeEventListener('toggle-workflow-sidebar', handleToggleSidebar)
})

const handleSelect = (name) => {
  const normalized = normalizeName(name)
  selectedWorkflow.value = normalized

  // Minimize sidebar when an entry is selected
  isSidebarOpen.value = false
  window.dispatchEvent(new CustomEvent('workflow-sidebar-state', { detail: { open: isSidebarOpen.value } }))

  if (normalized) {
    router.push({ path: `/workflows/${normalized}` })
  } else {
    router.push({ path: '/workflows' })
  }
}

const handleRefreshWorkflows = async () => {
  // Reload workflows in WorkflowList
  if (workflowListRef.value?.loadWorkflows) {
    await workflowListRef.value.loadWorkflows()
  }
}
</script>

<style scoped>
.workflow-workbench {
  position: relative;
  display: flex;
  height: calc(100vh - 55px);
  background-color: #ffffff;
  color: #213547;
  overflow: hidden;
}

.workflow-sidebar {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 400px;
  transform: translateX(calc(-100% + 10px));
  transition: transform 0.35s cubic-bezier(.77,.2,.05,1.0);
  z-index: 3;
  border-right: 1px solid #e5e7eb;
  background-color: #fafafa;
  overflow-y: auto;
  overflow-x: hidden;
  box-shadow: 4px 0 16px rgba(0, 0, 0, 0.06);
}
.workflow-sidebar.open {
  transform: translateX(0);
}

/* Sidebar toggle button - positioned next to the sidebar */
.sidebar-toggle-btn {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 12px;
  height: 72px;
  padding: 12px;
  background: linear-gradient(180deg, #f3f4f6, #e5e7eb);
  border: 1px solid #d1d5db;
  border-left: none;
  border-radius: 0 12px 12px 0;
  color: #374151;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
  transition: left 0.35s cubic-bezier(.77,.2,.05,1.0),
              background 0.2s,
              color 0.2s,
              border-color 0.2s;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.08);
}

.sidebar-toggle-btn.sidebar-open {
  left: 400px; /* Follow the sidebar when expanded */
}

.sidebar-toggle-btn:hover {
  background: linear-gradient(180deg, #e5e7eb, #d1d5db);
  color: #1f2937;
  border-color: #9ca3af;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.1);
}

.sidebar-toggle-btn span {
  font-weight: 700;
  line-height: 1;
}

.workflow-viewer {
  flex: 1;
  min-width: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: margin-left 0.35s cubic-bezier(.77,.2,.05,1.0);
  margin-left: 10px; /* Match the visible width when the sidebar is collapsed */
}

.placeholder {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: transparent;
  color: #374151;
  text-align: center;
  padding: 24px;
}

.placeholder::before {
  content: '';
  position: absolute;
  top: -150px;
  left: 0;
  right: 0;
  height: 500px;
  background: linear-gradient(
    90deg,
    #aaffcd,
    #99eaf9,
    #a0c4ff
  );
  filter: blur(120px);
  opacity: 0.15;
  z-index: 0;
  pointer-events: none;
}

.placeholder-title {
  position: relative;
  z-index: 1;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #1f2937;
}

.placeholder-subtitle {
  position: relative;
  z-index: 1;
  font-size: 14px;
  color: #6b7280;
}
</style>
