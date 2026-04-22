function normalizeMarkdown(markdown) {
  return markdown.replace(/\r\n?/g, '\n')
}

function splitTableRow(line) {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim())
}

function isTableSeparator(line) {
  return /^\|?(?:\s*:?-{3,}:?\s*\|)+\s*:?-{3,}:?\s*\|?$/.test(line.trim())
}

function isListLine(line) {
  return /^\s*([-*+]|\d+\.)\s+/.test(line)
}

function isBlockBoundary(line) {
  return (
    !line.trim() ||
    /^#{1,6}\s+/.test(line) ||
    /^```/.test(line.trim()) ||
    /^\s*>\s?/.test(line) ||
    /^\s*([-*+]|\d+\.)\s+/.test(line) ||
    /^\s*([-*_]\s*){3,}$/.test(line.trim())
  )
}

export function parseMarkdown(source) {
  const markdown = normalizeMarkdown(source)
  const lines = markdown.split('\n')
  const blocks = []

  let index = 0

  while (index < lines.length) {
    const line = lines[index]
    const trimmed = line.trim()

    if (!trimmed) {
      index += 1
      continue
    }

    const headingMatch = /^(#{1,6})\s+(.+)$/.exec(trimmed)
    if (headingMatch) {
      blocks.push({
        type: 'heading',
        depth: headingMatch[1].length,
        content: headingMatch[2].trim(),
      })
      index += 1
      continue
    }

    if (/^```/.test(trimmed)) {
      const language = trimmed.slice(3).trim()
      const codeLines = []
      index += 1

      while (index < lines.length && !/^```/.test(lines[index].trim())) {
        codeLines.push(lines[index])
        index += 1
      }

      if (index < lines.length) {
        index += 1
      }

      blocks.push({
        type: 'code',
        language,
        content: codeLines.join('\n'),
      })
      continue
    }

    if (/^\s*>\s?/.test(line)) {
      const quoteLines = []

      while (index < lines.length && /^\s*>\s?/.test(lines[index])) {
        quoteLines.push(lines[index].replace(/^\s*>\s?/, ''))
        index += 1
      }

      blocks.push({
        type: 'blockquote',
        content: quoteLines.join('\n'),
      })
      continue
    }

    if (
      line.includes('|') &&
      index + 1 < lines.length &&
      isTableSeparator(lines[index + 1])
    ) {
      const headers = splitTableRow(line)
      const rows = []
      index += 2

      while (index < lines.length && lines[index].includes('|') && lines[index].trim()) {
        rows.push(splitTableRow(lines[index]))
        index += 1
      }

      blocks.push({
        type: 'table',
        headers,
        rows,
      })
      continue
    }

    if (/^\s*([-*_]\s*){3,}$/.test(trimmed)) {
      blocks.push({ type: 'hr' })
      index += 1
      continue
    }

    if (isListLine(line)) {
      const ordered = /^\s*\d+\.\s+/.test(line)
      const items = []

      while (index < lines.length && isListLine(lines[index])) {
        items.push(lines[index].replace(/^\s*([-*+]|\d+\.)\s+/, '').trim())
        index += 1
      }

      blocks.push({
        type: ordered ? 'ol' : 'ul',
        items,
      })
      continue
    }

    const paragraphLines = [trimmed]
    index += 1

    while (index < lines.length && !isBlockBoundary(lines[index])) {
      paragraphLines.push(lines[index].trim())
      index += 1
    }

    blocks.push({
      type: 'paragraph',
      content: paragraphLines.join(' '),
    })
  }

  return blocks
}
