<template>
  <div class="pane-container" @mousemove="handleMouseMove">
    <div class="pane-header">
      <div class="tabs">
        <button :class="{ active: !isPreview }" @click="isPreview = false">BBCode Source</button>
        <button :class="{ active: isPreview }" @click="isPreview = true">BBCode Preview</button>
      </div>
      
      <div class="actions">
        <button class="copy-button" @click="copyToClipboard" title="Copy for Bitrix (Maintains formatting and spoilers)">
          Copy for Bitrix
        </button>
      </div>

      <!-- Fixed Toolbar -->
      <div v-if="!isPreview" class="toolbar">
        <input type="color" v-model="selectedColor" title="Text Color" @change="applyFormat('COLOR', selectedColor)" />
        <select v-model="selectedSize" @change="applyFormat('SIZE', selectedSize)">
          <option value="" disabled selected>Size</option>
          <option v-for="size in sizes" :key="size" :value="size">{{ size }}px</option>
        </select>
        <button @click="applyFormat('B')" title="Bold"><b>B</b></button>
        <button @click="applyFormat('I')" title="Italic"><i>I</i></button>
        <button @click="applyFormat('U')" title="Underline"><u>U</u></button>
      </div>
    </div>

    <div class="pane-content" ref="paneContent">
      <vue-monaco-editor
        v-if="!isPreview"
        v-model:value="store.bbcodeText"
        language="plaintext"
        theme="vs-light"
        :options="{ minimap: { enabled: false }, wordWrap: 'on', readOnly: false }"
        class="editor"
        @mount="handleEditorMount"
      />
      <div v-else class="preview-content" v-html="store.bbcodePreviewHtml"></div>

      <!-- Floating Tooltip -->
      <div 
        v-if="showTooltip && !isPreview" 
        class="floating-tooltip"
        :style="{ top: tooltipY + 'px', left: tooltipX + 'px' }"
      >
        <button @click="applyFormat('COLOR', selectedColor)" :style="{ color: selectedColor }">Color</button>
        <button @click="applyFormat('SIZE', selectedSize || '16')">Size</button>
        <button @click="applyFormat('B')"><b>B</b></button>
        <button @click="applyFormat('U')"><u>U</u></button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import { useEditorStore } from '../stores/editor'
import type * as monaco from 'monaco-editor'

const store = useEditorStore()
const isPreview = ref(false)
const editorRef = shallowRef<monaco.editor.IStandaloneCodeEditor | null>(null)

const selectedColor = ref('#ff0000')
const selectedSize = ref('')
const sizes = ['12', '14', '16', '18', '20', '24', '30', '36']

const showTooltip = ref(false)
const tooltipX = ref(0)
const tooltipY = ref(0)

const handleEditorMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
  editorRef.value = editor

  editor.onDidChangeCursorSelection((e) => {
    const selection = e.selection
    if (!selection.isEmpty()) {
      const position = editor.getScrolledVisiblePosition(selection.getEndPosition())
      if (position) {
        // Offset tooltip slightly above selection
        tooltipX.value = position.left
        tooltipY.value = position.top - 40
        showTooltip.value = true
      }
    } else {
      showTooltip.value = false
    }
  })
}

const copyToClipboard = async () => {
  try {
    const text = store.bbcodeText
    const html = store.bbcodePreviewHtml

    const typeText = 'text/plain'
    const typeHtml = 'text/html'
    
    const blobText = new Blob([text], { type: typeText })
    const blobHtml = new Blob([html], { type: typeHtml })

    const data = [
      new ClipboardItem({
        [typeText]: blobText,
        [typeHtml]: blobHtml,
      }),
    ]

    await navigator.clipboard.write(data)
    alert('Copied for Bitrix! Now you can paste it into the Bitrix editor.')
  } catch (err) {
    console.error('Failed to copy:', err)
    // Fallback if ClipboardItem is not supported
    await navigator.clipboard.writeText(store.bbcodeText)
    alert('Copied as plain text (formatting might not be preserved).')
  }
}

const applyFormat = (tag: string, value?: string) => {
  if (!editorRef.value) return

  const editor = editorRef.value
  const selection = editor.getSelection()
  if (!selection) return

  const text = editor.getModel()?.getValueInRange(selection) || ''
  const openTag = value ? `[${tag}=${value}]` : `[${tag}]`
  const closeTag = `[/${tag}]`
  
  const newText = `${openTag}${text}${closeTag}`

  editor.executeEdits('toolbar', [
    {
      range: selection,
      text: newText,
      forceMoveMarkers: true
    }
  ])
  
  // Refocus and show tooltip might need manual management if selection changes
  editor.focus()
}

const handleMouseMove = () => {
  // Can be used for extra tooltip logic if needed
}
</script>

<style scoped>
.pane-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  position: relative;
}
.pane-header {
  padding: 8px;
  background-color: #f3f4f6;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 16px;
}
.tabs {
  display: flex;
}
.tabs button {
  padding: 6px 12px;
  margin-right: 4px;
  cursor: pointer;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 13px;
}
.tabs button.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.actions {
  display: flex;
}
.copy-button {
  padding: 6px 12px;
  cursor: pointer;
  background: #10b981;
  color: white;
  border: 1px solid #059669;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
}
.copy-button:hover {
  background: #059669;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-left: 8px;
  border-left: 1px solid #d1d5db;
}
.toolbar button, .toolbar select {
  padding: 4px 8px;
  cursor: pointer;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 12px;
}
.toolbar input[type="color"] {
  width: 30px;
  height: 24px;
  padding: 0;
  border: 1px solid #d1d5db;
  cursor: pointer;
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
  background: white;
  height: 100%;
}

.floating-tooltip {
  position: absolute;
  z-index: 1000;
  background: #1f2937;
  color: white;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  gap: 4px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
.floating-tooltip button {
  background: transparent;
  color: white;
  border: none;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 12px;
  border-radius: 2px;
}
.floating-tooltip button:hover {
  background: rgba(255, 255, 255, 0.1);
}
</style>
