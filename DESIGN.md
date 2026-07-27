---
version: alpha
name: Material Markdown to Bitrix BBCode
description: A Google Material Design 3 (M3) styled design system for converting Markdown into Bitrix24 compatible BBCode and HTML previews.
colors:
  primary: "#0B57D0"
  primary-hover: "#0842A0"
  secondary: "#444746"
  tertiary: "#1A73E8"
  success: "#137333"
  success-hover: "#0F5223"
  neutral: "#F8F9FA"
  surface: "#FFFFFF"
  surface-variant: "#E1E3E1"
  text-dark: "#1F1F1F"
typography:
  h1:
    fontFamily: "'Google Sans', Roboto, system-ui, -apple-system, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 500
    lineHeight: "1.2"
  h2:
    fontFamily: "'Google Sans', Roboto, system-ui, -apple-system, sans-serif"
    fontSize: "1.1rem"
    fontWeight: 500
    lineHeight: "1.3"
  body-md:
    fontFamily: "Roboto, system-ui, -apple-system, sans-serif"
    fontSize: "0.875rem"
    lineHeight: "1.5"
  body-sm:
    fontFamily: "Roboto, system-ui, -apple-system, sans-serif"
    fontSize: "0.75rem"
    lineHeight: "1.4"
  code:
    fontFamily: "'Roboto Mono', monospace"
    fontSize: "0.875rem"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "28px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
components:
  top-app-bar:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    padding: "12px 24px"
  label-muted:
    textColor: "{colors.secondary}"
  link-accent:
    textColor: "{colors.tertiary}"
  tab-button:
    backgroundColor: "{colors.surface-variant}"
    textColor: "{colors.text-dark}"
    rounded: "{rounded.full}"
    padding: "6px 16px"
  tab-button-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.full}"
    padding: "6px 16px"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.full}"
    padding: "8px 24px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.surface}"
  button-success:
    backgroundColor: "{colors.success}"
    textColor: "{colors.surface}"
    rounded: "{rounded.full}"
    padding: "6px 16px"
  button-success-hover:
    backgroundColor: "{colors.success-hover}"
    textColor: "{colors.surface}"
  surface-background:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.text-dark}"
    padding: "12px 24px"
  modal-dialog:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-dark}"
    rounded: "{rounded.xl}"
    padding: "24px"
---

## Overview

Material Markdown to Bitrix BBCode aligns the converter tool with Google's Material Design 3 (M3) language. The core identity focuses on clarity, expressive typography, pill-shaped interactive elements, and tonal surfaces.

A Google Blue (`#0B57D0`) top bar anchors the interface. Interactive buttons leverage fully rounded pill geometry (`rounded.full`), crisp Roboto/Google Sans typography, and tonal surface backgrounds (`#F8F9FA` & `#E1E3E1`) for seamless navigation across editor and preview modes.

## Colors

- **Primary ({colors.primary}):** M3 Google Blue used for primary actions, active tabs, and top application bar.
- **Primary Hover ({colors.primary-hover}):** Deep blue shade (`#0842A0`) for active hover states.
- **Secondary ({colors.secondary}):** M3 neutral gray for section titles, muted labels, and disabled states.
- **Tertiary ({colors.tertiary}):** Accent blue (`#1A73E8`) for interactive text links and secondary focus highlights.
- **Success ({colors.success}):** M3 Google Green (`#137333`) dedicated to clipboard copy actions.
- **Success Hover ({colors.success-hover}):** Dark green (`#0F5223`) for hovered copy triggers.
- **Neutral ({colors.neutral}):** Very soft off-white background fill (`#F8F9FA`) for main app background and control panels.
- **Surface ({colors.surface}):** Pure white (`#FFFFFF`) for editor cards, modal dialogs, and button labels.
- **Surface Variant ({colors.surface-variant}):** Soft gray container background (`#E1E3E1`) for unselected chip/tab surfaces.
- **Text Dark ({colors.text-dark}):** Deep charcoal text (`#1F1F1F`) for high contrast readability.

## Typography

Utilizes Google's type scale family (`Google Sans`, `Roboto`, and `Roboto Mono`).

- **H1 ({typography.h1.fontSize}, Medium 500):** Application title rendered in Google Sans / system font fallbacks.
- **H2 ({typography.h2.fontSize}, Medium 500):** Section headings and dialog titles.
- **Body Medium ({typography.body-md.fontSize}):** Primary editor and UI typography using standard 14px Roboto body text.
- **Body Small ({typography.body-sm.fontSize}):** Uppercase section headers and mode selector labels.
- **Code ({typography.code.fontSize}):** Fixed-width Roboto Mono buffer for code blocks and Monaco editor text.

## Layout

Architected around an M3 Top App Bar and responsive side-by-side pane split layout.

- **Grid System:** Equal double-pane workspace separated by a subtle draggable splitter handle.
- **Spacing Scale:**
  - `xs` (4px): Micro inline padding.
  - `sm` (8px): Gap between filter chips and toolbar icons.
  - `md` (12px): Standard header padding.
  - `lg` (16px): Content margin and panel gaps.
  - `xl` (24px): Page-level padding and modal margins.

## Elevation & Depth

- **Level 0 (Flat):** Editor panes and preview containers use flat surfaces with crisp M3 surface borders (`#E1E3E1`).
- **Level 1 (Tonal):** Control toolbar and filter chip containers use soft tonal fills (`#F8F9FA`).
- **Level 3 (Modal Dialogs):** Dialog windows float with M3 ambient drop shadows (`0 10px 25px -5px rgba(0,0,0,0.1)`) and semi-transparent backdrop overlay.

## Shapes

Following Material Design 3 shape scale guidance:

- **Small Radius (`sm` / 8px):** Code blocks, tooltip callouts, and input checkboxes.
- **Medium Radius (`md` / 12px):** Card containers and settings dropdown menus.
- **Large Radius (`lg` / 16px):** Pane preview containers.
- **Extra-Large Radius (`xl` / 28px):** M3 Modal dialog windows.
- **Pill Radius (`full` / 9999px):** All interactive buttons, mode tabs, and filter chip buttons.

## Components

- **Top App Bar (`top-app-bar`):** Primary Google Blue navigation header containing app branding and top action icons.
- **Label Muted (`label-muted`):** Muted uppercase section and field headers.
- **Link Accent (`link-accent`):** Interactive URL links and repository indicators.
- **Tab Buttons (`tab-button`, `tab-button-active`):** M3 Segmented chips for switching source vs preview panes.
- **Primary Action Buttons (`button-primary`, `button-primary-hover`):** Fully rounded M3 filled buttons in Google Blue.
- **Success Copy Button (`button-success`, `button-success-hover`):** Pill-shaped action button for copying Bitrix-compatible BBCode to clipboard.
- **Surface Background (`surface-background`):** M3 neutral container strip for editor mode selection and feature checkboxes.
- **Modal Dialog (`modal-dialog`):** Rounded M3 dialog (`28px` corner radius) presenting version release notes.

## Do's and Don'ts

- **Do** use pill shapes (`rounded.full`) for interactive buttons and tab chips per M3 design specifications.
- **Do** reference token values (`{colors.primary}`) in component properties to enforce design system consistency.
- **Do** ensure text against filled primary and success buttons maintains WCAG AA contrast (>= 4.5:1).
- **Don't** use sharp rectangular corners on buttons or modals; follow M3 shape token radii (`8px`, `12px`, `28px`, `full`).
- **Don't** introduce non-standard shadows or gradients outside M3 elevation levels.
