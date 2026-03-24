export function bbcodeToHtml(bbcode: string): string {
  if (!bbcode) return ''

  let html = bbcode

  // Escape HTML to prevent XSS and formatting issues
  html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  // Recursive replacement to handle nested tags like [B][B]text[/B][/B]
  // We use separate arrays for string replacements and function replacements for better type safety
  const stringPatterns: [RegExp, string][] = [
    [/\[B\](.*?)\[\/B\]/gis, '<strong>$1</strong>'],
    [/\[I\](.*?)\[\/I\]/gis, '<em>$1</em>'],
    [/\[S\](.*?)\[\/S\]/gis, '<del>$1</del>'],
    [/\[U\](.*?)\[\/U\]/gis, '<u>$1</u>'],
    [/\[URL=(.*?)\](.*?)\[\/URL\]/gis, '<a href="$1" target="_blank">$2</a>'],
    [/\[IMG\](.*?)\[\/IMG\]/gis, '<img src="$1" alt="image" style="max-width: 100%;" />'],
    [/\[CODE\](.*?)\[\/CODE\]/gis, '<pre><code>$1</code></pre>'],
    [/\[COLOR=(.*?)\](.*?)\[\/COLOR\]/gis, '<span style="color: $1;">$2</span>'],
  ]

  const sizeRegex = /\[SIZE=(.*?)\](.*?)\[\/SIZE\]/gis
  const quoteRegex = /\[QUOTE\](.*?)\[\/QUOTE\]/gis
  const spoilerWithTitleRegex = /\[SPOILER=(.*?)\](.*?)\[\/SPOILER\]/gis
  const spoilerWithoutTitleRegex = /\[SPOILER\](.*?)\[\/SPOILER\]/gis

  let changed = true
  while (changed) {
    const startHtml = html
    for (const [regex, replacement] of stringPatterns) {
      html = html.replace(regex, replacement)
    }

    // Handle SIZE separately because of the function logic
    html = html.replace(sizeRegex, (match: string, size: string, text: string) => {
      const fontSize = isNaN(Number(size)) ? size : `${size}px`
      return `<span style="font-size: ${fontSize};">${text}</span>`
    })

    // Handle QUOTE
    html = html.replace(quoteRegex, (match: string, content: string) => {
      return `<blockquote>${content.trim()}</blockquote>`
    })

    // Handle SPOILER with title
    html = html.replace(spoilerWithTitleRegex, (match: string, title: string, content: string) => {
      const trimmedContent = content.trim()
      const wrappedContent = trimmedContent.startsWith('<p')
        ? trimmedContent
        : `<p class="ui-typography-paragraph ui-text-editor__paragraph ui-text-editor__ltr" dir="ltr"><span data-lexical-text="true">${trimmedContent}</span></p>`
      return `<details class="ui-typography-spoiler" open=""><summary tabindex="-1" class="ui-typography-spoiler-title ui-icon-set__scope ui-text-editor__ltr" dir="ltr"><span data-lexical-text="true">${title.trim()}</span></summary><div class="ui-typography-spoiler-content">${wrappedContent}</div></details>`
    })

    // Handle SPOILER without title
    html = html.replace(spoilerWithoutTitleRegex, (match: string, content: string) => {
      const trimmedContent = content.trim()
      const wrappedContent = trimmedContent.startsWith('<p')
        ? trimmedContent
        : `<p class="ui-typography-paragraph ui-text-editor__paragraph ui-text-editor__ltr" dir="ltr"><span data-lexical-text="true">${trimmedContent}</span></p>`
      return `<details class="ui-typography-spoiler" open=""><summary tabindex="-1" class="ui-typography-spoiler-title ui-icon-set__scope ui-text-editor__ltr" dir="ltr"><span data-lexical-text="true">Спойлер</span></summary><div class="ui-typography-spoiler-content">${wrappedContent}</div></details>`
    })

    changed = html !== startHtml
  }

  // Bitrix style quotes: >> text
  html = html.replace(
    /(?:^|<br \/>)>>\s*(.*?)(?=<br \/>|$)/gi,
    (match: string, content: string) => {
      return `<blockquote>${content.trim()}</blockquote>`
    },
  )
  html = html.replace(/<\/blockquote><br \/><blockquote>/gi, '<br />')

  // Tables
  html = html.replace(
    /\[TABLE\](.*?)\[\/TABLE\]/gis,
    (match: string, content: string) =>
      `<div class="b24-table-wrapper"><table class="b24-table">${content.trim()}</table></div>`,
  )
  html = html.replace(
    /\[TR\](.*?)\[\/TR\]/gis,
    (match: string, content: string) => `<tr>${content.trim()}</tr>`,
  )
  html = html.replace(
    /\[TD\](.*?)\[\/TD\]/gis,
    (match: string, content: string) => `<td>${content.trim()}</td>`,
  )
  html = html.replace(/\[HR\]/gi, '<hr />')

  // Lists - process nested lists by handling innermost first
  // We'll loop until no more nested [LIST] blocks are found
  let listIterations = 0
  const maxListIterations = 10 // Prevent infinite loops
  while (html.includes('[LIST') && listIterations < maxListIterations) {
    const startHtml = html

    // Replace innermost lists first (those without nested [LIST])
    html = html.replace(
      /\[LIST(?:=(.*?))?\]((?:(?!\[LIST).)*?)\[\/LIST\]/gis,
      (match: string, type: string | undefined, content: string) => {
        const listTag = type === '1' ? 'ol' : 'ul'
        const items = content
          .trim()
          .replace(/\[\*\](.*?)(?=\[\*\]|$)/gis, (m: string, c: string) => `<li>${c.trim()}</li>`)
        return `<${listTag}>${items}</${listTag}>`
      },
    )

    if (html === startHtml) break
    listIterations++
  }

  // Newlines to <br>
  html = html.replace(/\n/g, '<br />')

  // Clean up <br> that appear exactly between two block elements
  // This removes structural newlines (e.g., between </tr> and <tr>)
  // without destroying intended empty lines around headings and text
  const blockTags =
    'table|/table|tr|/tr|td|/td|ul|/ul|ol|/ol|li|/li|blockquote|/blockquote|details|/details|summary|/summary|div|/div|hr'
  const betweenBlocksRegex = new RegExp(
    `(<(?:${blockTags})[^>]*>)\\s*(?:<br \\/>\\s*)+(<(?:${blockTags})[^>]*>)`,
    'gi',
  )

  let prevHtml = ''
  while (html !== prevHtml) {
    prevHtml = html
    html = html.replace(betweenBlocksRegex, '$1$2')
  }

  return `<div class="ui-typography-container">${html}</div>`
}
