import { useState, useEffect } from "react"
import { MarkdownRenderer } from "@/components/ui/markdown-renderer"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Send, MessageCircle, Activity, Clock, Heart, Zap, Plus, X, Sparkles } from "lucide-react"

interface ChatInterfaceProps {
  selectedDate: string
  simulatedData?: {
    sleepDuration?: number
    RHR?: number
    HRV?: number
    soreness?: string[]
    fatigue?: number
    source?: string
    injury?: string[]
  } | null
  autoOpenForm?: boolean
}

interface DailyRecoveryData {
  date: string
  sleepDuration: number
  RHR: number
  HRV: number
  soreness: string[]
  fatigue: number
  source: string
  injury: string[]
}

interface DailyRecoveryResponse {
  date: string
  recovery_score: number
  sleep_quality: string
  hrv_status: string
  fatigue_level: string
  ai_analysis: string
  recommendations: string[]
  metrics: {
    sleep_duration: number
    rhr: number
    hrv: number
    fatigue: number
    soreness_count: number
    injury_count: number
  }
}

const commonSorenessAreas = [
  "Lower back", "Upper back", "Shoulders", "Neck", "Quads", "Hamstrings", 
  "Calves", "Glutes", "Arms", "Chest", "Core", "Knees", "Ankles", "Wrists"
]

const commonInjuries = [
  "Knee pain", "Lower back strain", "Shoulder impingement", "Ankle sprain",
  "Hamstring strain", "Tennis elbow", "Wrist pain", "Neck stiffness"
]

const dataSources = [
  "Manual Entry", "Apple Watch", "Garmin", "Fitbit", "Polar", "Oura Ring", 
  "WHOOP", "Samsung Health", "Google Fit", "Other Smartwatch"
]

export function ChatInterface({ selectedDate, simulatedData, autoOpenForm }: ChatInterfaceProps) {
  const [showForm, setShowForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<DailyRecoveryResponse | null>(null)
  const [customSoreness, setCustomSoreness] = useState("")
  const [customInjury, setCustomInjury] = useState("")
  
  const [formData, setFormData] = useState<DailyRecoveryData>({
    date: selectedDate,
    sleepDuration: 8.0,
    RHR: 60,
    HRV: 50,
    soreness: [],
    fatigue: 5,
    source: "Manual Entry",
    injury: []
  })

  // Auto-populate form when simulatedData is provided
  useEffect(() => {
    if (simulatedData) {
      setFormData({
        date: selectedDate,
        sleepDuration: simulatedData.sleepDuration || 8.0,
        RHR: simulatedData.RHR || 60,
        HRV: simulatedData.HRV || 50,
        soreness: Array.isArray(simulatedData.soreness) ? [...simulatedData.soreness] : [],
        fatigue: simulatedData.fatigue || 5,
        source: simulatedData.source || "Manual Entry",
        injury: Array.isArray(simulatedData.injury) ? [...simulatedData.injury] : []
      })
    }
  }, [simulatedData, selectedDate])

  // Auto-open form when requested
  useEffect(() => {
    if (autoOpenForm && simulatedData) {
      setShowForm(true)
    }
  }, [autoOpenForm, simulatedData])

  const handleSimulateData = () => {
    if (simulatedData) {
      // Use provided simulated data with safety checks
      setFormData({
        date: selectedDate,
        sleepDuration: simulatedData.sleepDuration || 8.0,
        RHR: simulatedData.RHR || 60,
        HRV: simulatedData.HRV || 50,
        soreness: Array.isArray(simulatedData.soreness) ? [...simulatedData.soreness] : [],
        fatigue: simulatedData.fatigue || 5,
        source: simulatedData.source || "Manual Entry",
        injury: Array.isArray(simulatedData.injury) ? [...simulatedData.injury] : []
      })
    } else {
      // Default simulation data
      setFormData({
        date: selectedDate,
        sleepDuration: 7.5,
        RHR: 65,
        HRV: 45,
        soreness: ["Lower back", "Shoulders"],
        fatigue: 6,
        source: "Apple Watch",
        injury: ["Lower back strain"]
      })
    }
  }

  const addCustomSoreness = () => {
    if (customSoreness.trim() && !formData.soreness.includes(customSoreness.trim())) {
      setFormData(prev => ({
        ...prev,
        soreness: [...prev.soreness, customSoreness.trim()]
      }))
      setCustomSoreness("")
    }
  }

  const addCustomInjury = () => {
    if (customInjury.trim() && !formData.injury.includes(customInjury.trim())) {
      setFormData(prev => ({
        ...prev,
        injury: [...prev.injury, customInjury.trim()]
      }))
      setCustomInjury("")
    }
  }

  const removeSoreness = (soreness: string) => {
    setFormData(prev => ({
      ...prev,
      soreness: prev.soreness.filter(s => s !== soreness)
    }))
  }

  const removeInjury = (injury: string) => {
    setFormData(prev => ({
      ...prev,
      injury: prev.injury.filter(i => i !== injury)
    }))
  }

  const toggleSoreness = (area: string) => {
    setFormData(prev => ({
      ...prev,
      soreness: prev.soreness.includes(area)
        ? prev.soreness.filter(s => s !== area)
        : [...prev.soreness, area]
    }))
  }

  const toggleInjury = (injury: string) => {
    setFormData(prev => ({
      ...prev,
      injury: prev.injury.includes(injury)
        ? prev.injury.filter(i => i !== injury)
        : [...prev.injury, injury]
    }))
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:8000/daily', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: DailyRecoveryResponse = await response.json()
      console.log('Daily Recovery Response:', result)
      setAnalysisResult(result)
      setShowForm(false)
    } catch (error) {
      console.error('Error submitting daily recovery data:', error)
      alert('Failed to analyze recovery data. Please check if the backend server is running.')
    } finally {
      setIsLoading(false)
    }
  }

  if (showForm) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-fitness-orange" />
            <h2 className="text-xl font-semibold text-foreground">Daily Recovery Check-in</h2>
            {simulatedData && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                Scenario Data Loaded
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSimulateData}
              className="flex items-center gap-1"
            >
              <Sparkles className="h-4 w-4" />
              {simulatedData ? 'Use Scenario Data' : 'Simulate'}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Sleep Duration */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Sleep Duration: {formData.sleepDuration} hours
            </Label>
            <Slider
              value={[formData.sleepDuration]}
              onValueChange={([value]) => setFormData(prev => ({ ...prev, sleepDuration: value }))}
              max={12}
              min={0}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Resting Heart Rate */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Resting Heart Rate: {formData.RHR} bpm
            </Label>
            <Slider
              value={[formData.RHR]}
              onValueChange={([value]) => setFormData(prev => ({ ...prev, RHR: value }))}
              max={120}
              min={40}
              step={1}
              className="w-full"
            />
          </div>

          {/* Heart Rate Variability */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Heart Rate Variability: {formData.HRV} ms
            </Label>
            <Slider
              value={[formData.HRV]}
              onValueChange={([value]) => setFormData(prev => ({ ...prev, HRV: value }))}
              max={100}
              min={10}
              step={1}
              className="w-full"
            />
          </div>

          {/* Fatigue Level */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Fatigue Level: {formData.fatigue}/10
            </Label>
            <Slider
              value={[formData.fatigue]}
              onValueChange={([value]) => setFormData(prev => ({ ...prev, fatigue: value }))}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
          </div>

          {/* Data Source */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Data Source</Label>
            <Select value={formData.source} onValueChange={(value) => setFormData(prev => ({ ...prev, source: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dataSources.map((source) => (
                  <SelectItem key={source} value={source}>
                    {source}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Soreness Areas */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Soreness Areas</Label>
            <div className="grid grid-cols-2 gap-2">
              {commonSorenessAreas.map((area) => (
                <div key={area} className="flex items-center space-x-2">
                  <Checkbox
                    id={`soreness-${area}`}
                    checked={formData.soreness.includes(area)}
                    onCheckedChange={() => toggleSoreness(area)}
                  />
                  <Label htmlFor={`soreness-${area}`} className="text-sm">
                    {area}
                  </Label>
                </div>
              ))}
            </div>
            
            {/* Custom soreness */}
            <div className="flex gap-2">
              <Input
                placeholder="Add custom soreness area"
                value={customSoreness}
                onChange={(e) => setCustomSoreness(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCustomSoreness()}
              />
              <Button type="button" size="sm" onClick={addCustomSoreness}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Selected soreness */}
            {formData.soreness.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.soreness.map((area) => (
                  <Badge key={area} variant="secondary" className="flex items-center gap-1">
                    {area}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeSoreness(area)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Injury Areas */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Current Injuries</Label>
            <div className="grid grid-cols-2 gap-2">
              {commonInjuries.map((injury) => (
                <div key={injury} className="flex items-center space-x-2">
                  <Checkbox
                    id={`injury-${injury}`}
                    checked={formData.injury.includes(injury)}
                    onCheckedChange={() => toggleInjury(injury)}
                  />
                  <Label htmlFor={`injury-${injury}`} className="text-sm">
                    {injury}
                  </Label>
                </div>
              ))}
            </div>
            
            {/* Custom injury */}
            <div className="flex gap-2">
              <Input
                placeholder="Add custom injury"
                value={customInjury}
                onChange={(e) => setCustomInjury(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCustomInjury()}
              />
              <Button type="button" size="sm" onClick={addCustomInjury}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Selected injuries */}
            {formData.injury.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.injury.map((injury) => (
                  <Badge key={injury} variant="destructive" className="flex items-center gap-1">
                    {injury}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeInjury(injury)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button 
            onClick={handleSubmit} 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? 'Analyzing...' : 'Analyze Recovery'}
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="h-5 w-5 text-fitness-orange" />
        <h2 className="text-xl font-semibold text-foreground">Daily Check-in</h2>
      </div>

      {/* Analysis Result */}
      {analysisResult && (
        <ErrorBoundary>
          <div className="mb-6 space-y-4">
          <div className="bg-fitness-orange/10 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Recovery Score</h3>
              <span className="text-3xl font-bold text-fitness-orange">
                {analysisResult.recovery_score}/10
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>Sleep: <strong>{analysisResult.sleep_quality}</strong></div>
              <div>HRV: <strong>{analysisResult.hrv_status}</strong></div>
              <div>Fatigue: <strong>{analysisResult.fatigue_level}</strong></div>
            </div>
          </div>
          
          {/* Recommendations Section */}
          {analysisResult.recommendations && analysisResult.recommendations.length > 0 && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium mb-3 text-green-800">Recommendations</h4>
              <div className="space-y-2">
                {analysisResult.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-3 p-2 bg-green-25 rounded-md">
                    <div className="flex-shrink-0 w-5 h-5 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                      {index + 1}
                    </div>
                    <span className="text-green-800 text-sm leading-relaxed">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* AI Analysis Section */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium mb-3">AI Analysis</h4>
            <div className="text-sm">
              <MarkdownRenderer
                content={analysisResult.ai_analysis || 'No analysis available'}
                colorScheme="blue"
                className="text-sm"
              />
            </div>
          </div>
          </div>
        </ErrorBoundary>
      )}

      {/* Start Check-in Button */}
      <Button onClick={() => setShowForm(true)} className="w-full">
        <Activity className="h-4 w-4 mr-2" />
        Start Daily Check-in
      </Button>
    </Card>
  )
}