import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AIModal } from "@/components/ui/ai-modal"
import { TrainingSimulation } from "@/components/TrainingSimulation"
import { Calendar, Clock, Route, Zap, Pause, Brain, Target, ChevronDown, ChevronUp } from "lucide-react"

interface TrainingEntry {
  exercise: string
  duration: string
  distance: string
  intensity: string
  restTime: string
}

interface AIItem {
  id: string
  type: "prediction" | "suggestion"
  title: string
  reasoning: string
}

const mockAIData: Record<string, AIItem[]> = {
  exercise: [
    {
      id: "pred-1",
      type: "prediction",
      title: "Predicted Exercise",
      reasoning: "Based on your recent training patterns and progressive overload principles, I predict you'll perform squats today. Your last session showed good strength in lower body movements, and following a structured program suggests squats are due in your rotation."
    },
    {
      id: "sug-1", 
      type: "suggestion",
      title: "Exercise Recommendation",
      reasoning: "I recommend deadlifts today as they target multiple muscle groups and complement your recent upper body focus. Your recovery metrics show you're ready for a compound movement, and deadlifts will help balance your training split."
    }
  ],
  duration: [
    {
      id: "pred-2",
      type: "prediction", 
      title: "Duration Prediction",
      reasoning: "I predict you'll train for 45-60 minutes based on your historical data. Your past sessions average 52 minutes, and considering today's energy levels and schedule, this timeframe aligns with optimal training duration for your goals."
    },
    {
      id: "sug-2",
      type: "suggestion",
      title: "Duration Suggestion", 
      reasoning: "I suggest 40 minutes today. Your sleep quality was suboptimal last night (6.2 hours), and shorter, more intense sessions often yield better results when recovery is compromised. Focus on compound movements for efficiency."
    }
  ],
  distance: [
    {
      id: "pred-3",
      type: "prediction",
      title: "Distance Prediction",
      reasoning: "For cardio exercises, I predict 3-5km based on your current fitness level and recent performance trends. Your VO2 max has improved 8% this month, suggesting you can handle moderate distance increases."
    }
  ],
  intensity: [
    {
      id: "sug-3", 
      type: "suggestion",
      title: "Intensity Recommendation",
      reasoning: "I recommend moderate intensity (70-80% max heart rate) today. Your HRV data shows good recovery, but it's mid-week and you have two more training sessions planned. Moderate intensity will maintain progress while preventing overreaching."
    },
    {
      id: "pred-4",
      type: "prediction",
      title: "Intensity Prediction", 
      reasoning: "I predict you'll naturally gravitate toward high intensity today. Your motivation levels are elevated, and you've had 2 days rest. However, consider your weekly volume to avoid burnout."
    }
  ],
  restTime: [
    {
      id: "sug-4",
      type: "suggestion", 
      title: "Rest Time Suggestion",
      reasoning: "I suggest 90-120 seconds rest between sets for strength training, or 60-90 seconds for hypertrophy focus. Your goal of building lean muscle mass requires adequate recovery between sets to maintain intensity and form quality."
    }
  ]
}

export default function TrainingLog() {
  const [entry, setEntry] = useState<TrainingEntry>({
    exercise: "",
    duration: "",
    distance: "",
    intensity: "",
    restTime: ""
  })
  
  const [selectedAI, setSelectedAI] = useState<AIItem | null>(null)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  const handleInputChange = (field: keyof TrainingEntry, value: string) => {
    setEntry(prev => ({ ...prev, [field]: value }))
  }

  const handleAIClick = (item: AIItem) => {
    setSelectedAI(item)
  }

  const toggleRowExpansion = (field: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev)
      if (newSet.has(field)) {
        newSet.delete(field)
      } else {
        newSet.add(field)
      }
      return newSet
    })
  }

  const getFieldIcon = (field: string) => {
    switch (field) {
      case "exercise": return <Target className="h-4 w-4" />
      case "duration": return <Clock className="h-4 w-4" />
      case "distance": return <Route className="h-4 w-4" />
      case "intensity": return <Zap className="h-4 w-4" />
      case "restTime": return <Pause className="h-4 w-4" />
      default: return null
    }
  }

  const renderTrainingRow = (field: keyof TrainingEntry, label: string, placeholder: string) => {
    const aiItems = mockAIData[field] || []
    const predictions = aiItems.filter(item => item.type === "prediction")
    const suggestions = aiItems.filter(item => item.type === "suggestion")
    const isExpanded = expandedRows.has(field)
    const hasPredictions = predictions.length > 0

    return (
      <div key={field} className="space-y-3">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
          <div className="lg:col-span-4">
            <Label htmlFor={field} className="flex items-center gap-2 text-sm font-medium">
              {getFieldIcon(field)}
              {label}
            </Label>
            <Input
              id={field}
              placeholder={placeholder}
              value={entry[field]}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className="mt-1.5"
            />
          </div>
          
          <div className="lg:col-span-4 flex flex-wrap gap-2">
            {suggestions.map((item) => (
              <Button
                key={item.id}
                variant="suggestion"
                size="sm"
                onClick={() => handleAIClick(item)}
                className="flex items-center gap-1.5 animate-fade-in"
              >
                <Target className="h-3.5 w-3.5" />
                Suggestion
              </Button>
            ))}
          </div>

          <div className="lg:col-span-4 flex flex-wrap gap-2 justify-end">
            {hasPredictions && !isExpanded && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleRowExpansion(field)}
                className="flex items-center gap-1.5 transition-all duration-300 hover:scale-105"
              >
                <Brain className="h-3.5 w-3.5" />
                Show Predictions
                <ChevronDown className="h-3 w-3" />
              </Button>
            )}
            
            {hasPredictions && isExpanded && (
              <div className="flex flex-wrap gap-2 animate-fade-in">
                {predictions.map((item, index) => (
                  <Button
                    key={item.id}
                    variant="prediction"
                    size="sm"
                    onClick={() => handleAIClick(item)}
                    className="flex items-center gap-1.5 animate-scale-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Brain className="h-3.5 w-3.5" />
                    Prediction {predictions.length > 1 ? index + 1 : ''}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleRowExpansion(field)}
                  className="flex items-center gap-1.5 transition-all duration-300"
                >
                  Hide
                  <ChevronUp className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16">
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="h-6 w-6 text-fitness-orange" />
              <h1 className="text-3xl font-bold">Daily Training Log</h1>
            </div>
            <p className="text-muted-foreground">
              Track your workout with AI-powered insights and recommendations
            </p>
          </div>

          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-fitness-orange/5 to-fitness-orange-hover/5 border-b border-border/50">
              <CardTitle className="flex items-center gap-2">
                <div className="p-1.5 bg-fitness-orange/10 rounded-md">
                  <Target className="h-4 w-4 text-fitness-orange" />
                </div>
                Today's Training Session
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {renderTrainingRow("exercise", "Exercise", "e.g., Squats, Running, Push-ups")}
              {renderTrainingRow("duration", "Duration", "e.g., 45 minutes, 1 hour")}
              {renderTrainingRow("distance", "Distance", "e.g., 5km, 2 miles (if applicable)")}
              {renderTrainingRow("intensity", "Intensity", "e.g., High, Moderate, Low")}
              {renderTrainingRow("restTime", "Rest Time", "e.g., 90 seconds, 2 minutes")}

              <div className="pt-4 border-t border-border/50">
                <div className="flex gap-3">
                  <Button variant="hero" className="flex-1">
                    Save Training Session
                  </Button>
                  <Button variant="outline">
                    Clear All
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <TrainingSimulation />
        </div>
      </div>
      </div>

      <AIModal
        isOpen={!!selectedAI}
        onClose={() => setSelectedAI(null)}
        type={selectedAI?.type || "suggestion"}
        title={selectedAI?.title || ""}
        reasoning={selectedAI?.reasoning || ""}
      />
    </div>
  )
}