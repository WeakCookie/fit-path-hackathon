import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { FileText, X } from "lucide-react"

// Mock data for the confidence chart
const confidenceData = [
  { date: '2024-01-01', score: 0.75 },
  { date: '2024-01-02', score: 0.73 },
  { date: '2024-01-03', score: 0.78 },
  { date: '2024-01-04', score: 0.76 },
  { date: '2024-01-05', score: 0.81 },
  { date: '2024-01-06', score: 0.79 },
  { date: '2024-01-07', score: 0.83 },
  { date: '2024-01-08', score: 0.85 },
  { date: '2024-01-09', score: 0.82 },
  { date: '2024-01-10', score: 0.84 },
]

// Mock research papers data
const researchPapers = [
  {
    id: 1,
    title: "High-Intensity Interval Training and Cardiovascular Health",
    authors: "Smith, J. et al.",
    journal: "Journal of Sports Medicine",
    year: 2023,
    abstract: "This study examines the effects of HIIT on cardiovascular health in adults aged 25-45. Results show significant improvements in VO2 max and cardiac output after 8 weeks of training.",
    confidence: 0.85
  },
  {
    id: 2,
    title: "Optimal Rest Intervals for Strength Training",
    authors: "Johnson, M. & Williams, K.",
    journal: "Strength & Conditioning Research",
    year: 2023,
    abstract: "Analysis of rest interval duration on strength gains. Findings suggest 2-3 minute rest periods optimize performance in compound movements.",
    confidence: 0.78
  },
  {
    id: 3,
    title: "Exercise Duration and Metabolic Response",
    authors: "Davis, L. et al.",
    journal: "Exercise Physiology Quarterly",
    year: 2022,
    abstract: "Investigation into how exercise duration affects metabolic response and fat oxidation rates in trained athletes.",
    confidence: 0.82
  },
  {
    id: 4,
    title: "Injury Prevention Through Progressive Overload",
    authors: "Brown, R. & Taylor, S.",
    journal: "Sports Medicine International",
    year: 2023,
    abstract: "Comprehensive review of progressive overload principles and their role in injury prevention during resistance training.",
    confidence: 0.79
  }
]

interface ResearchPaper {
  id: number
  title: string
  authors: string
  journal: string
  year: number
  abstract: string
  confidence: number
}

export default function ResearchConfidence() {
  const [selectedPaper, setSelectedPaper] = useState<ResearchPaper | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handlePaperClick = (paper: ResearchPaper) => {
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
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => [value.toFixed(3), 'Confidence Score']}
                    labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="hsl(var(--fitness-orange))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--fitness-orange))', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: 'hsl(var(--fitness-orange))', strokeWidth: 2 }}
                  />
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
              {researchPapers.map((paper) => (
                <div
                  key={paper.id}
                  className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => handlePaperClick(paper)}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-fitness-orange/10 rounded-lg flex-shrink-0">
                      <FileText className="h-4 w-4 text-fitness-orange" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-sm mb-1 line-clamp-2">
                        {paper.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-2">
                        {paper.authors} • {paper.journal} ({paper.year})
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          Confidence: {(paper.confidence * 100).toFixed(1)}%
                        </span>
                        <Button variant="ghost" size="sm" className="text-xs h-6 px-2">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Research Paper Modal */}
        <Dialog open={isModalOpen} onOpenChange={closeModal}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader className="flex flex-row items-center gap-3">
              <div className="p-2.5 bg-fitness-orange/10 rounded-lg">
                <FileText className="h-5 w-5 text-fitness-orange" />
              </div>
              <div className="flex-1">
                <DialogTitle className="text-lg font-semibold">
                  Research Paper Details
                </DialogTitle>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto"
                onClick={closeModal}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogHeader>
            
            {selectedPaper && (
              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">
                    {selectedPaper.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedPaper.authors}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedPaper.journal}, {selectedPaper.year}
                  </p>
                </div>
                
                <div className="p-4 bg-accent/20 rounded-lg border border-border/50">
                  <h4 className="font-medium text-sm text-foreground mb-2">Abstract</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedPaper.abstract}
                  </p>
                </div>
                
                <div className="flex items-center gap-4 p-3 bg-fitness-orange/10 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-fitness-orange">
                      {(selectedPaper.confidence * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Confidence Score</div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    This research contributes to our AI's prediction accuracy with high confidence based on peer review and replication studies.
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}