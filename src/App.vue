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
      <div class="header-links">
        <a href="https://github.com/chadlrnsn/markdown-to-bbcode" target="_blank" rel="noopener" class="repo-link" title="GitHub Repository">
          <svg height="24" viewBox="0 0 16 16" width="24" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
        </a>
        <a href="https://github.com/chadlrnsn" target="_blank" rel="noopener" class="profile-link" title="Creator Profile">
          <img src="https://github.com/chadlrnsn.png" alt="chadlrnsn" class="avatar">
        </a>
      </div>
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
  padding: 12px 24px;
  background-color: #1f2937;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-links {
  display: flex;
  align-items: center;
  gap: 16px;
}

.repo-link, .profile-link {
  color: #9ca3af;
  transition: color 0.2s;
  display: flex;
  align-items: center;
}

.repo-link:hover {
  color: white;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid transparent;
  transition: border-color 0.2s;
}

.profile-link:hover .avatar {
  border-color: #3b82f6;
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
