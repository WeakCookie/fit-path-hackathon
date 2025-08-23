import { useState } from "react"
import { MarkdownRenderer } from "@/components/ui/markdown-renderer"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Calendar, 
  Clock, 
  Heart, 
  Activity, 
  User, 
  Target, 
  Brain,
  Utensils,
  Bed,
  Briefcase,
  Plane,
  CheckCircle,
  Loader2,
  Sparkles
} from "lucide-react"

interface LongTermRecoveryData {
  age: number
  height: string
  weight: string
  sex: string
  emotional_well: string
  medical_history: string
  sleep_quality: string
  fatigue: string
  soreness: string
  rhr: number
  hrv: number
  training_profile: string
  nutrition: string
  hydration: string
  sleep_duration: number
  rest_days: number
  stretching: number
  previous_recovery_plan: string
  working_hour: number
  frequent_travel: number
}

interface LongTermRecoveryResponse {
  long_term_plan: string
  daily_routine: string
  weekly_schedule: string[]
  action_items: string[]
}

const sexOptions = ["Male", "Female", "Other"]
const emotionalWellOptions = [
  "Excellent - Very positive and energetic",
  "Good - Generally positive with occasional stress",
  "Fair - Moderate stress levels",
  "Poor - High stress and anxiety",
  "Very Poor - Overwhelmed and exhausted"
]

const sleepQualityOptions = [
  "Excellent - Deep, restful sleep",
  "Good - Generally sleep well",
  "Fair - Some difficulty falling/staying asleep",
  "Poor - Frequent sleep disruptions",
  "Very Poor - Chronic insomnia"
]

const fatigueOptions = [
  "Very Low - Full of energy",
  "Low - Good energy levels",
  "Moderate - Some tiredness",
  "High - Often tired",
  "Very High - Constantly exhausted"
]

const sorenessOptions = [
  "None - No muscle soreness",
  "Mild - Slight soreness after workouts",
  "Moderate - Noticeable soreness",
  "High - Significant soreness",
  "Severe - Persistent muscle pain"
]

export function LongTermRecovery() {
  const [isLoading, setIsLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<LongTermRecoveryResponse | null>(null)
  
  const [formData, setFormData] = useState<LongTermRecoveryData>({
    age: 30,
    height: "175cm",
    weight: "70kg",
    sex: "Male",
    emotional_well: "Good - Generally positive with occasional stress",
    medical_history: "No major medical issues",
    sleep_quality: "Good - Generally sleep well",
    fatigue: "Moderate - Some tiredness",
    soreness: "Mild - Slight soreness after workouts",
    rhr: 60,
    hrv: 50,
    training_profile: "Regular gym workouts 3-4 times per week",
    nutrition: "Balanced diet with occasional processed foods",
    hydration: "2-3 liters of water per day",
    sleep_duration: 7.5,
    rest_days: 2,
    stretching: 3,
    previous_recovery_plan: "None - first time creating a recovery plan",
    working_hour: 8,
    frequent_travel: 2
  })

  const handleSimulateData = () => {
    setFormData({
      age: 28,
      height: "175cm",
      weight: "70kg",
      sex: "Male",
      emotional_well: "Fair - Moderate stress levels",
      medical_history: "Minor knee injury 2 years ago, no current issues",
      sleep_quality: "Poor - Frequent sleep disruptions",
      fatigue: "High - Often tired",
      soreness: "Moderate - Noticeable soreness",
      rhr: 65,
      hrv: 35,
      training_profile: "Weight training 4x/week, running 2x/week, high intensity workouts",
      nutrition: "Irregular meal timing, high processed foods, frequent dining out",
      hydration: "1-2 liters per day, mostly coffee and energy drinks",
      sleep_duration: 5.5,
      rest_days: 1,
      stretching: 2,
      previous_recovery_plan: "Tried basic stretching routine but didn't stick to it",
      working_hour: 10,
      frequent_travel: 5
    })
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:8000/longterm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: LongTermRecoveryResponse = await response.json()
      console.log('Long-term Recovery Response:', result)
      setAnalysisResult(result)
      setShowForm(false)
    } catch (error) {
      console.error('Error submitting long-term recovery data:', error)
      alert('Failed to generate recovery plan. Please check if the backend server is running.')
    } finally {
      setIsLoading(false)
    }
  }

  if (showForm) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-fitness-orange" />
            <h2 className="text-2xl font-semibold text-foreground">Long-Term Recovery Assessment</h2>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSimulateData}
              className="flex items-center gap-1"
            >
              <Sparkles className="h-4 w-4" />
              Simulate
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </div>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
            <TabsTrigger value="training">Training</TabsTrigger>
            <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
            <TabsTrigger value="recovery">Recovery</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Age: {formData.age} years</Label>
                <Slider
                  value={[formData.age]}
                  onValueChange={([value]) => setFormData(prev => ({ ...prev, age: value }))}
                  max={80}
                  min={16}
                  step={1}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Sex</Label>
                <Select value={formData.sex} onValueChange={(value) => setFormData(prev => ({ ...prev, sex: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sexOptions.map((sex) => (
                      <SelectItem key={sex} value={sex}>
                        {sex}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Height</Label>
                <Input
                  value={formData.height}
                  onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                  placeholder="e.g., 175cm or 5'9&quot;"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Weight</Label>
                <Input
                  value={formData.weight}
                  onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                  placeholder="e.g., 70kg or 154lbs"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="health" className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Health Metrics
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Emotional Well-being</Label>
                <Select value={formData.emotional_well} onValueChange={(value) => setFormData(prev => ({ ...prev, emotional_well: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {emotionalWellOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Medical History</Label>
                <Textarea
                  value={formData.medical_history}
                  onChange={(e) => setFormData(prev => ({ ...prev, medical_history: e.target.value }))}
                  placeholder="Any chronic conditions, past injuries, medications, or health concerns..."
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Sleep Quality</Label>
                <Select value={formData.sleep_quality} onValueChange={(value) => setFormData(prev => ({ ...prev, sleep_quality: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sleepQualityOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Fatigue Level</Label>
                <Select value={formData.fatigue} onValueChange={(value) => setFormData(prev => ({ ...prev, fatigue: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fatigueOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Muscle Soreness</Label>
                <Select value={formData.soreness} onValueChange={(value) => setFormData(prev => ({ ...prev, soreness: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sorenessOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Resting Heart Rate: {formData.rhr} bpm</Label>
                  <Slider
                    value={[formData.rhr]}
                    onValueChange={([value]) => setFormData(prev => ({ ...prev, rhr: value }))}
                    max={120}
                    min={40}
                    step={1}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Heart Rate Variability: {formData.hrv} ms</Label>
                  <Slider
                    value={[formData.hrv]}
                    onValueChange={([value]) => setFormData(prev => ({ ...prev, hrv: value }))}
                    max={100}
                    min={10}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="training" className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Target className="h-5 w-5" />
              Training Profile
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Training Profile</Label>
                <Textarea
                  value={formData.training_profile}
                  onChange={(e) => setFormData(prev => ({ ...prev, training_profile: e.target.value }))}
                  placeholder="Describe your training routine: frequency, type of exercises, intensity, goals, experience level..."
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Nutrition Habits</Label>
                <Textarea
                  value={formData.nutrition}
                  onChange={(e) => setFormData(prev => ({ ...prev, nutrition: e.target.value }))}
                  placeholder="Describe your eating habits: meal timing, food types, supplements, dietary restrictions..."
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Hydration Habits</Label>
                <Textarea
                  value={formData.hydration}
                  onChange={(e) => setFormData(prev => ({ ...prev, hydration: e.target.value }))}
                  placeholder="Daily water intake, other beverages, hydration timing around workouts..."
                  rows={2}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="lifestyle" className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Lifestyle Factors
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Working Hours per Day: {formData.working_hour} hours</Label>
                <Slider
                  value={[formData.working_hour]}
                  onValueChange={([value]) => setFormData(prev => ({ ...prev, working_hour: value }))}
                  max={16}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Travel Days per Month: {formData.frequent_travel} days</Label>
                <Slider
                  value={[formData.frequent_travel]}
                  onValueChange={([value]) => setFormData(prev => ({ ...prev, frequent_travel: value }))}
                  max={20}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="recovery" className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Bed className="h-5 w-5" />
              Recovery Habits
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Average Sleep Duration: {formData.sleep_duration} hours</Label>
                <Slider
                  value={[formData.sleep_duration]}
                  onValueChange={([value]) => setFormData(prev => ({ ...prev, sleep_duration: value }))}
                  max={12}
                  min={4}
                  step={0.1}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Rest Days per Week: {formData.rest_days} days</Label>
                <Slider
                  value={[formData.rest_days]}
                  onValueChange={([value]) => setFormData(prev => ({ ...prev, rest_days: value }))}
                  max={7}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Stretching/Mobility Days per Week: {formData.stretching} days</Label>
                <Slider
                  value={[formData.stretching]}
                  onValueChange={([value]) => setFormData(prev => ({ ...prev, stretching: value }))}
                  max={7}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Previous Recovery Plan</Label>
                <Textarea
                  value={formData.previous_recovery_plan}
                  onChange={(e) => setFormData(prev => ({ ...prev, previous_recovery_plan: e.target.value }))}
                  placeholder="Describe any previous recovery routines, what worked, what didn't work..."
                  rows={3}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 pt-4 border-t">
          <Button 
            onClick={handleSubmit} 
            className="w-full" 
            disabled={isLoading}
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating Your Recovery Plan...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                Generate Long-Term Recovery Plan
              </>
            )}
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-5 w-5 text-fitness-orange" />
        <h2 className="text-2xl font-semibold text-foreground">Long-Term Recovery</h2>
      </div>

      {/* Analysis Result */}
      {analysisResult && (
        <ErrorBoundary>
          <div className="mb-6 space-y-6">
          <div className="bg-fitness-orange/10 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
              Your Personalized Recovery Plan
            </h3>
            <p className="text-sm text-muted-foreground">
              Generated based on your comprehensive health and lifestyle assessment
            </p>
          </div>

          <Tabs defaultValue="longterm" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="longterm">Long-Term Strategy</TabsTrigger>
              <TabsTrigger value="daily">Daily Routine</TabsTrigger>
              <TabsTrigger value="weekly">Weekly Schedule</TabsTrigger>
              <TabsTrigger value="actions">Action Items</TabsTrigger>
            </TabsList>

            <TabsContent value="longterm" className="mt-4">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  3-6 Month Recovery Strategy
                </h4>
                <div className="prose prose-sm max-w-none text-sm">
                  <MarkdownRenderer
                    content={analysisResult.long_term_plan || 'No long-term plan available'}
                    colorScheme="blue"
                    className="text-sm"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="daily" className="mt-4">
              <div className="bg-green-50 p-6 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-green-600" />
                  Daily Recovery Routine
                </h4>
                <div className="prose prose-sm max-w-none text-sm">
                  <MarkdownRenderer
                    content={analysisResult.daily_routine || 'No daily routine available'}
                    colorScheme="green"
                    className="text-sm"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="weekly" className="mt-4">
              <div className="bg-purple-50 p-6 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  Weekly Recovery Schedule
                </h4>
                <div className="prose prose-sm max-w-none text-sm">
                  {analysisResult.weekly_schedule && analysisResult.weekly_schedule.length > 0 ? (
                    <div className="space-y-2">
                      {analysisResult.weekly_schedule.map((item, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <span className="text-purple-600 font-medium min-w-fit">•</span>
                          <MarkdownRenderer
                            content={item}
                            colorScheme="purple"
                            className="text-sm flex-1"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No weekly schedule available</p>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="actions" className="mt-4">
              <div className="bg-orange-50 p-6 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-orange-600" />
                  Action Items & Milestones
                </h4>
                <div className="prose prose-sm max-w-none text-sm">
                  {analysisResult.action_items && analysisResult.action_items.length > 0 ? (
                    <div className="space-y-3">
                      {analysisResult.action_items.map((item, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-orange-25 rounded-lg border border-orange-100 action-item-card">
                          <div className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <MarkdownRenderer
                              content={item}
                              colorScheme="orange"
                              className="text-sm"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No action items available</p>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
          </div>
        </ErrorBoundary>
      )}

      {/* Start Assessment Button */}
      {!analysisResult && (
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            Get a comprehensive recovery plan based on your health, training, and lifestyle factors.
          </p>
          <Button onClick={() => setShowForm(true)} size="lg" className="w-full md:w-auto">
            <Brain className="h-4 w-4 mr-2" />
            Start Recovery Assessment
          </Button>
        </div>
      )}

      {/* Generate New Plan Button */}
      {analysisResult && (
        <div className="text-center pt-4 border-t">
          <Button onClick={() => setShowForm(true)} variant="outline">
            <Brain className="h-4 w-4 mr-2" />
            Generate New Plan
          </Button>
        </div>
      )}
    </Card>
  )
}