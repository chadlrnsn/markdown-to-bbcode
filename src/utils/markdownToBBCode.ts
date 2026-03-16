import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import type { Root, Content } from 'mdast'

function renderNode(node: Content | Root): string {
  switch (node.type) {
    case 'root':
      return node.children.map(renderNode).join('')
    case 'paragraph': {
      const content = node.children.map(renderNode).join('')
      if (!content.trim()) return ''
      return content + '\n\n'
    }
    case 'text':
      return node.value
    case 'strong':
      return `[B]${node.children.map(renderNode).join('')}[/B]`
    case 'emphasis':
      return `[I]${node.children.map(renderNode).join('')}[/I]`
    case 'delete':
      return `[S]${node.children.map(renderNode).join('')}[/S]`
    case 'inlineCode':
      return `[CODE]${node.value}[/CODE]`
    case 'code':
      return `[CODE]\n${node.value}\n[/CODE]\n\n`
    case 'blockquote':
      return `[QUOTE]\n${node.children.map(renderNode).join('').trim()}\n[/QUOTE]\n\n`
    case 'list': {
      const type = (node as any).ordered ? '=1' : ''
      // Bitrix is extremely sensitive to newlines inside [LIST]. 
      // We must NOT have newlines between [*] items or around the LIST tags.
      const items = node.children.map(renderNode).join('').trim()
      return `[LIST${type}]${items}[/LIST]\n\n`
    }
    case 'listItem':
      // Bitrix list items MUST start with [*]. We trim to ensure no extra spaces.
      return `[*]${node.children.map(renderNode).join('').trim()}`
    case 'heading': {
      return `[B]${node.children.map(renderNode).join('')}[/B]\n\n`
    }
    case 'link':
      return `[URL=${node.url}]${node.children.map(renderNode).join('')}[/URL]`
    case 'image':
      return `[IMG]${node.url}[/IMG]`
    case 'thematicBreak':
      return `[HR]\n\n`
    case 'break':
      return `\n`
    case 'table':
      // Bitrix tables MUST NOT have ANY newlines between [TABLE], [TR], and [TD] tags.
      const tableContent = node.children.map(renderNode).join('').trim()
      return `[TABLE]${tableContent}[/TABLE]\n\n`
    case 'tableRow':
      return `[TR]${node.children.map(renderNode).join('')}[/TR]`
    case 'tableCell':
      return `[TD]${node.children.map(renderNode).join('')}[/TD]`
    default:
      if ('children' in node) {
        return (node.children as Content[]).map(renderNode).join('')
      }
      return ''
  }
}

export function markdownToBBCode(markdown: string): string {
  try {
    const tree = unified().use(remarkParse).use(remarkGfm).parse(markdown)
    let result = renderNode(tree).trim()
    
    // Final safety: Remove any double newlines that might have been generated 
    // inside containers if they weren't caught by the switches.
    return result
  } catch (error) {
    console.error('Error converting markdown to BBCode:', error)
    return ''
  }
}
