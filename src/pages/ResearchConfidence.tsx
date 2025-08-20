import { useState, useMemo } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { FileText, X, ChevronDown, ChevronUp } from "lucide-react"
import { capitalize } from "lodash"
import chroma from "chroma-js"
import researchData from "@/mock/research.mock.json"

// Generate confidence data for each research paper
const generateConfidenceData = (papers: ResearchPaper[]) => {
  const dates = [
    '2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05',
    '2024-01-06', '2024-01-07', '2024-01-08', '2024-01-09', '2024-01-10'
  ]
  
  return dates.map(date => {
    const dataPoint: any = { date }
    papers.forEach((paper, index) => {
      // Generate realistic confidence scores based on paper characteristics
      const baseScore = 0.7 + (index * 0.05) // Vary base scores
      const variation = Math.sin(new Date(date).getTime() / 86400000 + index) * 0.1
      dataPoint[paper.name] = Math.max(0.6, Math.min(0.95, baseScore + variation))
    })
    return dataPoint
  })
}

// Generate vibrant colors for chart lines using chroma-js
const generateChartColors = (papers: ResearchPaper[]) => {
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
const generatePastelColors = (papers: ResearchPaper[]) => {
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

interface ResearchPaper {
  id: string
  goal?: string
  name: string
  originalText: string
  methodology: {
    sampleSize: string
    participantBackground: {
      gender: string
      age: { from: number; to: number; unit: string }
      height: { from: number; to: number; unit: string }
      weight: { from: number; to: number; unit: string }
      experience: { from: number; to: number; unit: string }
      nationality: string[]
    }
  }
  dailyClaim: Record<string, string[]>
  recoveryClaim: Record<string, string[]>
  programClaim: Record<string, string[]>
}

export default function ResearchConfidence() {
  const [selectedPaper, setSelectedPaper] = useState<ResearchPaper | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showOriginalText, setShowOriginalText] = useState(false)
  const [showMethodology, setShowMethodology] = useState(true)
  const [showDailyClaims, setShowDailyClaims] = useState(true)
  const [showProgramClaims, setShowProgramClaims] = useState(true)
  const [showRecoveryClaims, setShowRecoveryClaims] = useState(true)
  const [hoveredPaper, setHoveredPaper] = useState<string | null>(null)

  const data = researchData.filter(paper => paper.goal === 'endurance')
  const confidenceData = generateConfidenceData(data)
  const chartColors = useMemo(() => generateChartColors(data), [data])
  const pastelColors = useMemo(() => generatePastelColors(data), [data])

  const handlePaperClick = (paper: ResearchPaper) => {
    setSelectedPaper(paper)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedPaper(null)
    setShowOriginalText(false)
    setShowMethodology(true)
    setShowDailyClaims(true)
    setShowProgramClaims(true)
    setShowRecoveryClaims(true)
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
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
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
              {data.map((paper: ResearchPaper) => {
                const isHighlighted = hoveredPaper === paper.name
                
                return (
                <div
                  key={paper.id}
                  className={`p-4 border-2 rounded-lg transition-all duration-200 cursor-pointer ${
                    isHighlighted 
                      ? 'shadow-lg scale-105 bg-accent/80' 
                      : 'hover:bg-accent/50'
                  }`}
                  style={{
                    borderColor: isHighlighted 
                      ? pastelColors[paper.name] || '#888888'
                      : pastelColors[paper.name] || '#888888'
                  }}
                  onClick={() => handlePaperClick(paper)}
                >
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-4 h-4 rounded-full border-2 border-white shadow-sm flex-shrink-0 mt-1" 
                      style={{ backgroundColor: pastelColors[paper.name] || '#888888' }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-sm mb-1 line-clamp-2">
                        {paper.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-2">
                        {paper.goal && `Goal: ${capitalize(paper.goal)} • `}Sample: {paper.methodology.sampleSize} participants
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {paper.methodology.participantBackground.nationality.join(", ")} • {paper.methodology.participantBackground.gender}
                        </span>
                        <Button variant="ghost" size="sm" className="text-xs h-6 px-2">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )})}
            </div>
          </CardContent>
        </Card>

        {/* Research Paper Modal */}
        <Dialog open={isModalOpen} onOpenChange={closeModal}>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="flex flex-row items-center gap-3">
              <div className="p-2.5 bg-fitness-orange/10 rounded-lg">
                <FileText className="h-5 w-5 text-fitness-orange" />
              </div>
              <div className="flex-1">
                <DialogTitle className="text-lg font-semibold">
                  Research Paper Details
                </DialogTitle>
              </div>
            </DialogHeader>
            
            {selectedPaper && (
              <div className="mt-4 space-y-6">
                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">
                    {selectedPaper.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedPaper.goal && `Goal: ${capitalize(selectedPaper.goal)}`}
                  </p>
                </div>
                
                {/* Methodology Section */}
                <div className="p-4 bg-fitness-orange/5 rounded-lg border-2 border-fitness-orange/20">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-lg text-foreground">Methodology</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowMethodology(!showMethodology)}
                      className="p-1 h-8 w-8"
                    >
                      {showMethodology ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showMethodology ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p><strong>Sample Size:</strong> {selectedPaper.methodology.sampleSize} participants</p>
                      <p><strong>Gender:</strong> {selectedPaper.methodology.participantBackground.gender}</p>
                      <p><strong>Age Range:</strong> {selectedPaper.methodology.participantBackground.age.from}-{selectedPaper.methodology.participantBackground.age.to} {selectedPaper.methodology.participantBackground.age.unit}</p>
                      <p><strong>Height Range:</strong> {selectedPaper.methodology.participantBackground.height.from}-{selectedPaper.methodology.participantBackground.height.to} {selectedPaper.methodology.participantBackground.height.unit}</p>
                      <p><strong>Weight Range:</strong> {selectedPaper.methodology.participantBackground.weight.from}-{selectedPaper.methodology.participantBackground.weight.to} {selectedPaper.methodology.participantBackground.weight.unit}</p>
                      <p><strong>Experience:</strong> {selectedPaper.methodology.participantBackground.experience.from}-{selectedPaper.methodology.participantBackground.experience.to} {selectedPaper.methodology.participantBackground.experience.unit}</p>
                      <p><strong>Nationality:</strong> {selectedPaper.methodology.participantBackground.nationality.join(", ")}</p>
                    </div>
                  </div>
                </div>

                {/* Daily Claims Section */}
                <div className="p-4 bg-fitness-orange/5 rounded-lg border-2 border-fitness-orange/20">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-lg text-foreground">Daily Claims</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowDailyClaims(!showDailyClaims)}
                      className="p-1 h-8 w-8"
                    >
                      {showDailyClaims ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showDailyClaims ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="space-y-3">
                      {Object.entries(selectedPaper.dailyClaim).map(([key, claims]) => (
                        <div key={key}>
                          <h5 className="font-medium text-xs text-foreground mb-2 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </h5>
                          <ul className="list-disc list-inside space-y-1">
                            {claims.map((claim, index) => (
                              <li key={index} className="text-sm text-muted-foreground">
                                {claim}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

                {/* Program Claims Section */}
                <div className="p-4 bg-fitness-orange/5 rounded-lg border-2 border-fitness-orange/20">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-lg text-foreground">Program Claims</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowProgramClaims(!showProgramClaims)}
                      className="p-1 h-8 w-8"
                    >
                      {showProgramClaims ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showProgramClaims ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="space-y-3">
                      {Object.entries(selectedPaper.programClaim).map(([key, claims]) => (
                        <div key={key}>
                          <h5 className="font-medium text-xs text-foreground mb-2 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </h5>
                          <ul className="list-disc list-inside space-y-1">
                            {claims.map((claim, index) => (
                              <li key={index} className="text-sm text-muted-foreground">
                                {claim}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

                {/* Recovery Claims Section */}
                <div className="p-4 bg-fitness-orange/5 rounded-lg border-2 border-fitness-orange/20">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-lg text-foreground">Recovery Claims</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowRecoveryClaims(!showRecoveryClaims)}
                      className="p-1 h-8 w-8"
                    >
                      {showRecoveryClaims ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showRecoveryClaims ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="space-y-3">
                      {Object.entries(selectedPaper.recoveryClaim).map(([key, claims]) => (
                        <div key={key}>
                          <h5 className="font-medium text-xs text-foreground mb-2 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </h5>
                          <ul className="list-disc list-inside space-y-1">
                            {claims.map((claim, index) => (
                              <li key={index} className="text-sm text-muted-foreground">
                                {claim}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

                {/* Original Text Section */}
                <div className="p-4 bg-accent/20 rounded-lg border border-border/50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-lg text-foreground">Original Text</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowOriginalText(!showOriginalText)}
                      className="p-1 h-8 w-8"
                    >
                      {showOriginalText ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showOriginalText ? 'max-h-none opacity-100' : 'max-h-20 opacity-100'}`}>
                    <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                      {selectedPaper.originalText.split('\n\n').map((paragraph, index) => (
                        <p key={index} className={`mb-3 ${!showOriginalText && index >= 1 ? 'hidden' : ''} ${!showOriginalText && index === 0 ? 'line-clamp-3' : ''}`}>
                          {paragraph}
                        </p>
                      ))}
                      {!showOriginalText && (
                        <div className="text-xs text-muted-foreground/70 italic">
                          ... (click to expand full text)
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
      </div>
    </div>
  )
}