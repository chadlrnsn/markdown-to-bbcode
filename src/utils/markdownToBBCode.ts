import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import type { Root, Content } from 'mdast'

export interface ParserSettings {
  headings: boolean
  lists: boolean
  tables: boolean
  quotes: boolean
  formatting: boolean
  links: boolean
  images: boolean
  code: boolean
}

/**
 * Renders children of a node, preserving the original vertical spacing (newlines) 
 * by checking the position of each node in the source Markdown.
 */
function renderChildren(children: Content[], settings: ParserSettings): string {
  if (!children || children.length === 0) return ''
  
  let result = ''
  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    if (!child) continue
    
    result += renderNode(child, settings)
    
    // Add original gap between this child and the next one
    if (i < children.length - 1) {
      const next = children[i + 1]
      if (next && child.position && next.position) {
        const gap = next.position.start.line - child.position.end.line
        if (gap > 0) {
          result += '\n'.repeat(gap)
        }
      } else if (child) {
        // Fallback if position is missing
        if (['paragraph', 'heading', 'list', 'table', 'blockquote', 'code', 'thematicBreak'].includes(child.type)) {
          result += '\n'
        }
      }
    }
  }
  return result
}

function renderNode(node: Content | Root, settings: ParserSettings): string {
  switch (node.type) {
    case 'root':
      return renderChildren(node.children, settings)
      
    case 'paragraph':
      return renderChildren(node.children, settings)
      
    case 'text':
      return node.value
      
    case 'strong': {
      const content = renderChildren(node.children, settings)
      return settings.formatting ? `[B]${content}[/B]` : content
    }
    
    case 'emphasis': {
      const content = renderChildren(node.children, settings)
      return settings.formatting ? `[I]${content}[/I]` : content
    }
    
    case 'delete': {
      const content = renderChildren(node.children, settings)
      return settings.formatting ? `[S]${content}[/S]` : content
    }
    
    case 'inlineCode':
      return settings.code ? `[CODE]${node.value}[/CODE]` : node.value
      
    case 'code':
      return settings.code ? `[CODE]\n${node.value}\n[/CODE]` : node.value
      
    case 'blockquote': {
      const content = renderChildren(node.children, settings).trim()
      if (!settings.quotes) return content
      const quotedLines = content
        .split('\n')
        .map(line => `>> ${line}`)
        .join('\n')
      return quotedLines
    }
    
    case 'list': {
      const content = renderChildren(node.children, settings).trim()
      if (!settings.lists) return content
      const type = (node as any).ordered ? '=1' : ''
      return `[LIST${type}]${content}[/LIST]`
    }
    
    case 'listItem': {
      const content = renderChildren(node.children, settings).trim()
      return settings.lists ? `[*]${content}` : content
    }
    
    case 'heading': {
      const content = renderChildren(node.children, settings)
      if (!settings.headings) return content
      const sizes: Record<number, number> = {
        1: 24,
        2: 20,
        3: 18,
        4: 16,
        5: 14,
        6: 12
      }
      const size = sizes[node.depth] || 14
      return `[SIZE=${size}][B]${content}[/B][/SIZE]`
    }
    
    case 'link': {
      const content = renderChildren(node.children, settings)
      return settings.links ? `[URL=${node.url}]${content}[/URL]` : `${content} (${node.url})`
    }
    
    case 'image':
      return settings.images ? `[IMG]${node.url}[/IMG]` : `(Image: ${node.url})`
      
    case 'thematicBreak':
      return `[HR]`
      
    case 'break':
      return `\n`
      
    case 'table': {
      const tableContent = renderChildren(node.children, settings).trim()
      return settings.tables ? `[TABLE]${tableContent}[/TABLE]` : tableContent
    }
    
    case 'tableRow':
      return `[TR]${renderChildren(node.children, settings)}[/TR]`
      
    case 'tableCell':
      return `[TD]${renderChildren(node.children, settings)}[/TD]`
      
    default:
      if ('children' in node) {
        return renderChildren((node as any).children, settings)
      }
      return ''
  }
}

export function markdownToBBCode(markdown: string, settings: ParserSettings): string {
  try {
    const tree = unified().use(remarkParse).use(remarkGfm).parse(markdown)
    return renderNode(tree, settings).trim()
  } catch (error) {
    console.error('Error converting markdown to BBCode:', error)
    return ''
  }
}
