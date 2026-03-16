export function bbcodeToHtml(bbcode: string): string {
  if (!bbcode) return ''

  let html = bbcode

  // Escape HTML to prevent XSS and formatting issues
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // BBCode replacements
  html = html
    .replace(/\[b\](.*?)\[\/b\]/gs, '<strong>$1</strong>')
    .replace(/\[i\](.*?)\[\/i\]/gs, '<em>$1</em>')
    .replace(/\[s\](.*?)\[\/s\]/gs, '<del>$1</del>')
    .replace(/\[url=(.*?)\](.*?)\[\/url\]/gs, '<a href="$1" target="_blank">$2</a>')
    .replace(/\[img\](.*?)\[\/img\]/gs, '<img src="$1" alt="image" style="max-width: 100%;" />')
    .replace(/\[quote\](.*?)\[\/quote\]/gs, '<blockquote>$1</blockquote>')
    .replace(/\[code\](.*?)\[\/code\]/gs, '<pre><code>$1</code></pre>')
    .replace(/\[hr\]/g, '<hr />')
    
  // Tables
  html = html.replace(/\[table\](.*?)\[\/table\]/gs, '<table border="1" style="border-collapse: collapse; width: 100%;">$1</table>')
  html = html.replace(/\[tr\](.*?)\[\/tr\]/gs, '<tr>$1</tr>')
  html = html.replace(/\[td\](.*?)\[\/td\]/gs, '<td style="padding: 8px; border: 1px solid #ddd;">$1</td>')

  // Lists
  html = html.replace(/\[list\](.*?)\[\/list\]/gs, (match, p1) => {
    const items = p1.replace(/\[\*\](.*?)(?=\[\*\]|$)/gs, '<li>$1</li>')
    return `<ul>${items}</ul>`
  })

  // Newlines to <br> for everything outside of <pre> or block elements if possible,
  // Но так как у нас есть таблицы и списки, нужно быть аккуратнее.
  // Для простоты заменим переноси вне тегов, которые сами создают блоки.
  html = html.replace(/\n/g, '<br />')

  return `<div class="bbcode-preview">${html}</div>`
}
