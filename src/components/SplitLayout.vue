<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const splitPercent = ref(50)
const isResizing = ref(false)
const containerRef = ref<HTMLElement | null>(null)

const startResizing = (event: MouseEvent) => {
  isResizing.value = true
  event.preventDefault()
}

const stopResizing = () => {
  isResizing.value = false
}

const resize = (event: MouseEvent) => {
  if (!isResizing.value || !containerRef.value) return
  
  const containerRect = containerRef.value.getBoundingClientRect()
  const newWidth = event.clientX - containerRect.left
  const percent = (newWidth / containerRect.width) * 100
  
  if (percent > 10 && percent < 90) {
    splitPercent.value = percent
  }
}

onMounted(() => {
  window.addEventListener('mousemove', resize)
  window.addEventListener('mouseup', stopResizing)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', resize)
  window.removeEventListener('mouseup', stopResizing)
})
</script>

<template>
  <div ref="containerRef" class="split-layout" :class="{ 'is-resizing': isResizing }">
    <div class="split-pane left" :style="{ width: splitPercent + '%' }">
      <slot name="left" />
    </div>
    <div class="split-gutter" @mousedown="startResizing">
      <div class="gutter-line"></div>
    </div>
    <div class="split-pane right" :style="{ width: (100 - splitPercent) + '%' }">
      <slot name="right" />
    </div>
  </div>
</template>

<style scoped>
.split-layout {
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.split-pane {
  height: 100%;
  overflow: hidden;
  position: relative;
}

.split-gutter {
  width: 8px;
  cursor: col-resize;
  background-color: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  z-index: 10;
}

.split-gutter:hover, .is-resizing .split-gutter {
  background-color: #e5e7eb;
}

.gutter-line {
  width: 2px;
  height: 40px;
  background-color: #d1d5db;
  border-radius: 1px;
}

.is-resizing {
  cursor: col-resize;
}

.is-resizing .split-pane {
  pointer-events: none;
}
</style>
