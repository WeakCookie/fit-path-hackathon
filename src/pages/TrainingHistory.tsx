import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DateTimeline } from "@/components/recovery/DateTimeline"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Clock, Route, Target, Zap, TrendingUp, TrendingDown, Activity, Info } from "lucide-react"
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToday, TRAINING_DATA } from "@/utils"

const GOAL = "Endurance"

// Get extended training data with additional static entries for demonstration
const getExtendedTrainingData = () => {
  const baseData = TRAINING_DATA.getData()
  const staticExtensions = [
    {
      date: "2025-08-02", 
      exercise: "Interval Training",
      intensity: 9,
      duration: 35 * 60,
      distance: 6,
      pace: 280,
      cadence: 172,
      lactaseThresholdPace: 265,
      aerobicDecoupling: 8.5,
      oneMinHRR: 28,
      efficiencyFactor: 0.68
    },
    {
      date: "2025-08-03",
      exercise: "Easy Run", 
      intensity: 5,
      duration: 30 * 60,
      distance: 5,
      pace: 320,
      cadence: 165,
      lactaseThresholdPace: 275,
      aerobicDecoupling: 7.2,
      oneMinHRR: 24,
      efficiencyFactor: 0.62
    }
  ]
  
  // Combine base data with static extensions, removing duplicates by date
  const allData = [...baseData]
  staticExtensions.forEach(staticEntry => {
    if (!allData.some(entry => entry.date === staticEntry.date)) {
      allData.push(staticEntry)
    }
  })
  
  return allData.sort((a, b) => a.date.localeCompare(b.date))
}

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

const formatPace = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

export default function TrainingHistory() {
  const today = useToday()
  const [selectedDate, setSelectedDate] = useState(today.isoString)
  const [selectedMetric, setSelectedMetric] = useState<'duration' | 'intensity' | 'distance' | 'aerobicDecoupling' | 'pace' | 'efficiencyFactor' | 'lactaseThresholdPace' | 'oneMinHRR' | 'cadence' | 'restTime'>('duration')

  const extendedTrainingData = getExtendedTrainingData()
  const filteredTrainingData = extendedTrainingData.filter(data => data.date <= today.isoString)
  
  const selectedTraining = filteredTrainingData.find(data => data.date === selectedDate)

  // Priority data from JSON with descriptions
  const endurancePriority = {
    duration: {
      priority: 1,
      why: "Primary driver of aerobic adaptations; more time-on-feet builds mitochondria and capillaries."
    },
    intensity: {
      priority: 2,
      why: "Keep RPE low (Zone 1–2) to stay aerobic, maximize fat oxidation, and limit drift."
    },
    distance: {
      priority: 3,
      why: "Tracks volume and complements duration for weekly load without forcing pace."
    },
    aerobicDecoupling: {
      priority: 4,
      why: "Low drift (<=5–7%) indicates strong aerobic durability at steady effort."
    },
    pace: {
      priority: 5,
      why: "Use as a guardrail; keep easy relative to LT to remain aerobic and avoid overreaching."
    },
    efficiencyFactor: {
      priority: 6,
      why: "More speed per heartbeat at easy HR; upward trend signals improving economy."
    },
    lactaseThresholdPace: {
      priority: 7,
      why: "Anchor for training zones; as LT improves, easy pace becomes faster at the same effort."
    },
    oneMinHRR: {
      priority: 8,
      why: "Faster post-exercise HR drop reflects good recovery and readiness for volume."
    },
    cadence: {
      priority: 9,
      why: "Economical turnover reduces impact and energy cost over long durations."
    },
    restTime: {
      priority: 10,
      why: "Minimal role in steady endurance; continuous work sustains aerobic stimulus."
    }
  }

  const metricInfo = {
    duration: { label: "Duration", unit: "min", better: "higher", icon: Clock, priority: 1, description: endurancePriority.duration.why },
    // intensity: { label: "Intensity", unit: "RPE", better: "lower", icon: Zap, priority: 2, description: endurancePriority.intensity.why },
    distance: { label: "Distance", unit: "km", better: "higher", icon: Route, priority: 3, description: endurancePriority.distance.why },
    aerobicDecoupling: { label: "Aerobic Decoupling", unit: "%", better: "lower", icon: Activity, priority: 4, description: endurancePriority.aerobicDecoupling.why },
    pace: { label: "Pace", unit: "min/km", better: "lower", icon: Clock, priority: 5, description: endurancePriority.pace.why },
    efficiencyFactor: { label: "Efficiency Factor", unit: "", better: "higher", icon: TrendingUp, priority: 6, description: endurancePriority.efficiencyFactor.why },
    lactaseThresholdPace: { label: "Lactate Threshold Pace", unit: "min/km", better: "higher", icon: TrendingUp, priority: 7, description: endurancePriority.lactaseThresholdPace.why },
    oneMinHRR: { label: "1-Min Heart Rate Recovery", unit: "bpm", better: "higher", icon: TrendingUp, priority: 8, description: endurancePriority.oneMinHRR.why },
    cadence: { label: "Cadence", unit: "spm", better: "higher", icon: Activity, priority: 9, description: endurancePriority.cadence.why },
    restTime: { label: "Rest Time", unit: "min", better: "lower", icon: Clock, priority: 10, description: endurancePriority.restTime.why }
  }

  // Summary configuration object
  const summaryConfig = [
    // Exercise - Special case, not in priority order
    {
      key: 'exercise',
      label: 'Exercise',
      icon: Target,
      getValue: (training: any) => training.exercise,
      formatValue: (value: any) => value,
      showTooltip: false
    },
    // Priority-based metrics
    {
      key: 'duration',
      label: 'Duration',
      icon: Clock,
      getValue: (training: any) => training.duration,
      formatValue: (value: number) => formatTime(value),
      showTooltip: true,
      priority: 1
    },
    {
      key: 'intensity',
      label: 'Intensity',
      icon: Zap,
      getValue: (training: any) => training.intensity,
      formatValue: (value: number) => `${value} RPE`,
      showTooltip: true,
      priority: 2
    },
    {
      key: 'distance',
      label: 'Distance',
      icon: Route,
      getValue: (training: any) => training.distance,
      formatValue: (value: number) => `${value} km`,
      showTooltip: true,
      priority: 3
    },
    {
      key: 'aerobicDecoupling',
      label: 'Aerobic Decoupling',
      icon: Activity,
      getValue: (training: any) => training.aerobicDecoupling,
      formatValue: (value: number) => `${value}%`,
      showTooltip: true,
      priority: 4
    },
    {
      key: 'pace',
      label: 'Average Pace',
      icon: Clock,
      getValue: (training: any) => training.pace,
      formatValue: (value: number) => `${formatPace(value)} /km`,
      showTooltip: true,
      priority: 5
    },
    {
      key: 'efficiencyFactor',
      label: 'Efficiency Factor',
      icon: TrendingUp,
      getValue: (training: any) => training.efficiencyFactor,
      formatValue: (value: number) => value.toString(),
      showTooltip: true,
      priority: 6
    },
    {
      key: 'lactaseThresholdPace',
      label: 'LT Pace',
      icon: TrendingUp,
      getValue: (training: any) => training.lactaseThresholdPace,
      formatValue: (value: number) => `${formatPace(value)} /km`,
      showTooltip: true,
      priority: 7
    },
    {
      key: 'oneMinHRR',
      label: 'HRR (1 min)',
      icon: TrendingUp,
      getValue: (training: any) => training.oneMinHRR,
      formatValue: (value: number) => `${value} bpm`,
      showTooltip: true,
      priority: 8
    },
    {
      key: 'cadence',
      label: 'Cadence',
      icon: Activity,
      getValue: (training: any) => training.cadence,
      formatValue: (value: number) => `${value} spm`,
      showTooltip: true,
      priority: 9
    }
  ]

  const chartData = filteredTrainingData.map(data => ({
    date: data.date,
    value: (() => {
      switch (selectedMetric) {
        case 'pace':
        case 'lactaseThresholdPace':
          return data[selectedMetric] / 60 // Convert to minutes
        case 'duration':
          return data[selectedMetric] / 60 // Convert to minutes
        case 'restTime':
          return data.restTime || 0 // Default to 0 if not available
        default:
          return data[selectedMetric]
      }
    })()
  }))

  // Summary Card Component
  const SummaryCard = ({ 
    config, 
    training 
  }: { 
    config: typeof summaryConfig[0], 
    training: any 
  }) => {
    const IconComponent = config.icon
    const value = config.getValue(training)
    const formattedValue = config.formatValue(value)
    
    return (
      <div className="flex items-center gap-3 p-4 bg-card rounded-lg border">
        <IconComponent className="h-5 w-5 text-fitness-orange" />
        <div className="flex-1">
          {config.showTooltip ? (
            <div className="flex items-center gap-1">
              <p className="text-sm text-muted-foreground">{config.label}</p>
              <UITooltip>
                <TooltipTrigger>
                  <Info className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{metricInfo[config.key as keyof typeof metricInfo]?.description}</p>
                </TooltipContent>
              </UITooltip>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{config.label}</p>
          )}
          <p className="font-semibold">{formattedValue}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <Activity className="h-6 w-6 text-fitness-orange" />
                <h1 className="text-3xl font-bold">Training History</h1>
              </div>
              <p className="text-muted-foreground">
                Review your training performance and track progress over time
              </p>
            </div>

            {/* Timeline */}
            <div className="mb-8">
              <DateTimeline 
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                recoveryData={filteredTrainingData.map(data => ({ date: data.date }))}
              />
            </div>

            {/* Summary Section */}
            {selectedTraining && (
              <Card className="shadow-lg border-0 mb-8">
                <CardHeader className="bg-gradient-to-r from-fitness-orange/5 to-fitness-orange-hover/5 border-b border-border/50">
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-1.5 bg-fitness-orange/10 rounded-md">
                      <Target className="h-4 w-4 text-fitness-orange" />
                    </div>
                    Training Summary - {selectedDate}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <TooltipProvider>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {summaryConfig.map((config) => (
                        <SummaryCard 
                          key={config.key}
                          config={config}
                          training={selectedTraining}
                        />
                      ))}
                    </div>
                  </TooltipProvider>
                </CardContent>
              </Card>
            )}

            {/* Performance Metrics */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-fitness-orange/5 to-fitness-orange-hover/5 border-b border-border/50">
                <CardTitle className="flex items-center gap-2">
                  <div className="p-1.5 bg-fitness-orange/10 rounded-md">
                    <TrendingUp className="h-4 w-4 text-fitness-orange" />
                  </div>
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="mb-6 overflow-x-auto">
                  <div className="flex gap-2 min-w-max pb-2">
                    {Object.entries(metricInfo)
                      .sort(([, a], [, b]) => a.priority - b.priority)
                      .map(([key, info]) => {
                        const IconComponent = info.icon
                        return (
                          <Button
                            key={key}
                            variant={selectedMetric === key ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedMetric(key as any)}
                            className="flex items-center gap-2 whitespace-nowrap flex-shrink-0"
                          >
                            <IconComponent className="h-3.5 w-3.5" />
                            {info.label}
                            {info.better === "lower" ? (
                              <TrendingDown className="h-3 w-3 text-green-500" />
                            ) : (
                              <TrendingUp className="h-3 w-3 text-green-500" />
                            )}
                          </Button>
                        )
                      })}
                  </div>
                </div>

                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="date" 
                        className="text-xs"
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <YAxis 
                        className="text-xs"
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        label={{ 
                          value: `${metricInfo[selectedMetric].label} (${metricInfo[selectedMetric].unit})`, 
                          angle: -90, 
                          position: 'insideLeft',
                          style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' }
                        }}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                        formatter={(value: number) => [
                          (() => {
                            switch (selectedMetric) {
                              case 'pace':
                              case 'lactaseThresholdPace':
                                return formatPace(value * 60)
                              case 'duration':
                                return formatTime(value * 60)
                              case 'restTime':
                                return `${value.toFixed(1)} min`
                              default:
                                return value.toFixed(2)
                            }
                          })(),
                          metricInfo[selectedMetric].label
                        ]}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="hsl(var(--fitness-orange))" 
                        strokeWidth={2}
                        dot={{ fill: 'hsl(var(--fitness-orange))', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: 'hsl(var(--fitness-orange))', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold">Why this matters for {GOAL}:</span> {metricInfo[selectedMetric].description}
                    </p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold">Tip:</span> {metricInfo[selectedMetric].better === "lower" ? "Lower" : "Higher"} values indicate better performance for {metricInfo[selectedMetric].label.toLowerCase()}.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}