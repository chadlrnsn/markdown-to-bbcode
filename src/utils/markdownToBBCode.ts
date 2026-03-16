import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import type { Root, Content } from 'mdast'

function renderNode(node: Content | Root): string {
  switch (node.type) {
    case 'root':
      return node.children.map(renderNode).join('')
    case 'paragraph':
      return node.children.map(renderNode).join('') + '\n\n'
    case 'text':
      return node.value
    case 'strong':
      return `[b]${node.children.map(renderNode).join('')}[/b]`
    case 'emphasis':
      return `[i]${node.children.map(renderNode).join('')}[/i]`
    case 'delete':
      return `[s]${node.children.map(renderNode).join('')}[/s]`
    case 'inlineCode':
      return `[code]${node.value}[/code]`
    case 'code':
      return `[code]\n${node.value}\n[/code]\n\n`
    case 'blockquote':
      return `[quote]\n${node.children.map(renderNode).join('').trim()}\n[/quote]\n\n`
    case 'list': {
      const items = node.children.map(renderNode).join('')
      return `[list]\n${items}[/list]\n\n`
    }
    case 'listItem':
      // listItem often contains a paragraph. Let's trim trailing newlines to avoid extra spacing
      return `[*] ${node.children.map(renderNode).join('').replace(/\n\n$/, '\n')}`
    case 'heading': {
      return `[b]${node.children.map(renderNode).join('')}[/b]\n\n`
    }
    case 'link':
      return `[url=${node.url}]${node.children.map(renderNode).join('')}[/url]`
    case 'image':
      return `[img]${node.url}[/img]`
    case 'thematicBreak':
      return `[hr]\n\n`
    case 'break':
      return `\n`
    case 'table':
      return `[table]\n${node.children.map(renderNode).join('')}[/table]\n\n`
    case 'tableRow':
      return `[tr]\n${node.children.map(renderNode).join('')}[/tr]\n`
    case 'tableCell':
      return `[td]${node.children.map(renderNode).join('')}[/td]`
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
