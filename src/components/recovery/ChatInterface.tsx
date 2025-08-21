import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Send, MessageCircle } from "lucide-react"

interface ChatInterfaceProps {
  selectedDate: string
}

const suggestedQuestions = [
  "Do you feel tired or sore today?",
  "Do you hurt anywhere?", 
  "How's your sleep last night felt like?",
  "How's your energy level today?",
  "Any new injuries or pain?"
]

const mockLogs = [
  "Yesterday: You mentioned feeling tired after the workout",
  "2 days ago: You said your knee today is not very well",
  "3 days ago: Reported good sleep quality and high energy"
]

export function ChatInterface({ selectedDate }: ChatInterfaceProps) {
  const [message, setMessage] = useState("")
  const [chatHistory, setChatHistory] = useState<string[]>([])

  const handleSendMessage = () => {
    if (message.trim()) {
      setChatHistory([...chatHistory, message])
      setMessage("")
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    setChatHistory([...chatHistory, question])
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="h-5 w-5 text-fitness-orange" />
        <h2 className="text-xl font-semibold text-foreground">Daily Check-in</h2>
      </div>

      {/* Previous Logs */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Recent Logs</h3>
        <div className="space-y-2">
          {mockLogs.map((log, index) => (
            <div key={index} className="text-sm text-muted-foreground bg-muted/50 p-2 rounded-md">
              {log}
            </div>
          ))}
        </div>
      </div>

      {/* Chat History */}
      {chatHistory.length > 0 && (
        <div className="mb-4 space-y-2 max-h-32 overflow-y-auto">
          {chatHistory.map((msg, index) => (
            <div key={index} className="bg-fitness-orange/10 p-2 rounded-md text-sm">
              {msg}
            </div>
          ))}
        </div>
      )}

      {/* Suggested Questions */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Suggested Questions</h3>
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((question, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="cursor-pointer hover:bg-fitness-orange/20 transition-colors"
              onClick={() => handleSuggestedQuestion(question)}
            >
              {question}
            </Badge>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <Input
          placeholder="How are you feeling today?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          className="flex-1"
        />
        <Button onClick={handleSendMessage} size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  )
}