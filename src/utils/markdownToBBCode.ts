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
      // Bitrix renders a single newline as a break, so \n\n creates an empty line.
      // Usually, \n is sufficient for block separation in Bitrix tasks/comments.
      return content + '\n'
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
      return `[CODE]\n${node.value}\n[/CODE]\n`
    case 'blockquote': {
      const content = node.children.map(renderNode).join('').trim()
      // Bitrix style quotes: each line starts with >>
      const quotedLines = content
        .split('\n')
        .map(line => `>> ${line}`)
        .join('\n')
      return `${quotedLines}\n`
    }
    case 'list': {
      const type = (node as any).ordered ? '=1' : ''
      // Bitrix is extremely sensitive to newlines inside [LIST]. 
      // We join items without ANY spaces or newlines around tags.
      const items = node.children.map(renderNode).join('').trim()
      return `[LIST${type}]${items}[/LIST]\n`
    }
    case 'listItem':
      // Bitrix list items MUST start with [*]. We trim to ensure no extra spaces.
      // We also ensure no trailing newlines within the item itself to avoid double spacing in lists.
      return `[*]${node.children.map(renderNode).join('').trim()}`
    case 'heading': {
      const sizes: Record<number, number> = {
        1: 24,
        2: 20,
        3: 18,
        4: 16,
        5: 14,
        6: 12
      }
      const size = sizes[node.depth] || 14
      const content = node.children.map(renderNode).join('')
      return `[SIZE=${size}][B]${content}[/B][/SIZE]\n`
    }
    case 'link':
      return `[URL=${node.url}]${node.children.map(renderNode).join('')}[/URL]`
    case 'image':
      return `[IMG]${node.url}[/IMG]`
    case 'thematicBreak':
      return `[HR]\n`
    case 'break':
      return `\n`
    case 'table':
      // Bitrix tables MUST NOT have ANY newlines between tags.
      const tableContent = node.children.map(renderNode).join('').trim()
      return `[TABLE]${tableContent}[/TABLE]\n`
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
    return renderNode(tree).trim()
  } catch (error) {
    console.error('Error converting markdown to BBCode:', error)
    return ''
  }
}
