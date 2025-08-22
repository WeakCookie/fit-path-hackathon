import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, TrendingUp, Minus, TrendingDown, Heart, Moon, Frown, Play } from "lucide-react"
import { calculateTrainingLogError, runSimulation, WEIGHT_PRESETS } from "@/utils/performanceSimulation"
import { TRAINING_DATA, CONFIDENCE_DATA } from "@/utils"
import { useToast } from "@/components/ui/use-toast"
import { TODAY } from "@/utils"

export enum TrainingSimulationId {
  PERFORMANCE_UP = "performance-up",
  PERFORMANCE_NEUTRAL = "performance-neutral", 
  PERFORMANCE_DOWN = "performance-down"
}

export enum InjurySimulationId {
  KNEE_HURT = "knee-hurt",
  BREAK_ANKLE = "break-ankle"
}

export enum RecoverySimulationId {
  SLEEP_UNDER_6 = "sleep-under-6",
  SORE_LEGS = "sore-legs"
}

interface TrainingSimulationOptions {
  training: string | null
  injuries: string[]
  recoveries: string[]
}

interface TrainingOption {
  id: string
  label: string
  icon: React.ElementType
  variant: string
}

interface InjuryOption {
  id: string
  label: string
  icon: React.ElementType
}

interface RecoveryOption {
  id: string
  label: string
  icon: React.ElementType
}

const trainingOptions: TrainingOption[] = [
  { id: TrainingSimulationId.PERFORMANCE_UP, label: "Performance Increased", icon: TrendingUp, variant: "performance-up" },
  { id: TrainingSimulationId.PERFORMANCE_NEUTRAL, label: "Performance Neutral", icon: Minus, variant: "performance-neutral" },
  { id: TrainingSimulationId.PERFORMANCE_DOWN, label: "Performance Decreased", icon: TrendingDown, variant: "performance-down" }
]

const injuryOptions: InjuryOption[] = [
  { id: InjurySimulationId.KNEE_HURT, label: "Knee hurt", icon: Frown },
  { id: InjurySimulationId.BREAK_ANKLE, label: "Break ankle", icon: Frown }
]

const recoveryOptions: RecoveryOption[] = [
  { id: RecoverySimulationId.SLEEP_UNDER_6, label: "Sleep under 6 hours", icon: Moon },
  { id: RecoverySimulationId.SORE_LEGS, label: "Sore legs", icon: Frown }
]

export function TrainingSimulation() {
  const [selectedTraining, setSelectedTraining] = useState<string | null>(null)
  const [selectedInjuries, setSelectedInjuries] = useState<Set<string>>(new Set())
  const [selectedRecoveries, setSelectedRecoveries] = useState<Set<string>>(new Set())
  const { toast } = useToast()

  const handleTrainingClick = (training: string) => {
    setSelectedTraining(selectedTraining === training ? null : training)
  }

  const handleInjuryClick = (injury: string) => {
    setSelectedInjuries(prev => {
      const newSet = new Set(prev)
      if (newSet.has(injury)) {
        newSet.delete(injury)
      } else {
        newSet.add(injury)
      }
      return newSet
    })
  }

  const handleRecoveryClick = (recovery: string) => {
    setSelectedRecoveries(prev => {
      const newSet = new Set(prev)
      if (newSet.has(recovery)) {
        newSet.delete(recovery)
      } else {
        newSet.add(recovery)
      }
      return newSet
    })
  }

  const handleSubmit = () => {
    const selectedOptions: TrainingSimulationOptions = {
      training: selectedTraining,
      injuries: Array.from(selectedInjuries),
      recoveries: Array.from(selectedRecoveries)
    }
    
    // Get current global training data and run simulation
    const currentData = TRAINING_DATA.getData()
    const updatedData = runSimulation(currentData, selectedTraining as TrainingSimulationId, 0.1, true)
    console.log("Updated data after simulation:", updatedData)
    
    // Update the global training data store
    TRAINING_DATA.setData(updatedData)
    
		const mockPredictedValueData = [{
			date: "2025-08-22",
			pace: 300,
			distance: 8,
			duration: 45 * 60,
			cadence: 168,
			lactaseThresholdPace: 270,
			aerobicDecoupling: 9.8,
			paperId: "3"
		}, {
			date: "2025-08-22",
			pace: 200,
			distance: 8,
			duration: 43 * 60,
			cadence: 168,
			lactaseThresholdPace: 270,
			aerobicDecoupling: 9.8,
			paperId: "4"
		}]
		
		// Process each predicted value data entry
		mockPredictedValueData.forEach(predictedData => {
			// Calculate confidence score for this prediction
			const calculatedScore = calculateTrainingLogError(updatedData[updatedData.length - 1], predictedData, WEIGHT_PRESETS.enduranceFocused)
			
			// Get the latest confidence score for this paper
			const latestScore = CONFIDENCE_DATA.getLatestScore(predictedData.paperId)
			
			// Add the calculated score to the latest value (or start with 0 if no previous data)
			const baseScore = latestScore ? latestScore.score : 0
			const newScore = baseScore + calculatedScore
			
			// Create and add new confidence data point
			const newConfidencePoint = {
				date: TODAY.getISOString(),
				score: newScore,
				paperId: predictedData.paperId
			}
			
			CONFIDENCE_DATA.addScore(newConfidencePoint)
		})


    TODAY.advanceDay()
    
    toast({
      title: "Simulation Complete",
      description: `Training simulation (${selectedOptions.training?.replace('-', ' ')}) has been run successfully. TODAY advanced to ${TODAY.getISOString()}. Check training History and Research Confidence for results.`,
    })
    
    // Reset selections for next simulation
    setSelectedTraining(null)
    setSelectedInjuries(new Set())
    setSelectedRecoveries(new Set())
  }

  return (
    <div className="relative border-2 border-dashed border-gray-400 rounded-lg p-4 mt-8">
      {/* Demo Only Label */}
      <div className="absolute -top-3 right-4 bg-white px-2 py-1 text-xs font-semibold text-gray-600 border border-gray-400 rounded">
        Demo Only
      </div>
      
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-muted/50 to-muted/30 border-b border-border/50">
          <CardTitle className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 rounded-md">
              <Activity className="h-4 w-4 text-primary" />
            </div>
            Training Simulation
          </CardTitle>
        </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Training Section */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-fitness-orange" />
            Training
          </h3>
          <div className="flex flex-wrap gap-3">
            {trainingOptions.map((option, index) => {
              const IconComponent = option.icon
              return (
                <Button 
                  key={option.id}
                  variant={selectedTraining === option.id ? "default" : option.variant as any} 
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => handleTrainingClick(option.id)}
                >
                  <IconComponent className="h-4 w-4" />
                  {option.label}
                </Button>
              )
            })}
          </div>
        </div>

        {/* Injury Section */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Injury
          </h3>
          <div className="flex flex-wrap gap-3">
            {injuryOptions.map((option, index) => {
              const IconComponent = option.icon
              return (
                <Button 
                  key={option.id}
                  variant={selectedInjuries.has(option.id) ? "default" : "injury"} 
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => handleInjuryClick(option.id)}
                >
                  <IconComponent className="h-4 w-4" />
                  {option.label}
                </Button>
              )
            })}
          </div>
        </div>

        {/* Recovery Section */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Moon className="h-5 w-5 text-blue-500" />
            Recovery
          </h3>
          <div className="flex flex-wrap gap-3">
            {recoveryOptions.map((option, index) => {
              const IconComponent = option.icon
              return (
                <Button 
                  key={option.id}
                  variant={selectedRecoveries.has(option.id) ? "default" : "recovery"} 
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => handleRecoveryClick(option.id)}
                >
                  <IconComponent className="h-4 w-4" />
                  {option.label}
                </Button>
              )
            })}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t border-border/50">
          <Button 
            variant="hero" 
            className="w-full"
            onClick={handleSubmit}
            disabled={!selectedTraining}
          >
            <Play className="h-4 w-4 mr-2" />
            Run Simulation
          </Button>
        </div>
      </CardContent>
    </Card>
    </div>
  )
}
