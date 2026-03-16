export function bbcodeToHtml(bbcode: string): string {
  if (!bbcode) return ''

  let html = bbcode

  // Escape HTML to prevent XSS and formatting issues
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // BBCode replacements (Case Insensitive)
  html = html
    .replace(/\[B\](.*?)\[\/B\]/gsi, '<strong>$1</strong>')
    .replace(/\[I\](.*?)\[\/I\]/gsi, '<em>$1</em>')
    .replace(/\[S\](.*?)\[\/S\]/gsi, '<del>$1</del>')
    .replace(/\[URL=(.*?)\](.*?)\[\/URL\]/gsi, '<a href="$1" target="_blank">$2</a>')
    .replace(/\[IMG\](.*?)\[\/IMG\]/gsi, '<img src="$1" alt="image" style="max-width: 100%;" />')
    .replace(/\[QUOTE\](.*?)\[\/QUOTE\]/gsi, '<blockquote>$1</blockquote>')
    .replace(/\[CODE\](.*?)\[\/CODE\]/gsi, '<pre><code>$1</code></pre>')
    .replace(/\[HR\]/gi, '<hr />')
    
  // Tables - Bitrix style in preview
  html = html.replace(/\[TABLE\](.*?)\[\/TABLE\]/gsi, '<div class="b24-table-wrapper"><table class="b24-table">$1</table></div>')
  html = html.replace(/\[TR\](.*?)\[\/TR\]/gsi, '<tr>$1</tr>')
  html = html.replace(/\[TD\](.*?)\[\/TD\]/gsi, '<td>$1</td>')

  // Lists - support both [LIST] and [LIST=1]
  html = html.replace(/\[LIST(?:=(.*?))?\](.*?)\[\/LIST\]/gsi, (match, type, content) => {
    const listTag = type === '1' ? 'ol' : 'ul'
    // Process items recursively or at least replace [*] with <li>
    const items = content.replace(/\[\*\](.*?)(?=\[\*\]|$)/gsi, '<li>$1</li>')
    return `<${listTag}>${items}</${listTag}>`
  })

  // Newlines to <br> but avoid double breaks if tags already handle it
  // This is tricky with tables. Let's remove newlines inside table/list tags first if they exist.
  html = html.replace(/(<table.*?>|<\/table>|<tr.*?>|<\/tr>|<td.*?>|<\/td>|<ul.*?>|<\/ul>|<ol.*?>|<\/ol>|<li>|<\/li>)\s*<br \/>/gi, '$1')
  
  html = html.replace(/\n/g, '<br />')

  return `<div class="ui-typography-container">${html}</div>`
}
