# Spec: SEO and Title Improvement for Markdown to Bitrix BBCode

## 1. Overview
The goal is to improve the SEO visibility and user experience by updating the `index.html` with relevant metadata targeted at developers and analysts using Bitrix24.

## 2. Target Audience
- Developers and analysts working with Bitrix24.
- Users looking for a quick Markdown to BBCode converter.

## 3. Changes

### 3.1. General Metadata
- Update `<html lang="">` to `<html lang="ru">`.
- Change `<title>` from `Vite App` to `Markdown to Bitrix BBCode Converter — Инструмент для Битрикс24`.
- Add `<meta name="description" content="Удобный конвертер Markdown в BBCode для задач и комментариев в Bitrix24. Специально для разработчиков и аналитиков. Поддержка таблиц, кода и форматирования.">`.
- Add `<meta name="keywords" content="markdown to bbcode, bitrix24 bbcode, конвертер маркдаун в битрикс, форматирование задач битрикс, bbcode bitrix converter">`.

### 3.2. OpenGraph (Social/Messenger Sharing)
- `<meta property="og:title" content="Markdown to Bitrix BBCode Converter">`
- `<meta property="og:description" content="Конвертируйте Markdown в BBCode для Bitrix24 в один клик. Идеально для разработчиков и аналитиков.">`
- `<meta property="og:type" content="website">`
- `<meta property="og:url" content="https://your-domain.com/markdown-to-bbcode/">` (Note: Needs to be updated if domain changes).

### 3.3. Performance & Accessibility
- Ensure `<meta charset="UTF-8">` and `<meta name="viewport">` are retained.

## 4. Verification Plan
- Verify that `index.html` contains the new tags.
- Run a build to ensure no regressions in the Vite pipeline.
- Check the rendered page in a browser to confirm the title change.
