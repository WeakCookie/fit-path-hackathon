import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AIModal } from "@/components/ui/ai-modal"
import { TrainingSimulation } from "@/components/TrainingSimulation"
import { Calendar, Clock, Route, Zap, Pause, Brain, Target, ChevronDown, ChevronUp } from "lucide-react"
import { useToday, TRAINING_DATA, PREDICTION_DATA, TODAY } from "@/utils"

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
  paperId?: string
  reference?: string
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



// Utility functions for formatting data
const formatTime = (seconds: number | undefined) => {
  if (!seconds) return 'N/A'
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

const formatPace = (seconds: number | undefined) => {
  if (!seconds) return 'N/A'
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${minutes}:${secs.toString().padStart(2, '0')} min/km`
}

export default function TrainingLog() {
  const today = useToday()
  const [entry, setEntry] = useState<TrainingEntry>({
    exercise: "",
    duration: "",
    distance: "",
    intensity: "",
    restTime: ""
  })
  
  const [selectedAI, setSelectedAI] = useState<AIItem | null>(null)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [currentAIData, setCurrentAIData] = useState<Record<string, AIItem[]>>(mockAIData)
  
  // Get the latest training data from global store (most recent entry)
  const allTrainingData = TRAINING_DATA.getData()
  const latestTrainingData = allTrainingData.length > 0 
    ? [...allTrainingData].sort((a, b) => b.date.localeCompare(a.date))[0] 
    : null

  console.log('Current PREDICTION_DATA in TrainingLog:', PREDICTION_DATA.getData())

  // Transform PREDICTION_DATA into the format expected by the UI
  const transformPredictionData = (predictionData: any[]): Record<string, AIItem[]> => {
    const transformed: Record<string, AIItem[]> = {
      exercise: [],
      duration: [],
      distance: [],
      intensity: [],
      restTime: []
    }

    predictionData.forEach((paper) => {
      const { paperId, predictions } = paper
      
      // Process each prediction field
      Object.entries(predictions).forEach(([field, prediction]: [string, any]) => {
        if (prediction && transformed[field]) {
          const fieldName = field.charAt(0).toUpperCase() + field.slice(1)
          const predictedValue = prediction.value
          const valueDisplay = typeof predictedValue === 'number' 
            ? (field === 'duration' ? `${Math.round(predictedValue / 60)} minutes` :
               field === 'intensity' ? `${predictedValue} RPE` :
               field === 'restTime' ? `${predictedValue} seconds` :
               field === 'distance' ? `${predictedValue} km` :
               `${predictedValue}`)
            : predictedValue
          
          transformed[field].push({
            id: `pred-${paperId}-${field}`,
            type: "prediction" as const,
            title: `${fieldName}: ${valueDisplay}`,
            reasoning: prediction.reasoning || 'No reasoning provided',
            paperId: paperId,
            reference: prediction.reference || undefined
          })
        }
      })
    })

    return transformed
  }

  // Update currentAIData when PREDICTION_DATA changes or on mount
  useEffect(() => {
    const updateAIData = () => {
      const predictionData = PREDICTION_DATA.getData()
      console.log('Updating AI data with prediction data:', predictionData)
      
      if (predictionData.length > 0) {
        const transformedData = transformPredictionData(predictionData)
        console.log('Transformed prediction data:', transformedData)
        setCurrentAIData(transformedData)
      } else {
        console.log('No prediction data found, using mock data')
        setCurrentAIData(mockAIData)
      }
    }

    // Initial load
    updateAIData()

    // Subscribe to TODAY changes (which happens after simulations)
    const unsubscribe = TODAY._subscribe(() => {
      updateAIData()
    })

    // Add some test data if no prediction data exists (for demo purposes)
    if (PREDICTION_DATA.getData().length === 0) {
      const testPredictionData = [
        {
          paperId: "1",
          predictions: {
            exercise: { value: "Running", reference: "Smith et al. 2023", reasoning: "Based on your previous endurance training patterns and current fitness level, running is optimal for cardiovascular improvement." },
            duration: { value: 2700, reference: "Johnson et al. 2022", reasoning: "45 minutes provides optimal training stimulus without excessive fatigue accumulation." },
            intensity: { value: 7, reference: "Brown et al. 2024", reasoning: "RPE 7 corresponds to your lactate threshold zone for maximum aerobic benefit." }
          }
        },
        {
          paperId: "2", 
          predictions: {
            exercise: { value: "Cycling", reference: "Davis et al. 2023", reasoning: "Cross-training with cycling reduces injury risk while maintaining cardiovascular fitness." },
            duration: { value: 3600, reference: "Wilson et al. 2023", reasoning: "60 minutes allows for proper warm-up, main set, and cool-down phases." },
            distance: { value: 8.5, reference: "Taylor et al. 2022", reasoning: "8.5km distance aligns with progressive overload principles for endurance development." }
          }
        },
        {
          paperId: "3",
          predictions: {
            intensity: { value: 6, reference: "Miller et al. 2024", reasoning: "Moderate intensity promotes recovery while maintaining fitness adaptations." },
            restTime: { value: 120, reference: "Anderson et al. 2023", reasoning: "2-minute rest intervals optimize recovery between training intervals." }
          }
        }
      ]
      
      PREDICTION_DATA.setData(testPredictionData)

      // Add a test suggestion for duration field
      const durationSuggestion = {
        id: "sug-duration-1",
        type: "suggestion" as const,
        title: "Duration Suggestion",
        reasoning: "I recommend 30 minutes today based on your recent sleep quality and current energy levels. Shorter sessions are more effective when recovery is suboptimal, allowing you to maintain intensity while preventing overreaching."
      }

      // Update the current AI data to include the suggestion
      const currentData = transformPredictionData(testPredictionData)
      currentData.duration.push(durationSuggestion)
      setCurrentAIData(currentData)
    }

    return unsubscribe
  }, [])

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
    const aiItems = currentAIData[field] || []
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
                {predictions.length} Prediction{predictions.length > 1 ? 's' : ''}
                <ChevronDown className="h-3 w-3" />
              </Button>
            )}
            
            {hasPredictions && isExpanded && (
              <div className="flex items-center gap-2 animate-fade-in">
                {predictions.map((item, index) => {
                  // Extract paper ID from the item ID (format: pred-{paperId}-{field})
                  const paperId = item.id.split('-')[1] || 'Unknown'
                  return (
                    <Button
                      key={item.id}
                      variant="prediction"
                      size="sm"
                      onClick={() => handleAIClick(item)}
                      className="flex items-center gap-1.5 animate-scale-in whitespace-nowrap"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <Brain className="h-3.5 w-3.5" />
                      Paper {paperId}
                    </Button>
                  )
                })}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleRowExpansion(field)}
                  className="flex items-center gap-1.5 transition-all duration-300 whitespace-nowrap"
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
            <div className="text-muted-foreground">
              Track your workout with AI-powered insights and recommendations
              {currentAIData !== mockAIData && (
                <span className="ml-2 inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse block"></span>
                  Live AI Data Active
                </span>
              )}
            </div>
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
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Latest Training Summary Section */}
          <Card className="shadow-lg border-0 mt-8">
            <CardHeader className="bg-gradient-to-r from-fitness-orange/5 to-fitness-orange-hover/5 border-b border-border/50">
              <CardTitle className="flex items-center gap-2">
                <div className="p-1.5 bg-fitness-orange/10 rounded-md">
                  <Calendar className="h-4 w-4 text-fitness-orange" />
                </div>
                Latest Training Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {latestTrainingData ? (
                <div>
                  <div className="mb-4 text-center">
                    <p className="text-sm text-muted-foreground">Latest session: {latestTrainingData.date}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-card rounded-lg border">
                      <Target className="h-5 w-5 text-fitness-orange" />
                      <div>
                        <p className="text-sm text-muted-foreground">Exercise</p>
                        <p className="font-semibold">{latestTrainingData.exercise || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-card rounded-lg border">
                      <Zap className="h-5 w-5 text-fitness-orange" />
                      <div>
                        <p className="text-sm text-muted-foreground">Intensity</p>
                        <p className="font-semibold">{latestTrainingData.intensity ? `${latestTrainingData.intensity} RPE` : 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-card rounded-lg border">
                      <Clock className="h-5 w-5 text-fitness-orange" />
                      <div>
                        <p className="text-sm text-muted-foreground">Duration</p>
                        <p className="font-semibold">{formatTime(latestTrainingData.duration)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-card rounded-lg border">
                      <Route className="h-5 w-5 text-fitness-orange" />
                      <div>
                        <p className="text-sm text-muted-foreground">Distance</p>
                        <p className="font-semibold">{latestTrainingData.distance ? `${latestTrainingData.distance} km` : 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-card rounded-lg border">
                      <Clock className="h-5 w-5 text-fitness-orange" />
                      <div>
                        <p className="text-sm text-muted-foreground">Pace</p>
                        <p className="font-semibold">{formatPace(latestTrainingData.pace)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-card rounded-lg border">
                      <Zap className="h-5 w-5 text-fitness-orange" />
                      <div>
                        <p className="text-sm text-muted-foreground">Cadence</p>
                        <p className="font-semibold">{latestTrainingData.cadence ? `${latestTrainingData.cadence} spm` : 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No training data available</p>
                  <p className="text-sm text-muted-foreground mt-2">Complete a training simulation to see your latest data here!</p>
                </div>
              )}
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
        paperId={selectedAI?.paperId}
        reference={selectedAI?.reference}
      />
    </div>
  )
}