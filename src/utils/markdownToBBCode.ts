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

interface RenderContext {
  inBold: boolean
  inItalic: boolean
  inStrike: boolean
  inUnderline: boolean
}

/**
 * Renders children of a node, preserving the original vertical spacing (newlines) 
 * by checking the position of each node in the source Markdown.
 */
function renderChildren(children: Content[], settings: ParserSettings, context: RenderContext, raw: string): string {
  if (!children || children.length === 0) return ''
  
  let result = ''
  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    if (!child) continue
    
    result += renderNode(child, settings, context, raw)
    
    if (i < children.length - 1) {
      const next = children[i + 1]
      if (next && child.position && next.position) {
        const gap = next.position.start.line - child.position.end.line
        if (gap > 0) {
          result += '\n'.repeat(gap)
        }
      } else if (child) {
        if (['paragraph', 'heading', 'list', 'table', 'blockquote', 'code', 'thematicBreak'].includes(child.type)) {
          result += '\n'
        }
      }
    }
  }
  return result
}

function renderNode(
  node: Content | Root, 
  settings: ParserSettings, 
  context: RenderContext = { inBold: false, inItalic: false, inStrike: false, inUnderline: false },
  raw: string = ''
): string {
  switch (node.type) {
    case 'root':
      return renderChildren(node.children, settings, context, raw)
      
    case 'paragraph':
      return renderChildren(node.children, settings, context, raw)
      
    case 'text':
      return node.value
      
    case 'html': {
      const value = node.value.toLowerCase()
      if (value.startsWith('<u') && settings.formatting && !context.inUnderline) {
        return `[U]`
      }
      if (value.startsWith('</u>')) return `[/U]`
      return node.value
    }

    case 'strong': {
      if (!settings.formatting) return renderChildren(node.children, settings, context, raw)
      
      // Determine if this is __underline__ or **bold** by checking source text
      const isUnderline = node.position && raw.slice(node.position.start.offset, (node.position.start.offset || 0) + 2) === '__'
      
      if (isUnderline) {
        if (context.inUnderline) return renderChildren(node.children, settings, context, raw)
        return `[U]${renderChildren(node.children, settings, { ...context, inUnderline: true }, raw)}[/U]`
      } else {
        if (context.inBold) return renderChildren(node.children, settings, context, raw)
        return `[B]${renderChildren(node.children, settings, { ...context, inBold: true }, raw)}[/B]`
      }
    }
    
    case 'emphasis': {
      if (!settings.formatting) return renderChildren(node.children, settings, context, raw)
      if (context.inItalic) return renderChildren(node.children, settings, context, raw)
      
      return `[I]${renderChildren(node.children, settings, { ...context, inItalic: true }, raw)}[/I]`
    }
    
    case 'delete': {
      if (!settings.formatting) return renderChildren(node.children, settings, context, raw)
      if (context.inStrike) return renderChildren(node.children, settings, context, raw)
      
      return `[S]${renderChildren(node.children, settings, { ...context, inStrike: true }, raw)}[/S]`
    }
    
    case 'inlineCode':
      return settings.code ? `[CODE]${node.value}[/CODE]` : node.value
      
    case 'code':
      return settings.code ? `[CODE]\n${node.value}\n[/CODE]` : node.value
      
    case 'blockquote': {
      const content = renderChildren(node.children, settings, context, raw).trim()
      if (!settings.quotes) return content
      const quotedLines = content
        .split('\n')
        .map(line => `>> ${line}`)
        .join('\n')
      return quotedLines
    }
    
    case 'list': {
      const content = renderChildren(node.children, settings, context, raw).trim()
      if (!settings.lists) return content
      const type = (node as { ordered?: boolean | null }).ordered ? '=1' : ''
      return `[LIST${type}]${content}[/LIST]`
    }
    
    case 'listItem': {
      const content = renderChildren(node.children, settings, context, raw).trim()
      return settings.lists ? `[*]${content}` : content
    }
    
    case 'heading': {
      const content = renderChildren(node.children, settings, { ...context, inBold: true }, raw)
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
      const boldContent = context.inBold ? content : `[B]${content}[/B]`
      return `[SIZE=${size}]${boldContent}[/SIZE]`
    }
    
    case 'link': {
      const content = renderChildren(node.children, settings, context, raw)
      return settings.links ? `[URL=${node.url}]${content}[/URL]` : `${content} (${node.url})`
    }
    
    case 'image':
      return settings.images ? `[IMG]${node.url}[/IMG]` : `(Image: ${node.url})`
      
    case 'thematicBreak':
      return `[HR]`
      
    case 'break':
      return `\n`
      
    case 'table': {
      const tableContent = renderChildren(node.children, settings, context, raw).trim()
      return settings.tables ? `[TABLE]${tableContent}[/TABLE]` : tableContent
    }
    
    case 'tableRow':
      return `[TR]${renderChildren(node.children, settings, context, raw)}[/TR]`
      
    case 'tableCell':
      return `[TD]${renderChildren(node.children, settings, context, raw)}[/TD]`
      
    default:
      if ('children' in node && Array.isArray((node as { children?: Content[] }).children)) {
        return renderChildren((node as { children: Content[] }).children, settings, context, raw)
      }
      return ''
  }
}

export function markdownToBBCode(markdown: string, settings: ParserSettings): string {
  try {
    const tree = unified().use(remarkParse).use(remarkGfm).parse(markdown)
    return renderNode(tree, settings, { inBold: false, inItalic: false, inStrike: false, inUnderline: false }, markdown).trim()
  } catch (error) {
    console.error('Error converting markdown to BBCode:', error instanceof Error ? error.message : String(error))
    return ''
  }
}
