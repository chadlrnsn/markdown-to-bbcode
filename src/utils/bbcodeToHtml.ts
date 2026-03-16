export function bbcodeToHtml(bbcode: string): string {
  if (!bbcode) return ''

  let html = bbcode

  // Escape HTML to prevent XSS and formatting issues
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Recursive replacement to handle nested tags like [B][B]text[/B][/B]
  // We use separate arrays for string replacements and function replacements for better type safety
  const stringPatterns: [RegExp, string][] = [
    [/\[B\](.*?)\[\/B\]/gsi, '<strong>$1</strong>'],
    [/\[I\](.*?)\[\/I\]/gsi, '<em>$1</em>'],
    [/\[S\](.*?)\[\/S\]/gsi, '<del>$1</del>'],
    [/\[U\](.*?)\[\/U\]/gsi, '<u>$1</u>'],
    [/\[URL=(.*?)\](.*?)\[\/URL\]/gsi, '<a href="$1" target="_blank">$2</a>'],
    [/\[IMG\](.*?)\[\/IMG\]/gsi, '<img src="$1" alt="image" style="max-width: 100%;" />'],
    [/\[QUOTE\](.*?)\[\/QUOTE\]/gsi, '<blockquote>$1</blockquote>'],
    [/\[CODE\](.*?)\[\/CODE\]/gsi, '<pre><code>$1</code></pre>'],
    [/\[COLOR=(.*?)\](.*?)\[\/COLOR\]/gsi, '<span style="color: $1;">$2</span>']
  ]

  const sizeRegex = /\[SIZE=(.*?)\](.*?)\[\/SIZE\]/gsi

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

    changed = html !== startHtml
  }

  // Bitrix style quotes: >> text
  html = html.replace(/(?:^|<br \/>)>>\s*(.*?)(?=<br \/>|$)/gi, (match: string, content: string) => {
    return `<blockquote>${content}</blockquote>`
  })
  html = html.replace(/<\/blockquote><br \/><blockquote>/gi, '<br />')

  // Tables
  html = html.replace(/\[TABLE\](.*?)\[\/TABLE\]/gsi, '<div class="b24-table-wrapper"><table class="b24-table">$1</table></div>')
  html = html.replace(/\[TR\](.*?)\[\/TR\]/gsi, '<tr>$1</tr>')
  html = html.replace(/\[TD\](.*?)\[\/TD\]/gsi, '<td>$1</td>')
  html = html.replace(/\[HR\]/gi, '<hr />')

  // Lists
  html = html.replace(/\[LIST(?:=(.*?))?\](.*?)\[\/LIST\]/gsi, (match: string, type: string | undefined, content: string) => {
    const listTag = type === '1' ? 'ol' : 'ul'
    const items = content.replace(/\[\*\](.*?)(?=\[\*\]|$)/gsi, '<li>$1</li>')
    return `<${listTag}>${items}</${listTag}>`
  })

  // Newlines to <br> but avoid double breaks around blocks
  html = html.replace(/(<table.*?>|<\/table>|<tr.*?>|<\/tr>|<td.*?>|<\/td>|<ul.*?>|<\/ul>|<ol.*?>|<\/ol>|<li>|<\/li>|<blockquote>|<\/blockquote>)\s*<br \/>/gi, '$1')
  html = html.replace(/\n/g, '<br />')

  return `<div class="ui-typography-container">${html}</div>`
}
