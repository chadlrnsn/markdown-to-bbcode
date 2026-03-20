# Header Links Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add creator profile link and GitHub repository link to the application header.

**Architecture:** Update `src/App.vue` header to use flexbox for layout. Add a right-side section with repository link (GitHub icon) and profile link (avatar).

**Tech Stack:** Vue 3, CSS.

---

### Task 1: Update Header Markup and Styles in App.vue

**Files:**
- Modify: `src/App.vue`

- [ ] **Step 1: Update header markup**
Add `.header-links` container and links.

```vue
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
```

- [ ] **Step 2: Update header styles**
Update `.app-header` and add link styles.

```css
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
```

- [ ] **Step 3: Verify changes**
Run `npm run build` to ensure no errors and visually check (if possible).

- [ ] **Step 4: Commit changes**
`git add src/App.vue && git commit -m "feat: add social and repo links to header"`
