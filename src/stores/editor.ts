import { defineStore } from 'pinia'
import { ref, watch, computed, reactive } from 'vue'
import { markdownToBBCode } from '../utils/markdownToBBCode'
import { markdownToHtml } from '../utils/markdownToHtml'
import { bbcodeToHtml } from '../utils/bbcodeToHtml'

export const useEditorStore = defineStore('editor', () => {
  const markdownText = ref('')
  const bbcodeText = ref('')

  const settings = reactive({
    headings: true,
    lists: true,
    tables: true,
    quotes: true,
    formatting: true, // bold, italic, strike, underline
    links: true,
    images: true,
    code: true
  })

  // Update BBCode automatically when Markdown or Settings change
  watch([markdownText, settings], () => {
    bbcodeText.value = markdownToBBCode(markdownText.value, settings)
  }, { deep: true })

  const markdownPreviewHtml = computed(() => {
    return markdownToHtml(markdownText.value)
  })

  const bbcodePreviewHtml = computed(() => {
    return bbcodeToHtml(bbcodeText.value)
  })

  return {
    markdownText,
    bbcodeText,
    settings,
    markdownPreviewHtml,
    bbcodePreviewHtml
  }
})
