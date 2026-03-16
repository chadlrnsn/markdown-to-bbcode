<template>
  <div class="settings-panel">
    <div class="settings-title">Parser Features</div>
    <div class="settings-grid">
      <label class="setting-item">
        <input type="checkbox" v-model="store.settings.headings" />
        Headings
      </label>
      <label class="setting-item">
        <input type="checkbox" v-model="store.settings.lists" />
        Lists
      </label>
      <label class="setting-item">
        <input type="checkbox" v-model="store.settings.tables" />
        Tables
      </label>
      <label class="setting-item">
        <input type="checkbox" v-model="store.settings.quotes" />
        Quotes
      </label>
      <label class="setting-item">
        <input type="checkbox" v-model="store.settings.formatting" />
        Formatting (B/I/S)
      </label>
      <label class="setting-item">
        <input type="checkbox" v-model="store.settings.links" />
        Links
      </label>
      <label class="setting-item">
        <input type="checkbox" v-model="store.settings.images" />
        Images
      </label>
      <label class="setting-item">
        <input type="checkbox" v-model="store.settings.code" />
        Code Blocks
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEditorStore } from '../stores/editor'
const store = useEditorStore()
</script>

<style scoped>
.settings-panel {
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  padding: 12px 24px;
}
.settings-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  margin-bottom: 8px;
}
.settings-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.setting-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  color: #374151;
  cursor: pointer;
}
.setting-item input {
  cursor: pointer;
}
</style>
