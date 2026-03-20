<script setup lang="ts">
import SplitLayout from './components/SplitLayout.vue'
import MarkdownPane from './components/MarkdownPane.vue'
import BBCodePane from './components/BBCodePane.vue'
import SettingsPanel from './components/SettingsPanel.vue'
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <h1>Markdown to Bitrix BBCode</h1>
    </header>
    <SettingsPanel />
    <main class="app-main">
      <SplitLayout>
        <template #left>
          <MarkdownPane />
        </template>
        <template #right>
          <BBCodePane />
        </template>
      </SplitLayout>
    </main>
  </div>
</template>

<style>
/* Global resets for the app container */
body, html {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background-color: #f3f4f6;
}
#app {
  height: 100vh;
}

/* Bitrix24 Typography Simulation */
.ui-typography-container {
  color: #333;
  line-height: 1.5;
  font-size: 14px;
}

.ui-typography-container p {
  margin-bottom: 12px;
}

.ui-typography-container ul, .ui-typography-container ol {
  margin: 0 0 12px 20px;
  padding: 0;
}

.ui-typography-container li {
  margin-bottom: 4px;
}

.ui-typography-container blockquote {
  border-left: 4px solid #eef2f4;
  margin: 0 0 12px 0;
  padding: 8px 16px;
  color: #525c69;
  background: #f8fafb;
}

.ui-typography-container pre {
  background: #fdfdfd;
  border: 1px solid #eef2f4;
  padding: 12px;
  border-radius: 4px;
  overflow-x: auto;
  font-family: monospace;
}

/* Common Table Styles */
.ui-typography-container table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #edeef0;
  margin-bottom: 16px;
}

.ui-typography-container td, .ui-typography-container th {
  padding: 10px 15px;
  border: 1px solid #edeef0;
  vertical-align: top;
}

.ui-typography-container th {
  background-color: #f3f4f6;
  font-weight: 600;
  text-align: left;
}

.ui-typography-container tr:nth-child(even) {
  background-color: #fcfcfc;
}

/* Bitrix24 Table Simulation */
.b24-table-wrapper {
  margin-bottom: 16px;
  overflow-x: auto;
}
</style>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.app-header {
  padding: 16px 24px;
  background-color: #1f2937;
  color: white;
}

.app-header h1 {
  margin: 0;
  font-size: 1.25rem;
}

.app-main {
  flex: 1;
  overflow: hidden;
}
</style>
