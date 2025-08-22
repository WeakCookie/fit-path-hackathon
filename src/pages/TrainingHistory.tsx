import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DateTimeline } from "@/components/recovery/DateTimeline"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Clock, Route, Target, Zap, TrendingUp, TrendingDown, Activity } from "lucide-react"
import trainingData from "@/mock/training.mock"

const mockTrainingData = [
  {
    date: "2025-08-01",
    exercise: "Long Run",
    intensity: 8,
    duration: 45 * 60,
    distance: 8,
    pace: 300,
    cadence: 168,
    lactaseThresholdPace: 270,
    aerobicDecoupling: 9.8,
    oneMinHRR: 26,
    efficiencyFactor: 0.65
  },
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
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedMetric, setSelectedMetric] = useState<'pace' | 'lactaseThresholdPace' | 'aerobicDecoupling' | 'oneMinHRR' | 'efficiencyFactor'>('pace')

  const selectedTraining = mockTrainingData.find(data => data.date === selectedDate)

  const metricInfo = {
    pace: { label: "Pace", unit: "min/km", better: "lower", icon: Clock },
    lactaseThresholdPace: { label: "Lactate Threshold Pace", unit: "min/km", better: "lower", icon: Target },
    aerobicDecoupling: { label: "Aerobic Decoupling", unit: "%", better: "lower", icon: Activity },
    oneMinHRR: { label: "1-Min Heart Rate Recovery", unit: "bpm", better: "higher", icon: TrendingUp },
    efficiencyFactor: { label: "Efficiency Factor", unit: "", better: "higher", icon: TrendingUp }
  }

  const chartData = mockTrainingData.map(data => ({
    date: data.date,
    value: selectedMetric === 'pace' || selectedMetric === 'lactaseThresholdPace' 
      ? data[selectedMetric] / 60 // Convert to minutes
      : data[selectedMetric]
  }))

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
                recoveryData={mockTrainingData.map(data => ({ date: data.date }))}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-card rounded-lg border">
                      <Target className="h-5 w-5 text-fitness-orange" />
                      <div>
                        <p className="text-sm text-muted-foreground">Exercise</p>
                        <p className="font-semibold">{selectedTraining.exercise}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-card rounded-lg border">
                      <Zap className="h-5 w-5 text-fitness-orange" />
                      <div>
                        <p className="text-sm text-muted-foreground">Intensity</p>
                        <p className="font-semibold">{selectedTraining.intensity} RPE</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-card rounded-lg border">
                      <Clock className="h-5 w-5 text-fitness-orange" />
                      <div>
                        <p className="text-sm text-muted-foreground">Duration</p>
                        <p className="font-semibold">{formatTime(selectedTraining.duration)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-card rounded-lg border">
                      <Route className="h-5 w-5 text-fitness-orange" />
                      <div>
                        <p className="text-sm text-muted-foreground">Distance</p>
                        <p className="font-semibold">{selectedTraining.distance} km</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-card rounded-lg border">
                      <Clock className="h-5 w-5 text-fitness-orange" />
                      <div>
                        <p className="text-sm text-muted-foreground">Average Pace</p>
                        <p className="font-semibold">{formatPace(selectedTraining.pace)} /km</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-card rounded-lg border">
                      <Activity className="h-5 w-5 text-fitness-orange" />
                      <div>
                        <p className="text-sm text-muted-foreground">Cadence</p>
                        <p className="font-semibold">{selectedTraining.cadence} spm</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-card rounded-lg border">
                      <TrendingUp className="h-5 w-5 text-fitness-orange" />
                      <div>
                        <p className="text-sm text-muted-foreground">HRR (1 min)</p>
                        <p className="font-semibold">{selectedTraining.oneMinHRR} bpm</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-card rounded-lg border">
                      <Target className="h-5 w-5 text-fitness-orange" />
                      <div>
                        <p className="text-sm text-muted-foreground">Efficiency Factor</p>
                        <p className="font-semibold">{selectedTraining.efficiencyFactor}</p>
                      </div>
                    </div>
                  </div>
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
                <div className="flex flex-wrap gap-2 mb-6">
                  {Object.entries(metricInfo).map(([key, info]) => {
                    const IconComponent = info.icon
                    return (
                      <Button
                        key={key}
                        variant={selectedMetric === key ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedMetric(key as any)}
                        className="flex items-center gap-2"
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
                          selectedMetric === 'pace' || selectedMetric === 'lactaseThresholdPace' 
                            ? formatPace(value * 60)
                            : value.toFixed(2),
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

                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold">Tip:</span> {metricInfo[selectedMetric].better === "lower" ? "Lower" : "Higher"} values indicate better performance for {metricInfo[selectedMetric].label.toLowerCase()}.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}