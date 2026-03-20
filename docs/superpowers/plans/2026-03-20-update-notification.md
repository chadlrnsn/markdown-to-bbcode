# Update Notification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a changelog modal that opens automatically on new version or via a header button.

**Architecture:** Use Pinia for state management. Fetch `CHANGELOG.md` from `/public`. Render Markdown using existing `unified`/`remark` setup.

**Tech Stack:** Vue 3, Pinia, unified/remark-parse/remark-html.

---

### Task 1: Initialize CHANGELOG.md and App Store

**Files:**
- Create: `public/CHANGELOG.md`
- Create: `src/stores/app.ts`

- [ ] **Step 1: Create public/CHANGELOG.md**
```markdown
# 1.0.1
- Added GitHub repository and creator links to the header.
- Added update notification system with changelog modal.
- Improved header layout with flexbox.
```

- [ ] **Step 2: Create src/stores/app.ts**
```typescript
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
        const markdown = await response.text();
        
        // Extract version from first H1
        const versionMatch = markdown.match(/^#\s+(.*)/);
        this.currentVersion = versionMatch ? versionMatch[1].trim() : '0.0.0';

        // Convert MD to HTML
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
      if (this.currentVersion !== this.lastViewedVersion) {
        this.isModalOpen = true;
      }
    },
    closeModal() {
      this.isModalOpen = false;
      this.lastViewedVersion = this.currentVersion;
      localStorage.setItem('md_to_bbcode_last_version', this.currentVersion);
    },
    openModal() {
      this.isModalOpen = true;
    }
  }
});
```

### Task 2: Implement UpdatesModal.vue

**Files:**
- Create: `src/components/UpdatesModal.vue`

- [ ] **Step 1: Create UpdatesModal component**
Implement modal with backdrop, content area, and close button. Use `.ui-typography-container` for styling the changelog HTML.

### Task 3: Integrate with App.vue

**Files:**
- Modify: `src/App.vue`

- [ ] **Step 1: Update header in App.vue**
Add the "Update" button (bell icon) to the header links.

- [ ] **Step 2: Add UpdatesModal and initialization**
Import and use `UpdatesModal`. Initialize `appStore` in `onMounted`.

### Task 4: Finalize and Commit

- [ ] **Step 1: Build check**
`npm run build-only`

- [ ] **Step 2: Commit changes**
`git add . && git commit -m "feat: add update notification system"`
