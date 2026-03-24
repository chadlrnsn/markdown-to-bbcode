# Markdown to Bitrix BBCode Converter

Web tool for converting Markdown documentation to BBCode format compatible with Bitrix24 editor.

[Русская версия](./README.md)

## Features

- **Markdown → BBCode conversion** - full documentation support:
  - Tables (`| cell | cell |`)
  - Headings (`#`, `##`, `###`)
  - Bold text (`**bold**`)
  - Underline (`__underline__`)
  - Lists (ordered/unordered)
  - Nested lists
  - Blockquotes (`>`)
  - Code blocks (`code`)
  - Spoilers (`<details><summary>...</details>`)

- **BBCode Preview** - instant result preview
- **Copy for Bitrix** - copies formatted HTML to clipboard for pasting into Bitrix24 editor

## Usage

### Install

```sh
npm install
```

### Run dev server

```sh
npm run dev
```

### Build

```sh
npm run build
```

### Run tests

```sh
npm test
```

### Linting

```sh
npm run lint
```

### Type check

```sh
npm run type-check
```

## Supported Markdown Elements

| Markdown                                             | BBCode                             |
| ---------------------------------------------------- | ---------------------------------- | --- | --------------------------------------- |
| `# Title`                                            | `[SIZE=24][B]Title[/B][/SIZE]`     |
| `**bold**`                                           | `[B]bold[/B]`                      |
| `__underline__`                                      | `[U]underline[/U]`                 |
| `- Item`                                             | `[*] Item`                         |
| `1. Item`                                            | `[*] Item` (ordered)               |
| `> Quote`                                            | `>> Quote`                         |
| `` `code` ``                                         | `` `code` ``                       |
| ` ```code``` `                                       | `[CODE]code[/CODE]`                |
| `<details><summary>Title</summary>Content</details>` | `[SPOILER=Title]Content[/SPOILER]` |
| `                                                    | cell                               | `   | `[TABLE][TR][TD]cell[/TD][/TR][/TABLE]` |

## License

MIT
