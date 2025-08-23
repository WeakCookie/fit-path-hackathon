import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Send, MessageCircle, ChevronDown, ChevronUp } from "lucide-react"
import { InjurySimulationId, RecoverySimulationId } from "@/components/TrainingSimulation"
import { RECOVERY_DATA, TRAINING_DATA } from "@/utils"

interface ChatInterfaceProps {
  selectedDate: string
}

interface SuggestedQuestion {
  id: string
  title: string
  expandedMessage: string
  isGeneral?: boolean
}

const generalQuestions: SuggestedQuestion[] = [
  {
    id: "general-1",
    title: "Do you feel tired or sore today?",
    expandedMessage: "Tell us about your overall energy levels and any muscle soreness you're experiencing today.",
    isGeneral: true
  },
  {
    id: "general-2", 
    title: "How's your sleep last night?",
    expandedMessage: "Share details about your sleep quality, duration, and how rested you feel this morning.",
    isGeneral: true
  },
  {
    id: "general-3",
    title: "How's your energy level today?",
    expandedMessage: "Rate your energy on a scale of 1-10 and describe how you're feeling mentally and physically.",
    isGeneral: true
  }
]

const injurySpecificQuestions: Record<InjurySimulationId, SuggestedQuestion> = {
  [InjurySimulationId.KNEE_HURT]: {
    id: "injury-knee",
    title: "How's your knee today?",
    expandedMessage: "How's your knee feeling compared to yesterday? Any changes in pain level, swelling, or mobility? Rate the pain from 1-10 and describe what movements are difficult."
  },
  [InjurySimulationId.BREAK_ANKLE]: {
    id: "injury-ankle",
    title: "How's your ankle recovery going?",
    expandedMessage: "How's your ankle healing compared to yesterday? Any changes in pain, swelling, or your ability to bear weight? Describe your mobility and comfort level."
  }
}

const recoverySpecificQuestions: Record<RecoverySimulationId, SuggestedQuestion> = {
  [RecoverySimulationId.SLEEP_UNDER_6]: {
    id: "recovery-sleep",
    title: "How did your short sleep affect you?",
    expandedMessage: "How are you feeling after getting less than 6 hours of sleep? Are you experiencing fatigue, difficulty concentrating, or any other effects from insufficient rest?"
  },
  [RecoverySimulationId.SORE_LEGS]: {
    id: "recovery-legs",
    title: "How are your legs feeling today?",
    expandedMessage: "How's the soreness in your legs compared to yesterday? Has it improved, stayed the same, or gotten worse? What activities are most affected by the soreness?"
  }
}

const mockLogs = [
  "Yesterday: You mentioned feeling tired after the workout",
  "2 days ago: You said your knee today is not very well",
  "3 days ago: Reported good sleep quality and high energy"
]

export function ChatInterface({ selectedDate }: ChatInterfaceProps) {
  const [message, setMessage] = useState("")
  const [chatHistory, setChatHistory] = useState<string[]>([])
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set())

  const handleSendMessage = () => {
    if (message.trim()) {
      setChatHistory([...chatHistory, message])
      
             // Check if the response contains "recovery plan"
       if (message.toLowerCase().includes("plan")) {
         console.log("Latest message:", message)
         console.log("Latest RECOVERY_DATA:", RECOVERY_DATA.getData())
         console.log("Latest TRAINING_DATA:", TRAINING_DATA.getData())
         // TODO call api here for recovery
       }
      
      setMessage("")
    }
  }

  const toggleQuestionExpansion = (questionId: string) => {
    const newExpanded = new Set(expandedQuestions)
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId)
    } else {
      newExpanded.add(questionId)
    }
    setExpandedQuestions(newExpanded)
  }

  // Get current recovery data for the selected date
  const recoveryData = RECOVERY_DATA.getData()
  
  // Get the last element from RECOVERY_DATA and log injury and soreness keys
  const lastRecoveryEntry = recoveryData[recoveryData.length - 1]

  
  // Generate questions based on last recovery entry's injury and soreness data
  const getQuestionsFromLastEntry = (): SuggestedQuestion[] => {
    const questions: SuggestedQuestion[] = []
    
    if (lastRecoveryEntry) {
      // Add injury-specific questions from last entry
      if (lastRecoveryEntry.injury && lastRecoveryEntry.injury.length > 0) {
        const injuryQuestions = mapToInjuryQuestions(lastRecoveryEntry.injury)
        questions.push(...injuryQuestions)
      }
      
      // Add recovery-specific questions based on last entry's soreness
      if (lastRecoveryEntry.soreness && lastRecoveryEntry.soreness.length > 0) {
        lastRecoveryEntry.soreness.forEach((soreness: string) => {
          if (soreness === RecoverySimulationId.SORE_LEGS || soreness.toLowerCase().includes('legs')) {
            questions.push(recoverySpecificQuestions[RecoverySimulationId.SORE_LEGS])
          }
        })
      }
      
      // Add sleep-related questions if last entry had poor sleep
      if (lastRecoveryEntry.sleepDuration && lastRecoveryEntry.sleepDuration < 6) {
        questions.push(recoverySpecificQuestions[RecoverySimulationId.SLEEP_UNDER_6])
      }
    }
    
    // Remove duplicates
    return questions.filter((question, index, self) => 
      index === self.findIndex(q => q.id === question.id)
    )
  }
  const selectedDayData = recoveryData.find(data => data.date === selectedDate)
  
  // Helper function to map injury/soreness strings to their corresponding questions
  const mapToInjuryQuestions = (injuries: string[]): SuggestedQuestion[] => {
    const detectedInjuries: InjurySimulationId[] = []
    
    injuries.forEach(injury => {
      // Check for exact enum values first, then keywords
      if (injury === InjurySimulationId.KNEE_HURT || injury.toLowerCase().includes('knee')) {
        detectedInjuries.push(InjurySimulationId.KNEE_HURT)
      }
      if (injury === InjurySimulationId.BREAK_ANKLE || injury.toLowerCase().includes('ankle')) {
        detectedInjuries.push(InjurySimulationId.BREAK_ANKLE)
      }
    })
    
    // Remove duplicates and map to questions
    return [...new Set(detectedInjuries)].map(injury => injurySpecificQuestions[injury])
  }

  const mapToRecoveryQuestions = (selectedDayData: any): SuggestedQuestion[] => {
    const detectedFactors: RecoverySimulationId[] = []
    
    // Check sleep duration
    if (selectedDayData.sleepDuration && selectedDayData.sleepDuration < 6) {
      detectedFactors.push(RecoverySimulationId.SLEEP_UNDER_6)
    }
    
    // Check soreness
    if (selectedDayData.soreness && selectedDayData.soreness.length > 0) {
      selectedDayData.soreness.forEach((soreness: string) => {
        if (soreness === RecoverySimulationId.SORE_LEGS || soreness.toLowerCase().includes('legs')) {
          detectedFactors.push(RecoverySimulationId.SORE_LEGS)
        }
      })
    }
    
    // Remove duplicates and map to questions
    return [...new Set(detectedFactors)].map(recovery => recoverySpecificQuestions[recovery])
  }

  // Generate relevant questions based on actual data
  const relevantQuestions: SuggestedQuestion[] = []
  
  // First, add questions from the last recovery entry (most recent data)
  const lastEntryQuestions = getQuestionsFromLastEntry()

  relevantQuestions.push(...lastEntryQuestions)
  
  if (selectedDayData) {
    // Add injury-specific questions from selected day
    if (selectedDayData.injury && selectedDayData.injury.length > 0) {
      const injuryQuestions = mapToInjuryQuestions(selectedDayData.injury)
      console.log('Injury questions generated from selected day:', injuryQuestions)
      relevantQuestions.push(...injuryQuestions)
    }
    
    // Add recovery-specific questions from selected day
    const recoveryQuestions = mapToRecoveryQuestions(selectedDayData)
    console.log('Recovery questions generated from selected day:', recoveryQuestions)
    relevantQuestions.push(...recoveryQuestions)
  }
  
  // Remove duplicates after combining all questions
  const uniqueRelevantQuestions = relevantQuestions.filter((question, index, self) => 
    index === self.findIndex(q => q.id === question.id)
  )

  // Check if there are detected injuries or factors
  const hasDetectedInjuries = lastRecoveryEntry?.injury && lastRecoveryEntry.injury.length > 0
  const hasDetectedFactors = (lastRecoveryEntry?.soreness && lastRecoveryEntry.soreness.length > 0) ||
                           (lastRecoveryEntry?.sleepDuration && lastRecoveryEntry.sleepDuration < 6) ||
                           (selectedDayData?.soreness && selectedDayData.soreness.length > 0) ||
                           (selectedDayData?.sleepDuration && selectedDayData.sleepDuration < 6) ||
                           (selectedDayData?.injury && selectedDayData.injury.length > 0)
  
  const hasDetectedInjuriesOrFactors = hasDetectedInjuries || hasDetectedFactors

  // Add recovery plan question if injuries or factors are detected
  if (hasDetectedInjuriesOrFactors) {
    const recoveryPlanQuestion: SuggestedQuestion = {
      id: "recovery-plan",
      title: "Do you need a recovery plan?",
      expandedMessage: "Based on your current injuries or recovery factors, would you like us to suggest a personalized recovery plan to help you get back to optimal performance?"
    }
    uniqueRelevantQuestions.unshift(recoveryPlanQuestion) // Add at the beginning
  }

  // Always add general questions if no specific questions are found
  if (uniqueRelevantQuestions.length === 0) {
    console.log('No specific questions found, adding general questions')
    uniqueRelevantQuestions.push(...generalQuestions)
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

      {/* Suggested Questions */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Try Answering These Questions</h3>
        <div className="space-y-3">
          {uniqueRelevantQuestions.map((question) => (
            <Collapsible key={question.id}>
              <div className="border rounded-lg p-3 bg-muted/30 hover:bg-muted/50 transition-colors">
                <CollapsibleTrigger 
                  className="w-full flex items-center justify-between cursor-pointer"
                  onClick={() => toggleQuestionExpansion(question.id)}
                >
                  <span className="font-medium text-sm text-left">{question.title}</span>
                  {expandedQuestions.has(question.id) ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </CollapsibleTrigger>
                
                <CollapsibleContent className="mt-2">
                  <div className="text-sm text-muted-foreground mb-3">
                    {question.expandedMessage}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          ))}
        </div>
      </div>

      {/* Chat History */}
      {chatHistory.length > 0 && (
        <div className="mb-4 space-y-2 max-h-32 overflow-y-auto">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Your Responses</h3>
          {chatHistory.map((msg, index) => (
            <div key={index} className="bg-fitness-orange/10 p-2 rounded-md text-sm">
              {msg}
            </div>
          ))}
        </div>
      )}

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