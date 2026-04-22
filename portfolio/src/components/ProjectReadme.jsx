import { Fragment, useEffect, useMemo, useState } from 'react'
import { parseMarkdown } from '../utils/markdown'

function resolveAssetUrl(target, basePath) {
  if (!target) return target

  if (
    target.startsWith('http://') ||
    target.startsWith('https://') ||
    target.startsWith('mailto:') ||
    target.startsWith('#') ||
    target.startsWith('/')
  ) {
    return target
  }

  const baseDirectory = basePath.slice(0, basePath.lastIndexOf('/') + 1)

  try {
    return new URL(target, `${window.location.origin}${baseDirectory}`).toString()
  } catch {
    return target
  }
}

function renderInline(text, basePath, keyPrefix = 'inline') {
  const pattern =
    /!\[([^\]]*)\]\(([^)]+)\)|\[([^\]]+)\]\(([^)]+)\)|`([^`]+)`|\*\*([^*]+)\*\*|__([^_]+)__|\*([^*]+)\*|_([^_]+)_/g
  const nodes = []
  let lastIndex = 0
  let match

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }

    if (match[1] !== undefined) {
      nodes.push(
        <MarkdownImage
          key={`${keyPrefix}-${match.index}`}
          src={resolveAssetUrl(match[2], basePath)}
          alt={match[1]}
        />,
      )
    } else if (match[3] !== undefined) {
      const href = resolveAssetUrl(match[4], basePath)
      const external = /^https?:\/\//.test(href)

      nodes.push(
        <a
          key={`${keyPrefix}-${match.index}`}
          href={href}
          target={external ? '_blank' : undefined}
          rel={external ? 'noreferrer' : undefined}
        >
          {match[3]}
        </a>,
      )
    } else if (match[5] !== undefined) {
      nodes.push(<code key={`${keyPrefix}-${match.index}`}>{match[5]}</code>)
    } else if (match[6] !== undefined || match[7] !== undefined) {
      nodes.push(
        <strong key={`${keyPrefix}-${match.index}`}>{match[6] ?? match[7]}</strong>,
      )
    } else if (match[8] !== undefined || match[9] !== undefined) {
      nodes.push(<em key={`${keyPrefix}-${match.index}`}>{match[8] ?? match[9]}</em>)
    }

    lastIndex = pattern.lastIndex
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex))
  }

  return nodes
}

function MarkdownImage({ src, alt }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className="markdown-image-fallback" role="img" aria-label={alt || 'Missing image'}>
        <span>{alt || 'Image unavailable'}</span>
      </div>
    )
  }

  return <img src={src} alt={alt} onError={() => setFailed(true)} />
}

function MarkdownBlocks({ blocks, basePath }) {
  return blocks.map((block, index) => {
    const key = `${block.type}-${index}`

    if (block.type === 'heading') {
      const HeadingTag = `h${Math.min(block.depth, 6)}`
      return (
        <HeadingTag key={key}>
          {renderInline(block.content, basePath, key)}
        </HeadingTag>
      )
    }

    if (block.type === 'paragraph') {
      return <p key={key}>{renderInline(block.content, basePath, key)}</p>
    }

    if (block.type === 'code') {
      return (
        <div key={key} className="markdown-code-block">
          {block.language ? <span className="markdown-code-label">{block.language}</span> : null}
          <pre>
            <code>{block.content}</code>
          </pre>
        </div>
      )
    }

    if (block.type === 'blockquote') {
      return (
        <blockquote key={key}>
          <MarkdownBlocks blocks={parseMarkdown(block.content)} basePath={basePath} />
        </blockquote>
      )
    }

    if (block.type === 'ul' || block.type === 'ol') {
      const ListTag = block.type

      return (
        <ListTag key={key}>
          {block.items.map((item, itemIndex) => (
            <li key={`${key}-${itemIndex}`}>
              {renderInline(item, basePath, `${key}-${itemIndex}`)}
            </li>
          ))}
        </ListTag>
      )
    }

    if (block.type === 'table') {
      return (
        <div key={key} className="markdown-table-wrap">
          <table>
            <thead>
              <tr>
                {block.headers.map((header, headerIndex) => (
                  <th key={`${key}-header-${headerIndex}`}>
                    {renderInline(header, basePath, `${key}-header-${headerIndex}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr key={`${key}-row-${rowIndex}`}>
                  {row.map((cell, cellIndex) => (
                    <td key={`${key}-row-${rowIndex}-cell-${cellIndex}`}>
                      {renderInline(cell, basePath, `${key}-row-${rowIndex}-cell-${cellIndex}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }

    if (block.type === 'hr') {
      return <hr key={key} />
    }

    return <Fragment key={key} />
  })
}

function ProjectReadme({ project }) {
  const [content, setContent] = useState('')
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    if (!project?.readme) {
      return undefined
    }

    const controller = new AbortController()

    async function loadReadme() {
      setStatus('loading')

      try {
        const response = await fetch(project.readme, { signal: controller.signal })

        if (!response.ok) {
          throw new Error(`Unable to load ${project.readme}`)
        }

        const markdown = await response.text()
        setContent(markdown)
        setStatus('ready')
      } catch (error) {
        if (error.name === 'AbortError') {
          return
        }

        setStatus('error')
      }
    }

    loadReadme()

    return () => controller.abort()
  }, [project])

  const blocks = useMemo(() => parseMarkdown(content), [content])

  if (!project?.readme) {
    return (
      <div className="project-readme-state">
        <h3>README not configured</h3>
        <p>Add a markdown file path to this project and it will render here automatically.</p>
      </div>
    )
  }

  if (status === 'loading') {
    return (
      <div className="project-readme-state" aria-busy="true">
        <div className="project-readme-skeleton project-readme-skeleton--title" />
        <div className="project-readme-skeleton" />
        <div className="project-readme-skeleton" />
        <div className="project-readme-skeleton project-readme-skeleton--short" />
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="project-readme-state">
        <h3>README not found</h3>
        <p>
          Add a markdown file at <code>{project.readme}</code> and this project detail view will
          render it automatically.
        </p>
      </div>
    )
  }

  return (
    <div className="markdown-body">
      <MarkdownBlocks blocks={blocks} basePath={project.readme} />
    </div>
  )
}

export default ProjectReadme
