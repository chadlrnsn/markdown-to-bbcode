import { defineStore } from 'pinia'
import { ref, watch, computed } from 'vue'
import { markdownToBBCode } from '../utils/markdownToBBCode'
import { markdownToHtml } from '../utils/markdownToHtml'
import { bbcodeToHtml } from '../utils/bbcodeToHtml'

export const useEditorStore = defineStore('editor', () => {
  const markdownText = ref('')
  const bbcodeText = ref('')

  // Update BBCode automatically when Markdown changes
  watch(markdownText, (newValue) => {
    bbcodeText.value = markdownToBBCode(newValue)
  })

  const markdownPreviewHtml = computed(() => {
    return markdownToHtml(markdownText.value)
  })

  const bbcodePreviewHtml = computed(() => {
    return bbcodeToHtml(bbcodeText.value)
  })

  return {
    markdownText,
    bbcodeText,
    markdownPreviewHtml,
    bbcodePreviewHtml
  }
})
