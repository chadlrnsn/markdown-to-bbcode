import { defineStore } from 'pinia';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';

export const useAppStore = defineStore('app', {
  state: () => ({
    currentVersion: '',
    lastViewedVersion: localStorage.getItem('md_to_bbcode_last_version') || '',
    changelogHtml: '',
    isModalOpen: false,
    isLoaded: false
  }),
  actions: {
    async fetchChangelog() {
      try {
        const response = await fetch('/CHANGELOG.md');
        if (!response.ok) throw new Error('Changelog not found');
        
        const markdown = await response.text();
        
        // Extract version from first H1 (e.g., "# 1.0.1")
        const versionMatch = markdown.match(/^#\s+(.*)/);
        this.currentVersion = versionMatch ? versionMatch[1].trim() : '0.0.0';

        // Convert MD to HTML using existing unified pipeline
        const processed = await unified()
          .use(remarkParse)
          .use(remarkHtml)
          .process(markdown);
        this.changelogHtml = String(processed);
        this.isLoaded = true;

        this.checkVersion();
      } catch (e) {
        console.error('Failed to fetch changelog:', e);
      }
    },
    checkVersion() {
      // Show modal if versions differ
      if (this.currentVersion && this.currentVersion !== this.lastViewedVersion) {
        this.isModalOpen = true;
      }
    },
    closeModal() {
      this.isModalOpen = false;
      // Mark current version as viewed
      this.lastViewedVersion = this.currentVersion;
      localStorage.setItem('md_to_bbcode_last_version', this.currentVersion);
    },
    openModal() {
      this.isModalOpen = true;
    }
  }
});
