<template>
  <div class="pane-container">
    <div class="pane-header">
      <div class="tabs">
        <button :class="{ active: !isPreview }" @click="isPreview = false">BBCode Source</button>
        <button :class="{ active: isPreview }" @click="isPreview = true">BBCode Preview</button>
      </div>
    </div>
    <div class="pane-content">
      <vue-monaco-editor
        v-if="!isPreview"
        :value="store.bbcodeText"
        language="plaintext"
        theme="vs-light"
        :options="{ minimap: { enabled: false }, wordWrap: 'on', readOnly: true }"
        class="editor"
      />
      <div v-else class="preview-content" v-html="store.bbcodePreviewHtml"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useEditorStore } from '../stores/editor'

const store = useEditorStore()
const isPreview = ref(false)
</script>

<style scoped>
.pane-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}
.pane-header {
  padding: 8px;
  background-color: #f3f4f6;
  border-bottom: 1px solid #e5e7eb;
}
.tabs button {
  padding: 6px 16px;
  margin-right: 8px;
  cursor: pointer;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
}
.tabs button.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}
.pane-content {
  flex: 1;
  overflow: auto;
  position: relative;
}
.editor {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.preview-content {
  padding: 16px;
  font-family: sans-serif;
}
</style>
