# SEO and Title Improvement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update `index.html` with relevant SEO metadata (title, description, keywords, OpenGraph tags, and lang attribute) targeting Bitrix24 users.

**Architecture:** Direct modification of `index.html`.

**Tech Stack:** HTML5, Vite.

---

### Task 1: Update Basic Metadata

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Set HTML language to Russian**

```html
<html lang="ru">
```

- [ ] **Step 2: Update the Title**

```html
<title>Markdown to Bitrix BBCode Converter — Инструмент для Битрикс24</title>
```

- [ ] **Step 3: Add Description and Keywords**

```html
<meta name="description" content="Удобный конвертер Markdown в BBCode для задач и комментариев в Bitrix24. Специально для разработчиков и аналитиков. Поддержка таблиц, кода и форматирования.">
<meta name="keywords" content="markdown to bbcode, bitrix24 bbcode, конвертер маркдаун в битрикс, форматирование задач битрикс, bbcode bitrix converter">
```

- [ ] **Step 4: Verify the changes visually in the file**

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "seo: update basic metadata and title"
```

---

### Task 2: Add OpenGraph Metadata

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add OpenGraph tags for social sharing**

```html
<meta property="og:title" content="Markdown to Bitrix BBCode Converter">
<meta property="og:description" content="Конвертируйте Markdown в BBCode для Bitrix24 в один клик. Идеально для разработчиков и аналитиков.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://your-domain.com/markdown-to-bbcode/">
```

- [ ] **Step 2: Verify the tags are placed inside the `<head>` section**

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "seo: add OpenGraph metadata"
```

---

### Task 3: Final Verification

**Files:**
- Read: `index.html`
- Shell: `npm run build`

- [ ] **Step 1: Verify the complete content of index.html**

- [ ] **Step 2: Run build to ensure no errors in the Vite pipeline**

Run: `npm run build`
Expected: "build finished" without errors.

- [ ] **Step 3: Confirm the final build contains the new title**

Check: `dist/index.html` (if built) or console output.
