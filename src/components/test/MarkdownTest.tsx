import { MarkdownRenderer } from "@/components/ui/markdown-renderer"
import { Card } from "@/components/ui/card"

const testMarkdown = `
# Test Markdown Content

This is a **test** of the markdown renderer.

## Features
- **Bold text** works correctly
- *Italic text* works correctly  
- Lists are properly formatted

### Nested content
1. First item
2. Second item with **bold** text
3. Third item with *italic* text

**Important note:** The markdown renderer should now work without the className prop error.
`

export function MarkdownTest() {
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Markdown Renderer Test</h1>
      
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Blue Theme</h2>
        <MarkdownRenderer 
          content={testMarkdown}
          colorScheme="blue"
          className="text-sm"
        />
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Green Theme</h2>
        <MarkdownRenderer 
          content={testMarkdown}
          colorScheme="green"
          className="text-sm"
        />
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Error Test (Invalid Content)</h2>
        <MarkdownRenderer 
          content={null as any}
          colorScheme="orange"
          className="text-sm"
        />
      </Card>
    </div>
  )
}