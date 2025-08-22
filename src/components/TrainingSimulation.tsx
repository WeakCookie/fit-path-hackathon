import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, TrendingUp, Minus, TrendingDown, Heart, Moon, Frown, Play } from "lucide-react"

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
  { id: "performance-up", label: "Performance Increased", icon: TrendingUp, variant: "performance-up" },
  { id: "performance-neutral", label: "Performance Neutral", icon: Minus, variant: "performance-neutral" },
  { id: "performance-down", label: "Performance Decreased", icon: TrendingDown, variant: "performance-down" }
]

const injuryOptions: InjuryOption[] = [
  { id: "knee-hurt", label: "Knee hurt", icon: Frown },
  { id: "break-ankle", label: "Break ankle", icon: Frown }
]

const recoveryOptions: RecoveryOption[] = [
  { id: "sleep-under-6", label: "Sleep under 6 hours", icon: Moon },
  { id: "sore-legs", label: "Sore legs", icon: Frown }
]

export function TrainingSimulation() {
  const [selectedTraining, setSelectedTraining] = useState<string | null>(null)
  const [selectedInjuries, setSelectedInjuries] = useState<Set<string>>(new Set())
  const [selectedRecoveries, setSelectedRecoveries] = useState<Set<string>>(new Set())

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
    
    console.log("Training Simulation Options:", selectedOptions)
  }

  return (
    <Card className="shadow-lg border-0 mt-8">
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
          >
            <Play className="h-4 w-4 mr-2" />
            Run Simulation
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
