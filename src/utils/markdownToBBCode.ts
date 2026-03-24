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
  spoilers: boolean
}

interface RenderContext {
  inBold: boolean
  inItalic: boolean
  inStrike: boolean
  inUnderline: boolean
  inSpoiler: boolean
}

/**
 * Renders children of a node, preserving the original vertical spacing (newlines)
 * by checking the position of each node in the source Markdown.
 */
function renderChildren(
  children: Content[],
  settings: ParserSettings,
  context: RenderContext,
  raw: string,
): string {
  if (!children || children.length === 0) return ''

  let result = ''
  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    if (!child) continue

    // Special handling for <details> followed by <summary>
    if (settings.spoilers && child.type === 'html') {
      const value = child.value.trim()
      const lowerValue = value.toLowerCase()
      if (lowerValue.startsWith('<details')) {
        // Check if entire details element is in one node (contains both <details> and </details>)
        if (lowerValue.includes('</details>')) {
          const summaryMatch = value.match(/<summary>([\s\S]*?)<\/summary>/i)
          const title = summaryMatch?.[1]?.trim() || ''
          const content = value
            .replace(/<summary>[\s\S]*?<\/summary>/i, '')
            .replace(/<\/?details>/gi, '')
            .trim()
          result += `[SPOILER${title ? `=${title}` : ''}]${content}[/SPOILER]`
        } else {
          let summaryTitle = ''
          // Check if current node has summary inside
          const summaryMatch = value.match(/<summary>([\s\S]*?)<\/summary>/i)
          if (summaryMatch && summaryMatch[1]) {
            summaryTitle = summaryMatch[1].trim()
            result += `[SPOILER=${summaryTitle}]`
          } else {
            // Look ahead for summary in next node
            let foundSummary = false
            if (i + 1 < children.length) {
              const next = children[i + 1]
              if (
                next &&
                next.type === 'html' &&
                next.value.trim().toLowerCase().startsWith('<summary')
              ) {
                const nextSummaryMatch = next.value.match(/<summary>([\s\S]*?)<\/summary>/i)
                if (nextSummaryMatch && nextSummaryMatch[1]) {
                  summaryTitle = nextSummaryMatch[1].trim()
                  result += `[SPOILER=${summaryTitle}]`
                  i++ // Skip the summary node
                  foundSummary = true
                }
              }
            }
            if (!foundSummary) {
              result += '[SPOILER]'
            }
          }

          if (i < children.length - 1) {
            result += '\n'
          }
        }
        continue
      }
    }

    result += renderNode(child, settings, context, raw)

    if (i < children.length - 1) {
      const next = children[i + 1]
      if (next && child.position && next.position) {
        const gap = next.position.start.line - child.position.end.line
        if (gap > 0) {
          result += '\n'.repeat(gap)
        }
      } else if (child) {
        if (
          ['paragraph', 'heading', 'list', 'table', 'blockquote', 'code', 'thematicBreak'].includes(
            child.type,
          )
        ) {
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
  context: RenderContext = {
    inBold: false,
    inItalic: false,
    inStrike: false,
    inUnderline: false,
    inSpoiler: false,
  },
  raw: string = '',
): string {
  switch (node.type) {
    case 'root':
      return renderChildren(node.children, settings, context, raw)

    case 'paragraph':
      return renderChildren(node.children, settings, context, raw)

    case 'text':
      return node.value

    case 'html': {
      const value = node.value.trim()
      const lowerValue = value.toLowerCase()

      if (settings.spoilers) {
        // Handle inline details<summary>...</details> in one HTML node
        if (lowerValue.startsWith('<details') && lowerValue.includes('</details>')) {
          const summaryMatch = value.match(/<summary>([\s\S]*?)<\/summary>/i)
          const title = summaryMatch?.[1]?.trim() || ''
          const content = value
            .replace(/<summary>[\s\S]*?<\/summary>/i, '')
            .replace(/<\/?details>/gi, '')
            .trim()
          return `[SPOILER${title ? `=${title}` : ''}]${content}[/SPOILER]`
        }

        if (lowerValue.startsWith('<details')) {
          // If we are here, it means it wasn't handled in renderChildren
          const summaryMatch = value.match(/<summary>([\s\S]*?)<\/summary>/i)
          const title = (summaryMatch?.[1] || '').trim()
          return `[SPOILER${title ? `=${title}` : ''}]\n`
        }
        if (lowerValue.startsWith('</details>')) {
          return '\n[/SPOILER]\n'
        }
        if (lowerValue.startsWith('<summary')) {
          const summaryMatch = value.match(/<summary>([\s\S]*?)<\/summary>/i)
          if (summaryMatch?.[1]) {
            return `[SPOILER=${summaryMatch[1].trim()}]\n`
          }
          return ''
        }
      }

      if (lowerValue.startsWith('<u') && settings.formatting && !context.inUnderline) {
        const contentMatch = value.match(/<u>([\s\S]*?)<\/u>/i)
        if (contentMatch) {
          return `[U]${contentMatch[1]}[/U]`
        }
        return `[U]`
      }
      if (lowerValue.startsWith('</u>')) return `[/U]`
      return node.value
    }

    case 'strong': {
      if (!settings.formatting) return renderChildren(node.children, settings, context, raw)

      // Determine if this is __underline__ or **bold** by checking source text
      const isUnderline =
        node.position &&
        raw.slice(node.position.start.offset, (node.position.start.offset || 0) + 2) === '__'

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
      return `\`${node.value}\``

    case 'code':
      return settings.code ? `[CODE]${node.value}[/CODE]` : node.value

    case 'blockquote': {
      const content = renderChildren(node.children, settings, context, raw).trim()
      if (!settings.quotes) return content
      const quotedLines = content
        .split('\n')
        .map((line) => `>> ${line}`)
        .join('\n')
      return quotedLines
    }

    case 'list': {
      const content = renderChildren(node.children, settings, context, raw).trim()
      if (!settings.lists) return content

      const type = (node as { ordered?: boolean | null }).ordered ? '=1' : ''
      return `\n[LIST${type}]\n${content}\n[/LIST]\n`
    }

    case 'listItem': {
      const content = renderChildren(node.children, settings, context, raw).trim()
      return settings.lists ? `[*] ${content}` : content
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
        6: 12,
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
    // Pre-process: detect fenced code blocks without language (```code```)
    // These are parsed as inlineCode but should be code blocks
    const processedMarkdown = markdown.replace(/^```(.+?)```$/gm, (match, code) => {
      // Only add newlines if code doesn't already contain them
      if (!code.includes('\n')) {
        return '```\n' + code + '\n```'
      }
      return match
    })

    const tree = unified().use(remarkParse).use(remarkGfm).parse(processedMarkdown)
    return renderNode(
      tree,
      settings,
      {
        inBold: false,
        inItalic: false,
        inStrike: false,
        inUnderline: false,
        inSpoiler: false,
      },
      processedMarkdown,
    ).trim()
  } catch (error) {
    console.error(
      'Error converting markdown to BBCode:',
      error instanceof Error ? error.message : String(error),
    )
    return ''
  }
}
