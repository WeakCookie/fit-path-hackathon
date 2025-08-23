import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Brain, Calendar, Target } from "lucide-react"
import researchData from "@/mock/research.mock.json"

interface LongtermProgramResponse {
  performanceImprovementExpected: string
  duration: string
  program: WeeklyProgram[]
  research_integration?: ResearchIntegration
  recovery_considerations?: string[]
  success_metrics?: string[]
  adaptation_triggers?: string[]
}

interface WeeklyProgram {
  week: number
  focus: string
  exercises: string[]
  intensity: string
  volume?: string
  frequency?: string
  rest_modifications?: string
  monitoring_focus?: string[]
  notes?: string
}

interface ResearchIntegration {
  paper_title?: string
  key_findings?: string
  implementation?: string
  evidence_level?: string
}

interface ProgramClaims {
  duration: string[]
  performanceImprovementExpected: string[]
  exercises?: string[]
}

export default function Program() {
  const [isLoading, setIsLoading] = useState(false)
  const [programData, setProgramData] = useState<LongtermProgramResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Recovery data from the attached file
  const recoveryData = [
    {
      "date": "2025-08-10",
      "sleepDuration": 8.1,
      "RHR": 58,
      "HRV": 65,
      "soreness": [] as string[],
      "fatigue": 2,
      "source": "Smartwatch Data"
    },
    {
      "date": "2025-08-11",
      "sleepDuration": 7.8,
      "RHR": 59,
      "HRV": 62,
      "soreness": [] as string[],
      "fatigue": 2,
      "source": "Smartwatch Data"
    },
    {
      "date": "2025-08-12",
      "sleepDuration": 8.3,
      "RHR": 57,
      "HRV": 68,
      "soreness": [] as string[],
      "fatigue": 1,
      "source": "Smartwatch Data"
    },
    {
      "date": "2025-08-13",
      "sleepDuration": 7.5,
      "RHR": 62,
      "HRV": 45,
      "soreness": ["legs", "glutes"],
      "fatigue": 7,
      "source": "Smartwatch Data"
    },
    {
      "date": "2025-08-14",
      "sleepDuration": 7.0,
      "RHR": 65,
      "HRV": 38,
      "soreness": ["legs", "back"],
      "fatigue": 9,
      "source": "Smartwatch Data"
    }
  ]

  // Transform research data to match API schema
  const transformToCurrentProgramClaims = () => {
    const allClaims = researchData.map(paper => paper.programClaim as ProgramClaims)
    
    // Combine all claims into the expected format
    const combinedClaims = {
      duration: [] as string[],
      exercises: [] as string[],
      injury_prevention: ["No injuries"] as string[], // Default value
      performance_improvement_expected: [] as string[],
      periodization: ["Progressive"] as string[] // Default value
    }

    allClaims.forEach(claim => {
      if (claim.duration) {
        combinedClaims.duration.push(...claim.duration)
      }
      if (claim.exercises) {
        combinedClaims.exercises.push(...claim.exercises)
      }
      if (claim.performanceImprovementExpected) {
        combinedClaims.performance_improvement_expected.push(...claim.performanceImprovementExpected)
      }
    })

    // Remove duplicates
    combinedClaims.duration = [...new Set(combinedClaims.duration)]
    combinedClaims.exercises = [...new Set(combinedClaims.exercises)]
    combinedClaims.performance_improvement_expected = [...new Set(combinedClaims.performance_improvement_expected)]

    return combinedClaims
  }

  // Transform recovery data to match API schema  
  const transformRecoveryData = () => {
    return recoveryData.map(entry => ({
      date: entry.date,
      fatigue: entry.fatigue,
      hrv: entry.HRV,
      rhr: entry.RHR,
      sleep_duration: entry.sleepDuration,
      soreness: entry.soreness,
      source: entry.source
    }))
  }

  const handleGenerateProgram = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const currentProgramClaims = transformToCurrentProgramClaims()
      const transformedRecoveryData = transformRecoveryData()

      // Prepare the request payload matching the API schema
      const requestPayload = {
        user_id: "123",
        current_program_claims: currentProgramClaims,
        recovery_data: transformedRecoveryData
      }

      console.log("Sending request to AI server:", requestPayload)
      console.log("Current program claims:", currentProgramClaims)
      console.log("Transformed recovery data:", transformedRecoveryData)

      // Make actual API call to the longterm-program-design endpoint
      console.log("About to make fetch request to: http://localhost:8000/longterm-program-design")
      
      const response = await fetch('http://localhost:8000/longterm-program-design', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestPayload)
      })

      console.log("Fetch response received:", response)
      console.log("Response status:", response.status)
      console.log("Response headers:", response.headers)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: LongtermProgramResponse = await response.json()
      console.log("Received response from AI server:", data)
      
      setProgramData(data)
      
    } catch (err) {
      console.error("Error generating program:", err)
      console.error("Error type:", typeof err)
      console.error("Error name:", err instanceof Error ? err.name : 'Unknown')
      console.error("Error stack:", err instanceof Error ? err.stack : 'No stack')
      
      // Provide more specific error messages
      if (err instanceof Error) {
        if (err.message.includes('fetch') || err.message.includes('Failed to fetch')) {
          setError("Unable to connect to AI server. Please ensure the server is running on localhost:8000 and CORS is configured properly.")
        } else if (err.message.includes('HTTP error')) {
          setError(`Server error: ${err.message}. Please check the API endpoint.`)
        } else if (err.name === 'TypeError' && err.message.includes('NetworkError')) {
          setError("Network error: Cannot reach the server. Check if the server is running and accessible.")
        } else {
          setError(`Error: ${err.message}`)
        }
      } else {
        setError("Failed to generate program. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-foreground">Long-term Program Design</h1>
            <p className="text-muted-foreground">
              Generate a personalized training program based on research findings and your recovery data
            </p>
          </div>

          {/* Generate Program Button */}
          <div className="flex justify-center">
            <Button 
              onClick={handleGenerateProgram}
              disabled={isLoading}
              size="lg"
              className="min-w-[200px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Program...
                </>
              ) : (
                <>
                  <Brain className="mr-2 h-4 w-4" />
                  Generate Program
                </>
              )}
            </Button>
          </div>

          {/* Error Display */}
          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <p className="text-red-600">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Program Display */}
          {programData && (
            <div className="space-y-6">
              {/* Program Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Program Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Duration</h4>
                      <Badge variant="outline">{programData.duration}</Badge>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Expected Improvement</h4>
                      <p className="text-sm text-muted-foreground">
                        {programData.performanceImprovementExpected}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Program */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Weekly Program Structure
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {programData.program.map((week) => (
                      <div key={week.week} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold">Week {week.week}</h4>
                          <Badge variant="secondary">{week.focus}</Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-muted-foreground">Exercises:</span>
                            <ul className="mt-1 space-y-1">
                              {week.exercises.map((exercise, idx) => (
                                <li key={idx} className="text-sm">• {exercise}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <span className="font-medium text-muted-foreground">Intensity:</span>
                            <p className="mt-1">{week.intensity}</p>
                            
                            {week.volume && (
                              <>
                                <span className="font-medium text-muted-foreground mt-2 block">Volume:</span>
                                <p className="mt-1">{week.volume}</p>
                              </>
                            )}
                          </div>
                          
                          <div>
                            {week.frequency && (
                              <>
                                <span className="font-medium text-muted-foreground">Frequency:</span>
                                <p className="mt-1">{week.frequency}</p>
                              </>
                            )}
                            
                            {week.monitoring_focus && (
                              <>
                                <span className="font-medium text-muted-foreground mt-2 block">Monitor:</span>
                                <ul className="mt-1 space-y-1">
                                  {week.monitoring_focus.map((metric, idx) => (
                                    <li key={idx} className="text-sm">• {metric}</li>
                                  ))}
                                </ul>
                              </>
                            )}
                          </div>
                        </div>
                        
                        {(week.rest_modifications || week.notes) && (
                          <div className="mt-3 pt-3 border-t">
                            {week.rest_modifications && (
                              <p className="text-sm text-amber-600 mb-2">
                                <span className="font-medium">Rest Modifications:</span> {week.rest_modifications}
                              </p>
                            )}
                            {week.notes && (
                              <p className="text-sm text-blue-600">
                                <span className="font-medium">Notes:</span> {week.notes}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Research Integration */}
              {programData.research_integration && (
                <Card>
                  <CardHeader>
                    <CardTitle>Research Integration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h4 className="font-semibold">Paper: {programData.research_integration.paper_title}</h4>
                      <Badge variant="outline" className="mt-1">
                        {programData.research_integration.evidence_level}
                      </Badge>
                    </div>
                    
                    <div>
                      <span className="font-medium text-muted-foreground">Key Findings:</span>
                      <p className="mt-1 text-sm">{programData.research_integration.key_findings}</p>
                    </div>
                    
                    <div>
                      <span className="font-medium text-muted-foreground">Implementation:</span>
                      <p className="mt-1 text-sm">{programData.research_integration.implementation}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Additional Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recovery Considerations */}
                {programData.recovery_considerations && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Recovery Considerations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {programData.recovery_considerations.map((consideration, idx) => (
                          <li key={idx} className="text-sm flex items-start">
                            <span className="text-fitness-orange mr-2">•</span>
                            {consideration}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Success Metrics */}
                {programData.success_metrics && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Success Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {programData.success_metrics.map((metric, idx) => (
                          <li key={idx} className="text-sm flex items-start">
                            <span className="text-green-500 mr-2">✓</span>
                            {metric}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Adaptation Triggers */}
              {programData.adaptation_triggers && (
                <Card>
                  <CardHeader>
                    <CardTitle>Program Adaptation Triggers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Modify the program when any of these conditions occur:
                    </p>
                    <ul className="space-y-2">
                      {programData.adaptation_triggers.map((trigger, idx) => (
                        <li key={idx} className="text-sm flex items-start">
                          <span className="text-yellow-500 mr-2">⚠</span>
                          {trigger}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
