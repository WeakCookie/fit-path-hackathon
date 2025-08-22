import { useState, useMemo } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileText, Upload, File } from "lucide-react"
import { ResearchPaper } from "@/components/ResearchPaper"
import { IResearchClaim, IUserPaper } from "@/types/research.schema"
import { generatePastelColors } from "@/utils"
import researchData from "@/mock/research.mock.json"



export default function KnowledgeBase() {
  const [selectedPaper, setSelectedPaper] = useState<IResearchClaim | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [userPapers, setUserPapers] = useState<IUserPaper[]>([])

  // Use research data as "Our Picks"
  const ourPicks = researchData.filter(paper => paper.goal === 'endurance') as IResearchClaim[]
  const pastelColors = useMemo(() => generatePastelColors(ourPicks), [ourPicks])

  const handlePaperClick = (paper: IResearchClaim) => {
    setSelectedPaper(paper)
    setIsModalOpen(true)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      Array.from(files).forEach(file => {
        const newPaper: IUserPaper = {
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
              {ourPicks.map((paper: IResearchClaim) => (
                <ResearchPaper
                  key={paper.id}
                  mode="card"
                  paper={paper}
                  borderColor={pastelColors[paper.name]}
                  onClick={handlePaperClick}
                />
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