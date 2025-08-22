import { useState, useMemo, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import { capitalize } from "lodash"
import chroma from "chroma-js"
import researchData from "@/mock/research.mock.json"
import { DateUtils, CONFIDENCE_DATA, TODAY, IResearchPaperConfidenceScore } from "@/utils"
import { ResearchPaper } from "@/components/ResearchPaper"
import { IResearchClaim } from "@/types/research.schema"

// Generate confidence data from real-time confidence scores
const generateConfidenceDataFromReal = (papers: IResearchClaim[], realTimeData: IResearchPaperConfidenceScore[]) => {
  // Get all unique dates from real-time data, sorted chronologically
  const allDates = [...new Set(realTimeData.map(item => item.date))].sort()
  
  return allDates.map(date => {
    const dataPoint: any = { date }
    papers.forEach((paper) => {
      // Find the confidence score for this paper and date
      const confidenceScore = realTimeData.find(
        item => item.paperId === paper.id && item.date === date
      )
      dataPoint[paper.name] = confidenceScore ? confidenceScore.score : 0.75 // fallback score
    })
    return dataPoint
  })
}

// Generate vibrant colors for chart lines using chroma-js
const generateChartColors = (papers: IResearchClaim[]) => {
  const colors: Record<string, string> = {}
  
  papers.forEach((paper, index) => {
    // Generate a random hue and create a vibrant color for chart lines
    const hue = (index * 137.5) % 360 // Golden angle for good distribution
    const saturation = 0.7 + (Math.random() * 0.3) // 70-100% saturation for vibrant colors
    const lightness = 0.4 + (Math.random() * 0.2) // 40-60% lightness for good contrast
    
    colors[paper.name] = chroma.hsl(hue, saturation, lightness).hex()
  })
  
  return colors
}

// Generate pastel colors for paper borders using chroma-js
const generatePastelColors = (papers: IResearchClaim[]) => {
  const colors: Record<string, string> = {}
  
  papers.forEach((paper, index) => {
    // Generate a random hue and create a pastel color for borders
    const hue = (index * 137.5) % 360 // Golden angle for good distribution
    const saturation = 0.3 + (Math.random() * 0.2) // 30-50% saturation for pastel
    const lightness = 0.7 + (Math.random() * 0.2) // 70-90% lightness for pastel
    
    colors[paper.name] = chroma.hsl(hue, saturation, lightness).hex()
  })
  
  return colors
}

export default function ResearchConfidence() {
  const [selectedPaper, setSelectedPaper] = useState<IResearchClaim | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [hoveredPaper, setHoveredPaper] = useState<string | null>(null)
  const [realTimeConfidenceData, setRealTimeConfidenceData] = useState<IResearchPaperConfidenceScore[]>([])

  const data = researchData.filter(paper => paper.goal === 'endurance') as IResearchClaim[]
  
  // Subscribe to TODAY changes to refresh confidence data when simulations run
  useEffect(() => {
    const updateConfidenceData = () => {
      setRealTimeConfidenceData(CONFIDENCE_DATA.getData())
    }
    
    // Initial load
    updateConfidenceData()
    
    // Subscribe to TODAY changes (when simulations run)
    const unsubscribe = TODAY._subscribe(updateConfidenceData)
    
    return unsubscribe
  }, [])
  
  const confidenceData = generateConfidenceDataFromReal(data, realTimeConfidenceData)
  const chartColors = useMemo(() => generateChartColors(data), [data])
  const pastelColors = useMemo(() => generatePastelColors(data), [data])

  const handlePaperClick = (paper: IResearchClaim) => {
    setSelectedPaper(paper)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedPaper(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16">
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Research Confidence</h1>
          <p className="text-muted-foreground text-lg">
            Track the accuracy and confidence of AI predictions based on scientific research
          </p>
        </div>

        {/* Confidence Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Prediction Confidence Over Time</CardTitle>
            <CardDescription>
              Daily confidence scores showing how accurate our AI predictions are based on research validation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={confidenceData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis 
                    dataKey="date" 
                    className="text-muted-foreground"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => DateUtils.toDisplayString(value)}
                  />
                  <YAxis 
                    domain={[0.7, 0.9]}
                    className="text-muted-foreground"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => value.toFixed(2)}
                  />

                  {data.map((paper) => {
                    const color = chartColors[paper.name] || '#888888'
                    return (
                      <Line 
                        key={paper.name}
                        type="monotone" 
                        dataKey={paper.name} 
                        stroke={color} 
                        strokeWidth={hoveredPaper === paper.name ? 5 : 3}
                        dot={{ fill: color, strokeWidth: 2, r: hoveredPaper === paper.name ? 6 : 4 }}
                        activeDot={{ r: 8, stroke: color, strokeWidth: 2 }}
                        onMouseEnter={() => setHoveredPaper(paper.name)}
                        onMouseLeave={() => setHoveredPaper(null)}
                      />
                    )
                  })}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Research Papers Section */}
        <Card>
          <CardHeader>
            <CardTitle>Supporting Research Papers</CardTitle>
            <CardDescription>
              Scientific studies that inform our AI predictions and suggestions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {data.map((paper: IResearchClaim) => {
                const isHighlighted = hoveredPaper === paper.name
                
                return (
                  <div
                    key={paper.id}
                    className={`transition-all duration-200 ${
                      isHighlighted 
                        ? 'shadow-lg scale-105' 
                        : ''
                    }`}
                    onMouseEnter={() => setHoveredPaper(paper.name)}
                    onMouseLeave={() => setHoveredPaper(null)}
                  >
                    <ResearchPaper
                      mode="card"
                      paper={paper}
                      borderColor={pastelColors[paper.name]}
                      onClick={handlePaperClick}
                    />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Research Paper Modal */}
        {selectedPaper && (
          <ResearchPaper
            mode="modal"
            paper={selectedPaper}
            isOpen={isModalOpen}
            onClose={closeModal}
          />
        )}
      </main>
      </div>
    </div>
  )
}