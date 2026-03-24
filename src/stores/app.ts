import { defineStore } from 'pinia'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkHtml from 'remark-html'

export const useAppStore = defineStore('app', {
  state: () => ({
    currentVersion: '',
    lastViewedVersion: localStorage.getItem('md_to_bbcode_last_version') || '',
    changelogHtml: '',
    isModalOpen: false,
    isLoaded: false,
  }),
  actions: {
    async fetchChangelog() {
      try {
        const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '')
        const changelogUrl = `${baseUrl}/CHANGELOG.md`

        console.log(`Fetching changelog from ${changelogUrl}...`)
        const response = await fetch(changelogUrl)
        console.log('Response status:', response.status)

        if (!response.ok)
          throw new Error(`Changelog not found: ${response.status} ${response.statusText}`)

        const markdown = await response.text()
        console.log('Changelog content length:', markdown.length)

        // Extract version from first H1 (e.g., "# 1.0.1")
        const versionMatch = markdown.match(/^#\s+(.*)/)
        this.currentVersion = versionMatch?.[1]?.split('\n')[0]?.trim() ?? '0.0.0'
        console.log('Detected version:', this.currentVersion)

        // Convert MD to HTML using existing unified pipeline
        const processed = await unified().use(remarkParse).use(remarkHtml).process(markdown)
        this.changelogHtml = String(processed)
        this.isLoaded = true

        this.checkVersion()
      } catch (e) {
        console.error('Failed to fetch changelog:', e)
      }
    },
    checkVersion() {
      // Show modal if versions differ
      if (this.currentVersion && this.currentVersion !== this.lastViewedVersion) {
        this.isModalOpen = true
      }
    },
    closeModal() {
      this.isModalOpen = false
      // Mark current version as viewed
      this.lastViewedVersion = this.currentVersion
      localStorage.setItem('md_to_bbcode_last_version', this.currentVersion)
    },
    openModal() {
      this.isModalOpen = true
    },
  },
})
