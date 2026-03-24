# Markdown to Bitrix BBCode Converter

Веб-инструмент для конвертации Markdown документации в BBCode формат, совместимый с редактором Битрикс24.

[English version](./README_EN.md)

## Возможности

- **Конвертация Markdown → BBCode** - полная поддержка элементов документации:
  - Таблицы (`| cell | cell |`)
  - Заголовки (`#`, `##`, `###`)
  - Жирный текст (`**bold**`)
  - Подчёркивание (`__underline__`)
  - Списки (ordered/unordered)
  - Вложенные списки
  - Блокquote (`>`)
  - Кодовые блоки (`code`)
  - Спойлеры (`<details><summary>...</details>`)

- **Предпросмотр BBCode** - мгновенный предпросмотр результата
- **Копирование для Битрикс** - копирует форматированный HTML в буфер обмена для вставки в редактор Битрикс24

## Использование

### Установка

```sh
npm install
```

### Запуск dev сервера

```sh
npm run dev
```

### Сборка

```sh
npm run build
```

### Запуск тестов

```sh
npm test
```

### Линтинг

```sh
npm run lint
```

### Проверка типов

```sh
npm run type-check
```

## Поддерживаемые элементы Markdown

| Markdown                                             | BBCode                                  |
| ---------------------------------------------------- | --------------------------------------- |
| `# Title`                                            | `[SIZE=24][B]Title[/B][/SIZE]`          |
| `**bold**`                                           | `[B]bold[/B]`                           |
| `__underline__`                                      | `[U]underline[/U]`                      |
| `- Item`                                             | `[*] Item`                              |
| `1. Item`                                            | `[*] Item` (ordered)                    |
| `> Quote`                                            | `>> Quote`                              |
| `` `code` ``                                         | `` `code` ``                            |
| ` ```code``` `                                       | `[CODE]code[/CODE]`                     |
| `<details><summary>Title</summary>Content</details>` | `[SPOILER=Title]Content[/SPOILER]`      |
| `\| cell \|`                                         | `[TABLE][TR][TD]cell[/TD][/TR][/TABLE]` |

## Лицензия

MIT
