<template>
  <Transition name="modal-fade">
    <div v-if="isVisible" class="modal-overlay" @click.self="close">
      <div class="modal-content settings-modal">
        <div class="modal-header">
          <h3>Settings</h3>
          <button class="close-button" @click="close">×</button>
        </div>
        <div class="modal-body">
          <div class="settings-item">
            <label class="checkbox-label">
              <input type="checkbox" v-model="localConfig.AUTO_SHOW_ADVANCED">
              Auto show advanced setting
            </label>
            <p class="setting-desc">Automatically expand "Advanced Settings" in configuration forms.</p>
          </div>
          <div class="settings-item">
            <label class="checkbox-label">
              <input type="checkbox" v-model="localConfig.AUTO_EXPAND_MESSAGES">
              Automatically expand messages
            </label>
            <p class="setting-desc">Automatically expand message content in the chat view.</p>
          </div>
          <div class="settings-item">
            <label class="checkbox-label">
              <input type="checkbox" v-model="localConfig.ENABLE_HELP_TOOLTIPS">
              Enable help tooltips
            </label>
            <p class="setting-desc">Show contextual help tooltips throughout the workflow interface.</p>
          </div>
          <div class="settings-item">
            <div class="theme-label">Background theme</div>
            <p class="setting-desc">Choose between the original dark theme and the new light theme.</p>
            <div class="theme-options">
              <label>
                <input type="radio" value="dark" v-model="localConfig.THEME">
                Dark (default)
              </label>
              <label>
                <input type="radio" value="light" v-model="localConfig.THEME">
                Light
              </label>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-button" @click="close">Cancel</button>
          <button class="confirm-button" @click="save">Save</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { reactive, watch } from 'vue'
import { configStore } from '../../../utils/configStore.js'

const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true
  }
})

const localConfig = reactive({
  AUTO_SHOW_ADVANCED: false,
  AUTO_EXPAND_MESSAGES: false,
  ENABLE_HELP_TOOLTIPS: true,
  THEME: 'dark',
})

watch(() => props.isVisible, (newVal) => {
  if (newVal) {
    // Sync local state with global store when modal opens
    Object.assign(localConfig, configStore)
  }
})

const emit = defineEmits(['update:isVisible', 'close'])

const close = () => {
  emit('update:isVisible', false)
  emit('close')
}

const save = () => {
  // Commit local changes to global store
  Object.assign(configStore, localConfig)
  close()
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(2px);
}

.modal-content.settings-modal {
  width: 500px !important;
  max-width: 90vw;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  color: #0f172a;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.18);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
}

.close-button {
  background: none;
  border: none;
  color: #64748b;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.close-button:hover {
  color: #0f172a;
}

.modal-body {
  padding: 20px;
  flex: 1;
  overflow-y: auto;
}

.settings-item {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e2e8f0;
}

.settings-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #0f172a;
  font-size: 15px;
  cursor: pointer;
  user-select: none;
  margin-bottom: 6px;
}

.checkbox-label input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: #4facfe;
  cursor: pointer;
}

.setting-desc {
  margin-left: 26px;
  color: #475569;
  font-size: 13px;
  line-height: 1.4;
  margin-top: 0;
}

.theme-label {
  font-size: 15px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 6px;
}

.theme-options {
  margin-left: 26px;
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #0f172a;
}

.theme-options label {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.theme-options input[type="radio"] {
  cursor: pointer;
}

.modal-footer {
  padding: 16px 20px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.confirm-button {
  background: #4facfe;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.confirm-button:hover {
  background: #3a9cfa;
}

.cancel-button {
  background: #f8fafc;
  color: #0f172a;
  border: 1px solid #cbd5e1;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.cancel-button:hover {
  background: #f1f5f9;
  border-color: #94a3b8;
}

/* Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
