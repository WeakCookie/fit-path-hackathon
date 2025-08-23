import React from 'react'
import ReactMarkdown from 'react-markdown'
import { MarkdownErrorBoundary } from './error-boundary'

interface MarkdownRendererProps {
  content: string
  className?: string
  colorScheme?: 'blue' | 'green' | 'purple' | 'orange'
}

export function MarkdownRenderer({ content, className = '', colorScheme = 'blue' }: MarkdownRendererProps) {
  const getColorClasses = (colorScheme: string) => {
    const colors = {
      blue: {
        h1: 'text-blue-700',
        h2: 'text-blue-600',
        h3: 'text-blue-600',
        strong: 'text-blue-800',
        em: 'text-blue-700'
      },
      green: {
        h1: 'text-green-700',
        h2: 'text-green-600',
        h3: 'text-green-600',
        strong: 'text-green-800',
        em: 'text-green-700'
      },
      purple: {
        h1: 'text-purple-700',
        h2: 'text-purple-600',
        h3: 'text-purple-600',
        strong: 'text-purple-800',
        em: 'text-purple-700'
      },
      orange: {
        h1: 'text-orange-700',
        h2: 'text-orange-600',
        h3: 'text-orange-600',
        strong: 'text-orange-800',
        em: 'text-orange-700'
      }
    }
    return colors[colorScheme as keyof typeof colors] || colors.blue
  }

  const colors = getColorClasses(colorScheme)

  // Safety check for content
  if (!content || typeof content !== 'string') {
    return <p className="text-muted-foreground">No content available</p>
  }

  return (
    <MarkdownErrorBoundary content={content}>
      <div className={`markdown-content ${className}`}>
        <ReactMarkdown 
          components={{
            h1: (props) => (
              <h1 className={`text-xl font-bold ${colors.h1} mb-3 mt-4 first:mt-0`} {...props} />
            ),
            h2: (props) => (
              <h2 className={`text-lg font-semibold ${colors.h2} mb-2 mt-3 first:mt-0`} {...props} />
            ),
            h3: (props) => (
              <h3 className={`text-base font-medium ${colors.h3} mb-2 mt-2 first:mt-0`} {...props} />
            ),
            p: (props) => (
              <p className="mb-2 leading-relaxed" {...props} />
            ),
            ul: (props) => (
              <ul className="list-disc list-inside mb-3 ml-2 space-y-1" {...props} />
            ),
            ol: (props) => (
              <ol className="list-decimal list-inside mb-3 ml-2 space-y-1" {...props} />
            ),
            li: (props) => (
              <li className="text-sm leading-relaxed" {...props} />
            ),
            strong: (props) => (
              <strong className={`font-semibold ${colors.strong}`} {...props} />
            ),
            em: (props) => (
              <em className={`italic ${colors.em}`} {...props} />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </MarkdownErrorBoundary>
  )
}