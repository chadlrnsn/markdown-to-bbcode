import { describe, it, expect } from 'vitest'
import { markdownToBBCode } from '../src/utils/markdownToBBCode'
import { bbcodeToHtml } from '../src/utils/bbcodeToHtml'

const defaultSettings = {
  headings: true,
  lists: true,
  tables: true,
  quotes: true,
  formatting: true,
  links: true,
  images: true,
  code: true,
  spoilers: true,
}

const testMarkdown = `| Терминал | Версия | Дата релиза | Минимальная версия конифигуратора |
| ---------|--------|-------------|-----------------------------------|
| ADM500E  | 0x07.06 | 24.03.2026 | 3.4.8 |
| ADM500SA | 0x07.06 | 24.03.2026 | 3.4.8 |

### Основные изменения

- **Добавлена** альтернативная навигация (__Google locator__ и __Yandex locator__)
- **Добавлены** новые команды конфигураций
- **Добавлены** протоколы __HTTP__ и __HTTPS__
- **Удалена** поддержка старого конфигуратора __RCv1__
- **Добавлена синхронизация времени** (__NavTimeSync__) Устройство теперь может использовать GNSS как приоритетный источник точного времени. Это критически важно для корректной работы черного ящика при отсутствии сотовой связи.
- **Управление роумингом**: Появилась возможность настройки списков разрешенных и запрещенных сотовых операторов

<details>

<summary>Команды управления роумингом</summary>

- \`OPSWHITELIST<sim_index> <X>,<Y>\` — управление белыми списками (до 7 записей).
  - \`sim_index\`: 0 или 1.
  - **X**: Позиция в списке (0-6) или код оператора (если один аргумент).
  - **Y**: Код оператора MCC+MNC (например, 25001). Очистка списка — код 0.

- \`OPSBLACKLIST<sim_index> <X>,<Y>\` — управление черными списками (до 2 записей).
  - **X**: Позиция в списке (0-1) или код оператора.
  - **Y**: Код оператора.

</details>

<details>

<summary>Команда NAVTIMESYNC</summary>

\`\`\`text
NAVTIMESYNC <X>,<Y>
\`\`\`

- **X** — Режим синхронизации времени:
  - 0 — По GNSS (приоритет).
  - 1 — По NTP.
  - 2 — Выключено.
- **Y** — Максимальная допустимая разница во времени в секундах (по умолчанию 1800).

> Требуется перезагрузка для вступления настроек в силу.

</details>


### Улучшения и исправления

- **Оптимизация GNSS**: Повышена общая стабильность работы навигационного модуля, исправлены случаи зависаний.
- **Датчики**: Улучшена точность измерения температуры, исключены ложные значения.
- **Экономия трафика**: Настроена оптимизированная работа с данными Wi-Fi сетей для снижения затрат на передачу данных.
- **Команда REMOTE** заменена на REMOTECFG

### Альтернативная навигация

> Яндекс.Локатор \\ Google Geolocation — альтернативный источник, использует Wi-Fi/Bluetooth-точки (от терминала или ADM40) для определения позиции, особенно в городах, под крышами, при слабом GNSS или при радиоэлектронной борьбе(РЭБ).
> ADM40 — BLE-устройство, которое собирает "сырые" Wi-Fi/Bluetooth-данные и передаёт их терминалу — повышает точность запросов к локатору.

<details>

<summary>Включение и настройка навигации</summary>

\`\`\`text
NAVALTLOC <X>,<Y>,<Z>,<J>,<K>
\`\`\`

- **X**
  - 1 — включить Яндекс.Локатор
  - 2 — включить Google Geolocation
- **Y** — период сканирования Wi-Fi в секундах (10–60)
- **Z** — период сканирования Bluetooth в секундах (0–60)
- **J** — период отправки данных в сервис в секундах (10–300)
- **K** — период отправки данных в Google в секундах (10–300)

</details>

#### Подмена GNSS — NAVREPLACE

<details>

<summary>Включение и настройка подмены GNSS</summary>

\`\`\`text
NAVREPLACE <X>,<Y>,<Z>
\`\`\`

- **X** — Режим работы (0 — выключено, см. таблицу ниже).
- **Y** — множитель зоны валидности (зона доверия = точность ALT × Y).
  - Диапазон: \`1–65535\` (по умолчанию \`3\`)
- **Z** — период охлаждения в секундах при переходе с GNSS на ALT.
  - В течение этого времени координаты помечаются невалидными для предотвращения прыжков трека.

> Определяет, когда и как использовать ALT-координаты.

**Важно**:

- ALT-точки теперь учитываются в алгоритме трека — ставятся только если отличаются от предыдущей и валидны.
- При детектировании выброса в ALT — координаты сбрасываются.
- При выходе из статики — обновляется время получения зафиксированных ALT, чтобы избежать лишних запросов.

</details>

| X | Режим | Поведение |
|---|---|---|
| 0 | Только GNSS | ALT игнорируется |
| 2 | GNSS-приоритет | ALT — только если GNSS невалиден |
| 3 | Легкий ALT-приоритет | ALT — если есть, иначе GNSS |
| 4 | Полный ALT-приоритет | ALT — всегда, если нет — нет координат |
| 5 | SOFT-валидация с заменой | ALT — только если GNSS вне зоны валидности (точность × Y), иначе GNSS |
| 6 | HARD-валидация с заменой | ALT — только если GNSS вне зоны валидности, иначе — невалидно (даже если ALT есть) |
| 7 | SOFT-валидация без замены | GNSS — только в зоне валидности, иначе — невалидно (если ALT нет — GNSS валиден) |
| 8 | HARD-валидация без замены | GNSS — только в зоне валидности, иначе — невалидно (даже если ALT нет) |


#### Фильтрация и стабильность

<details>

<summary>Включение и настройка корректировки выбросов</summary>

\`NAVFALLOUT <X>,<Y>\`

- X - количество следующих точек для отбрасывания
- Y - радиус подмены в метрах (0 — выключено)

</details>

- Если точка резко отскочила дальше Y метров от предыдущей — фиксируется выброс.
- Следующие X точек отбрасываются.
- Запоминается "плохая" точка — если следующая совпадает с ней (с точностью float) — тоже отбрасывается.
- Работает для GNSS и ALT.
- Статика — если устройство долго стояло, последние ALT-координаты закрепляются как валидные — не сбрасываются при старте движения.
- При выходе из статики — время получения ALT обновляется, чтобы не делать лишних запросов.
- **При выбросе в ALT — текущие ALT-координаты сбрасываются.**

<details>

<summary>Рекомендованные команды</summary>

\`\`\`NAVALTLOC 1,120,10,200,ТОКЕН\`\`\`

\`\`\`NAVREPLACE 5,1,60\`\`\`

> SOFT-валидация + 60 сек охлаждения → стабильный трек без "вылетов".

**Рекомендация для города:**

\`\`\`NAVALTLOC 1,20,10,200,ТОКЕН\`\`\`

\`\`\`NAVREPLACE 5,1,10\`\`\`

> SOFT-валидация + 10 сек охлаждения.

</details>`

describe('markdownToBBCode', () => {
  it('should convert table correctly', () => {
    const markdown = `| Header1 | Header2 |
| ---------|---------|
| Cell1    | Cell2    |`
    const result = markdownToBBCode(markdown, defaultSettings)
    expect(result).toContain('[TABLE]')
    expect(result).toContain('[TR]')
    expect(result).toContain('[TD]')
  })

  it('should convert bold text with ** correctly', () => {
    const markdown = 'This is **bold** text'
    const result = markdownToBBCode(markdown, defaultSettings)
    expect(result).toContain('[B]bold[/B]')
  })

  it('should convert underline text with __ correctly', () => {
    const markdown = 'This is __underline__ text'
    const result = markdownToBBCode(markdown, defaultSettings)
    expect(result).toContain('[U]underline[/U]')
  })

  it('should convert headings correctly', () => {
    const markdown = '### Заголовок'
    const result = markdownToBBCode(markdown, defaultSettings)
    expect(result).toContain('[SIZE=')
    expect(result).toContain('[B]')
  })

  it('should convert unordered lists correctly', () => {
    const markdown = `- Item 1
- Item 2`
    const result = markdownToBBCode(markdown, defaultSettings)
    expect(result).toContain('[LIST]')
    expect(result).toContain('[*]')
  })

  it('should convert nested lists correctly', () => {
    const markdown = `- **X**
  - 1 — включить Яндекс.Локатор
  - 2 — включить Google Geolocation
- **Y** — период сканирования`
    const result = markdownToBBCode(markdown, defaultSettings)
    expect(result).toContain('[LIST]')
    expect(result).toContain('[*] [B]X[/B]')
    expect(result).toContain('[*] 1 —')
    expect(result).not.toContain('[*] [*]')
  })

  it('should convert ordered lists correctly', () => {
    const markdown = `1. First\n2. Second\n3. Third`
    const result = markdownToBBCode(markdown, defaultSettings)
    expect(result).toContain('[LIST=1]')
    expect(result).toContain('[*] First')
  })

  it('should convert deeply nested lists correctly', () => {
    const markdown = `- Level 1
  - Level 2
    - Level 3
      - Level 4`
    const result = markdownToBBCode(markdown, defaultSettings)
    expect(result).toContain('[LIST]')
    expect(result).toContain('[*] Level 1')
    expect(result).toContain('[*] Level 4')
  })

  it('should convert blockquotes correctly', () => {
    const markdown = `> Quote text`
    const result = markdownToBBCode(markdown, defaultSettings)
    expect(result).toContain('>>')
  })

  it('should convert code blocks correctly', () => {
    const markdown = '```text\ncode here\n```'
    const result = markdownToBBCode(markdown, defaultSettings)
    expect(result).toContain('[CODE]')
  })

  it('should convert triple backticks code blocks', () => {
    const markdown = '```\ncode here\nmore code\n```'
    const result = markdownToBBCode(markdown, defaultSettings)
    expect(result).toContain('[CODE]')
    expect(result).toContain('code here')
    expect(result).toContain('more code')
  })

  it('should convert code blocks with language', () => {
    const markdown = '```text\nNAVALTLOC 1,20,10,200,ТОКЕН\n```'
    const result = markdownToBBCode(markdown, defaultSettings)
    expect(result).toContain('[CODE]NAVALTLOC 1,20,10,200,ТОКЕН[/CODE]')
  })

  it('should convert code blocks without language specifier', () => {
    const markdown = '```\nNAVALTLOC 1,20,10,200,ТОКЕН\nNAVREPLACE 5,1,10\n```'
    const result = markdownToBBCode(markdown, defaultSettings)
    expect(result).toContain('[CODE]')
    expect(result).toContain('NAVALTLOC 1,20,10,200,ТОКЕН')
    expect(result).toContain('NAVREPLACE 5,1,10')
  })

  it('should convert code blocks on single line without language', () => {
    const markdown = '```NAVALTLOC 1,20,10,200,ТОКЕН```\n\n```NAVREPLACE 5,1,10```'
    const result = markdownToBBCode(markdown, defaultSettings)
    expect(result).toContain('[CODE]NAVALTLOC 1,20,10,200,ТОКЕН[/CODE]')
    expect(result).toContain('[CODE]NAVREPLACE 5,1,10[/CODE]')
  })

  it('should convert inline code correctly', () => {
    const markdown = 'This is `inline code` text'
    const result = markdownToBBCode(markdown, defaultSettings)
    expect(result).toContain('`inline code`')
  })

  it('should handle single backticks as plain text', () => {
    const markdown = 'Use `command` to do something'
    const result = markdownToBBCode(markdown, defaultSettings)
    expect(result).toContain('`command`')
    expect(result).not.toContain('[CODE]')
  })

  it('should convert details/summary to spoilers correctly', () => {
    const markdown = `<details>
<summary>Title</summary>
Content here
</details>`
    const result = markdownToBBCode(markdown, defaultSettings)
    expect(result).toContain('[SPOILER=Title]')
    expect(result).toContain('[/SPOILER]')
  })

  it('should convert inline details/summary to spoilers correctly', () => {
    const markdown = `<details><summary>Title</summary>Content here</details>`
    const result = markdownToBBCode(markdown, defaultSettings)
    expect(result).toContain('[SPOILER=Title]')
    expect(result).toContain('[/SPOILER]')
  })

  it('should convert full test markdown document correctly', () => {
    const result = markdownToBBCode(testMarkdown, defaultSettings)

    // Check table conversion
    expect(result).toContain('[TABLE]')
    expect(result).toContain('[TD]Терминал[/TD]')
    expect(result).toContain('[TD]ADM500E[/TD]')

    // Check headings
    expect(result).toContain('[SIZE=')
    expect(result).toContain('Основные изменения')

    // Check bold (__)
    expect(result).toContain('[U]Google locator[/U]')
    expect(result).toContain('[U]Yandex locator[/U]')
    expect(result).toContain('[U]NavTimeSync[/U]')
    expect(result).toContain('[U]HTTP[/U]')
    expect(result).toContain('[U]HTTPS[/U]')
    expect(result).toContain('[U]RCv1[/U]')

    // Check bold (**)
    expect(result).toContain('[B]Добавлена[/B]')
    expect(result).toContain('[B]Удалена[/B]')
    expect(result).toContain('[B]X[/B]')
    expect(result).toContain('[B]Y[/B]')

    // Check spoilers
    expect(result).toContain('[SPOILER=Команды управления роумингом]')
    expect(result).toContain('[SPOILER=Команда NAVTIMESYNC]')
    expect(result).toContain('[SPOILER=Включение и настройка навигации]')
    expect(result).toContain('[SPOILER=Включение и настройка подмены GNSS]')
    expect(result).toContain('[SPOILER=Включение и настройка корректировки выбросов]')
    expect(result).toContain('[SPOILER=Рекомендованные команды]')

    // Check lists
    expect(result).toContain('[LIST]')
    expect(result).toContain('[*]')

    // Check blockquotes
    expect(result).toContain('>>')

    // Check code
    expect(result).toContain('[CODE]')

    // Check inline code
    expect(result).toContain('`OPSWHITELIST')
    expect(result).toContain('`sim_index`')
    expect(result).toContain('`1–65535`')
  })
})

describe('bbcodeToHtml', () => {
  it('should convert BBCode bold to HTML', () => {
    const bbcode = '[B]bold text[/B]'
    const result = bbcodeToHtml(bbcode)
    expect(result).toContain('<strong>bold text</strong>')
  })

  it('should convert BBCode underline to HTML', () => {
    const bbcode = '[U]underline text[/U]'
    const result = bbcodeToHtml(bbcode)
    expect(result).toContain('<u>underline text</u>')
  })

  it('should convert BBCode italic to HTML', () => {
    const bbcode = '[I]italic text[/I]'
    const result = bbcodeToHtml(bbcode)
    expect(result).toContain('<em>italic text</em>')
  })

  it('should convert BBCode strikethrough to HTML', () => {
    const bbcode = '[S]strikethrough[/S]'
    const result = bbcodeToHtml(bbcode)
    expect(result).toContain('<del>strikethrough</del>')
  })

  it('should convert BBCode spoiler with title to HTML', () => {
    const bbcode = '[SPOILER=Title]Content[/SPOILER]'
    const result = bbcodeToHtml(bbcode)
    expect(result).toContain('<details')
    expect(result).toContain('Title')
    expect(result).toContain('<summary')
  })

  it('should convert BBCode table to HTML', () => {
    const bbcode = '[TABLE][TR][TD]Cell[/TD][/TR][/TABLE]'
    const result = bbcodeToHtml(bbcode)
    expect(result).toContain('<table')
    expect(result).toContain('<td>Cell</td>')
  })

  it('should convert BBCode list to HTML', () => {
    const bbcode = '[LIST][*]Item 1[*]Item 2[/LIST]'
    const result = bbcodeToHtml(bbcode)
    expect(result).toContain('<ul>')
    expect(result).toContain('<li>')
  })

  it('should convert BBCode code block to HTML', () => {
    const bbcode = '[CODE]code here[/CODE]'
    const result = bbcodeToHtml(bbcode)
    expect(result).toContain('<pre>')
    expect(result).toContain('<code>')
  })

  it('should convert BBCode link to HTML', () => {
    const bbcode = '[URL=https://example.com]Link[/URL]'
    const result = bbcodeToHtml(bbcode)
    expect(result).toContain('<a href="https://example.com"')
  })
})

describe('full pipeline: markdown -> BBCode -> HTML', () => {
  it('should produce renderable HTML from the full test document', () => {
    const bbcode = markdownToBBCode(testMarkdown, defaultSettings)
    const html = bbcodeToHtml(bbcode)

    // HTML should be valid and contain key elements
    expect(html).toContain('class="ui-typography-container"')
    expect(html).toContain('<table')
    expect(html).toContain('<td>')
    expect(html).toContain('<details')
    expect(html).toContain('<strong>')
    expect(html).toContain('<u>')
    expect(html).toContain('<ul>')
    expect(html).toContain('<li>')
    expect(html).toContain('<pre>')
  })

  it('should round-trip bold and underline correctly', () => {
    const markdown = '**bold** and __underline__'
    const bbcode = markdownToBBCode(markdown, defaultSettings)
    const html = bbcodeToHtml(bbcode)

    expect(html).toContain('<strong>bold</strong>')
    expect(html).toContain('<u>underline</u>')
  })

  it('should round-trip spoiler correctly', () => {
    const markdown = `<details>
<summary>Test Title</summary>
Test Content
</details>`
    const bbcode = markdownToBBCode(markdown, defaultSettings)
    const html = bbcodeToHtml(bbcode)

    expect(html).toContain('Test Title')
    expect(html).toContain('<details')
    expect(html).toContain('<summary')
  })

  it('should round-trip table correctly', () => {
    const markdown = `| A | B |
|---|---|
| 1 | 2 |`
    const bbcode = markdownToBBCode(markdown, defaultSettings)
    const html = bbcodeToHtml(bbcode)

    expect(html).toContain('<table')
    expect(html).toContain('<td>A</td>')
    expect(html).toContain('<td>B</td>')
    expect(html).toContain('<td>1</td>')
    expect(html).toContain('<td>2</td>')
  })
})

describe('linefeed and spacing', () => {
  it('should not have excessive newlines between elements', () => {
    const markdown = `# Heading

Some text here

- Item 1
- Item 2

Another paragraph.`
    const result = markdownToBBCode(markdown, defaultSettings)

    // Should not have more than 2 consecutive newlines
    expect(result).not.toMatch(/\n{4,}/)
  })

  it('should handle line breaks in paragraphs correctly', () => {
    const markdown = `Line 1
Line 2
Line 3`
    const result = markdownToBBCode(markdown, defaultSettings)

    // Should preserve the text without excessive newlines
    expect(result).toContain('Line 1')
    expect(result).toContain('Line 2')
    expect(result).toContain('Line 3')
  })

  it('should handle code blocks without extra linefeeds', () => {
    const markdown = `Some text before

\`\`\`
code here
\`\`\`

Some text after`
    const result = markdownToBBCode(markdown, defaultSettings)

    // Should not have excessive newlines around code blocks
    expect(result).not.toMatch(/\n{4,}/)
  })
})
