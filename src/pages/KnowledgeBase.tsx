import { useState, useMemo } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { FileText, Upload, X, ChevronDown, ChevronUp, File } from "lucide-react"
import { capitalize } from "lodash"
import chroma from "chroma-js"
import researchData from "@/mock/research.mock.json"

// Generate pastel colors for paper borders using chroma-js
const generatePastelColors = (papers: ResearchPaper[]) => {
  const colors: Record<string, string> = {}
  
  papers.forEach((paper, index) => {
    const hue = (index * 137.5) % 360
    const saturation = 0.3 + (Math.random() * 0.2)
    const lightness = 0.7 + (Math.random() * 0.2)
    
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

interface UserPaper {
  id: string
  name: string
  file: File
  uploadedAt: Date
}

export default function KnowledgeBase() {
  const [selectedPaper, setSelectedPaper] = useState<ResearchPaper | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showMethodology, setShowMethodology] = useState(true)
  const [showDailyClaims, setShowDailyClaims] = useState(true)
  const [showProgramClaims, setShowProgramClaims] = useState(true)
  const [showRecoveryClaims, setShowRecoveryClaims] = useState(true)
  const [userPapers, setUserPapers] = useState<UserPaper[]>([])

  // Use research data as "Our Picks"
  const ourPicks = researchData.filter(paper => paper.goal === 'endurance')
  const pastelColors = useMemo(() => generatePastelColors(ourPicks), [ourPicks])

  const handlePaperClick = (paper: ResearchPaper) => {
    setSelectedPaper(paper)
    setIsModalOpen(true)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      Array.from(files).forEach(file => {
        const newPaper: UserPaper = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
          file,
          uploadedAt: new Date()
        }
        setUserPapers(prev => [...prev, newPaper])
      })
    }
    // Reset input
    event.target.value = ''
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedPaper(null)
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
          <h1 className="text-4xl font-bold text-foreground mb-2">Knowledge Base</h1>
          <p className="text-muted-foreground text-lg">
            Explore curated research papers and upload your own studies
          </p>
        </div>

        {/* Our Picks Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Our Picks</CardTitle>
            <CardDescription>
              Curated research papers related to your fitness goals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {ourPicks.map((paper: ResearchPaper) => (
                <div
                  key={paper.id}
                  className="p-4 border-2 rounded-lg transition-all duration-200 cursor-pointer hover:bg-accent/50"
                  style={{
                    borderColor: pastelColors[paper.name] || '#888888'
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
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Your Picks Section */}
        <Card>
          <CardHeader>
            <CardTitle>Your Picks</CardTitle>
            <CardDescription>
              Upload and manage your own research papers
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* File Uploader */}
            <div className="mb-6">
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-fitness-orange/50 transition-colors">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-3">
                  Drop files here or click to browse
                </p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Button variant="outline" size="sm" asChild>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    Choose Files
                  </label>
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Supported formats: PDF, DOC, DOCX, TXT
                </p>
              </div>
            </div>

            {/* Uploaded Papers */}
            {userPapers.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {userPapers.map((paper) => (
                  <div
                    key={paper.id}
                    className="p-4 border-2 border-fitness-orange/20 rounded-lg transition-all duration-200"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-fitness-orange/10 rounded-lg flex-shrink-0">
                        <File className="h-4 w-4 text-fitness-orange" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-sm mb-1 line-clamp-2">
                          {paper.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mb-2">
                          Uploaded: {paper.uploadedAt.toLocaleDateString()} • {(paper.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {paper.file.type || 'Unknown format'}
                          </span>
                          <Button variant="ghost" size="sm" className="text-xs h-6 px-2">
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No papers uploaded yet</p>
                <p className="text-sm text-muted-foreground/80">Upload your first research paper to get started</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Research Paper Modal - Modified Layout */}
        <Dialog open={isModalOpen} onOpenChange={closeModal}>
          <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-hidden">
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
              <div className="flex gap-6 h-[calc(90vh-120px)]">
                {/* Left Side - Original Text */}
                <div className="flex-1 overflow-y-auto">
                  <div className="p-4 bg-muted/30 rounded-lg border">
                    <h4 className="font-bold text-lg text-foreground mb-3">Original Text</h4>
                    <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {selectedPaper.originalText}
                    </div>
                  </div>
                </div>

                {/* Right Side - Paper Details */}
                <div className="flex-1 overflow-y-auto space-y-6">
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