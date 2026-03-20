# Spec: Update Notification System

Add an update notification system that displays a changelog in a modal when a new version is detected.

## Requirements

- **Changelog Source:** Fetch from `/CHANGELOG.md` (publicly accessible).
- **Version Detection:** Extract the version from the first H1 header in `CHANGELOG.md` (e.g., `# 1.0.1`).
- **Persistence:** Store the last viewed version in `localStorage` (`md_to_bbcode_last_version`).
- **Auto-Show:** Open the modal automatically if the current version in the changelog is different from the stored version.
- **Manual Trigger:** Add a "What's New" button (icon) in the header to open the modal manually.
- **Content Rendering:** Use existing `unified`/`remark` dependencies to convert Markdown to HTML.

## Architecture & Components

### `public/CHANGELOG.md`
- Initial file with version `1.0.1` and change details.

### `src/stores/app.ts` (New Pinia Store)
- `state`: `currentVersion`, `lastViewedVersion`, `changelogHtml`, `isModalOpen`.
- `actions`: 
    - `fetchChangelog()`: Loads the file, extracts version, and converts to HTML.
    - `checkVersion()`: Compares versions and opens modal if they differ.
    - `openModal()` / `closeModal()`: Controls visibility.

### `src/components/UpdatesModal.vue` (New Component)
- A modal dialog using CSS transitions.
- Displays the `changelogHtml` in a scrollable area.
- "Close" button that also updates `lastViewedVersion` in `localStorage`.

### `src/App.vue`
- Update header to include the "Update" button.
- Include `UpdatesModal` component.
- Initialize `appStore` on mount.

## Style Guide
- Modal: Dark/Light themed (matching app), centered, semi-transparent backdrop.
- Update Button: Bell or Info icon in the header links section.
- Content: Use the existing `.ui-typography-container` styles for consistent Markdown rendering.
