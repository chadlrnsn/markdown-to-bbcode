import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkHtml from 'remark-html'

export function markdownToHtml(markdown: string): string {
  try {
    const file = unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkHtml)
      .processSync(markdown)
    return String(file)
  } catch (error) {
    console.error('Error parsing markdown to HTML:', error instanceof Error ? error.message : String(error))
    return ''
  }
}
