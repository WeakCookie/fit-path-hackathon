import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Play, RotateCcw, Zap, Heart, Moon, Activity } from "lucide-react"
import recoveryData from "@/mock/recovery.mock"
import { IRecovery } from "@/types/recovery.schema"

interface ScenarioSimulatorProps {
  onScenarioSelect: (data: IRecovery) => void
  onDateSelect: (date: string) => void
  onDailyCheckIn?: () => void
}

interface Scenario {
  id: string
  name: string
  description: string
  icon: typeof Heart
  color: string
  bgColor: string
  dates: string[]
  characteristics: string[]
}

const scenarios: Scenario[] = [
  {
    id: "injury-recovery",
    name: "Injury Recovery",
    description: "Recovery from shoulder injury - showing gradual improvement",
    icon: Heart,
    color: "text-red-600",
    bgColor: "bg-red-50",
    dates: ["2025-08-10", "2025-08-11", "2025-08-12"],
    characteristics: ["Shoulder injury", "Good sleep", "Low fatigue", "Gradual HRV improvement"]
  },
  {
    id: "high-fatigue",
    name: "High Fatigue Period", 
    description: "Overreaching phase with high fatigue and soreness",
    icon: Zap,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    dates: ["2025-08-13", "2025-08-14", "2025-08-15"],
    characteristics: ["High fatigue (7-9)", "Muscle soreness", "Decreased HRV", "Elevated RHR"]
  },
  {
    id: "optimal-recovery",
    name: "Optimal Recovery",
    description: "Well-recovered state with good metrics across the board",
    icon: Moon,
    color: "text-green-600", 
    bgColor: "bg-green-50",
    dates: ["2025-08-16", "2025-08-17", "2025-08-18", "2025-08-19"],
    characteristics: ["Good sleep (8+ hrs)", "Low fatigue", "High HRV", "No soreness"]
  }
]

export function ScenarioSimulator({ onScenarioSelect, onDateSelect, onDailyCheckIn }: ScenarioSimulatorProps) {
  const [selectedScenario, setSelectedScenario] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<string>("")

  const handleScenarioChange = (scenarioId: string) => {
    setSelectedScenario(scenarioId)
    setSelectedDate("") // Reset date when scenario changes
  }

  const handleDateChange = (date: string) => {
    setSelectedDate(date)
    const mockData = recoveryData.find(data => data.date === date)
    if (mockData) {
      onScenarioSelect(mockData)
      onDateSelect(date)
    }
  }

  const selectedScenarioData = scenarios.find(s => s.id === selectedScenario)
  const availableDates = selectedScenarioData?.dates || []

  const getDateData = (date: string) => {
    return recoveryData.find(data => data.date === date)
  }

  const resetSimulation = () => {
    setSelectedScenario("")
    setSelectedDate("")
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-fitness-orange" />
          <h2 className="text-xl font-semibold text-foreground">Scenario Simulator</h2>
        </div>
        {(selectedScenario || selectedDate) && (
          <Button variant="outline" size="sm" onClick={resetSimulation}>
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Test different recovery scenarios using real data patterns from the mock dataset.
        </p>

        {/* Quick Test Buttons */}
        <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg">
          <span className="text-xs font-medium text-muted-foreground self-center">Quick Test:</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              handleScenarioChange("injury-recovery")
              handleDateChange("2025-08-10")
            }}
            className="text-xs"
          >
            Injury Recovery
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              handleScenarioChange("high-fatigue")
              handleDateChange("2025-08-14")
            }}
            className="text-xs"
          >
            High Fatigue
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              handleScenarioChange("optimal-recovery")
              handleDateChange("2025-08-19")
            }}
            className="text-xs"
          >
            Optimal State
          </Button>
        </div>

        {/* Scenario Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Choose Recovery Scenario</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {scenarios.map((scenario) => {
              const Icon = scenario.icon
              const isSelected = selectedScenario === scenario.id
              
              return (
                <div
                  key={scenario.id}
                  onClick={() => handleScenarioChange(scenario.id)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    isSelected 
                      ? `border-fitness-orange ${scenario.bgColor}` 
                      : "border-gray-200 hover:border-gray-300 bg-gray-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Icon className={`h-5 w-5 mt-0.5 ${isSelected ? 'text-fitness-orange' : scenario.color}`} />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm">{scenario.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {scenario.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {scenario.characteristics.map((char, index) => (
                          <Badge 
                            key={index} 
                            variant="secondary" 
                            className="text-xs"
                          >
                            {char}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Date Selection */}
        {selectedScenario && (
          <div className="space-y-3">
            <label className="text-sm font-medium">Select Specific Date</label>
            <Select value={selectedDate} onValueChange={handleDateChange}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a date from this scenario" />
              </SelectTrigger>
              <SelectContent>
                {availableDates.map((date) => {
                  const data = getDateData(date)
                  return (
                    <SelectItem key={date} value={date}>
                      <div className="flex items-center justify-between w-full">
                        <span>{date}</span>
                        {data && (
                          <div className="flex items-center gap-2 ml-4 text-xs text-muted-foreground">
                            <span>Sleep: {data.sleepDuration}h</span>
                            <span>Fatigue: {data.fatigue}/10</span>
                            <span>HRV: {data.HRV}</span>
                          </div>
                        )}
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Selected Data Preview */}
        {selectedDate && (
          <div className="mt-4 p-4 bg-fitness-orange/5 rounded-lg border border-fitness-orange/20">
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Play className="h-4 w-4 text-fitness-orange" />
              Simulating: {selectedDate}
            </h3>
            {(() => {
              const data = getDateData(selectedDate)
              if (!data) return null
              
              return (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4 text-blue-500" />
                    <span>Sleep: <strong>{data.sleepDuration}h</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span>RHR: <strong>{data.RHR} bpm</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-green-500" />
                    <span>HRV: <strong>{data.HRV} ms</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <span>Fatigue: <strong>{data.fatigue}/10</strong></span>
                  </div>
                  
                  {data.soreness && data.soreness.length > 0 && (
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Soreness: </span>
                      {data.soreness.map((area, index) => (
                        <Badge key={index} variant="secondary" className="text-xs ml-1">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {data.injury && data.injury.length > 0 && (
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Injuries: </span>
                      {data.injury.map((injury, index) => (
                        <Badge key={index} variant="destructive" className="text-xs ml-1">
                          {injury}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )
            })()}
          </div>
        )}

        {/* Use for Daily Check-in Button */}
        {selectedDate && onDailyCheckIn && (
          <div className="mt-4 pt-4 border-t border-fitness-orange/20">
            <Button 
              onClick={onDailyCheckIn}
              className="w-full bg-fitness-orange hover:bg-fitness-orange-hover"
              size="lg"
            >
              <Play className="h-4 w-4 mr-2" />
              Use This Data for Daily Check-in
            </Button>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              This will open the daily check-in form pre-filled with the selected scenario data
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}