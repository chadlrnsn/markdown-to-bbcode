# Spec: Header Improvements (Social Links & Repository)

Add creator profile link and repository link to the application header.

## Requirements

- Add a link to the GitHub repository: `https://github.com/chadlrnsn/markdown-to-bbcode`.
- Add a link to the creator's GitHub profile: `https://github.com/chadlrnsn`.
- The profile link must include an avatar image: `https://github.com/chadlrnsn.png`.
- The header layout should be responsive (flexbox) with title on the left and links on the right.
- Links should be styled to match the dark theme of the header.

## Architecture & Components

### `src/App.vue`
- Update `<header>` styles to use `display: flex`.
- Add a new container for links.
- Add GitHub icon (SVG) for the repository link.
- Add avatar image for the profile link.

## Style Guide
- Header background: `#1f2937`.
- Avatar: Rounded circle, small size (e.g., 24px).
- Repository link: GitHub icon with hover effect.
- Gap between links: `16px`.
