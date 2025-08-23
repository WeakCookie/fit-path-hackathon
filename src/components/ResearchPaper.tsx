import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, ChevronDown, ChevronUp } from "lucide-react"
import { IResearchClaim } from "@/types/research.schema"
import { CONFIDENCE_DATA } from "@/utils"
import { capitalize } from "lodash"

const ELIGIBLE_FOR_LONG_TERM_PLANNING_SCORE = 2
const ELIGIBLE_FOR_SUGGESTIONS_SCORE = 2

// Helper function to get confidence badges based on score
const getConfidenceBadges = (paperId: string) => {
  const latestScore = CONFIDENCE_DATA.getLatestScore(paperId)
  console.log("🚀🚀🚀🚀 ~ getConfidenceBadges ~ CONFIDENCE_DATA:", CONFIDENCE_DATA.getLatestScore(paperId))
  if (!latestScore) return []

  const badges = []
  if (latestScore.score > ELIGIBLE_FOR_LONG_TERM_PLANNING_SCORE) {
    badges.push({
      text: "Eligible for Long-term Planning",
      variant: "default" as const,
      className: "bg-green-600 hover:bg-green-700 text-white"
    })
  }
  if (latestScore.score > ELIGIBLE_FOR_SUGGESTIONS_SCORE) {
    badges.push({
      text: "Eligible for Suggestions", 
      variant: "secondary" as const,
      className: "bg-orange-600 hover:bg-orange-700 text-white"
    })
  }
  
  return badges
}

interface ResearchPaperProps {
  paper: IResearchClaim
  mode: 'card' | 'modal'
  borderColor?: string
  isOpen?: boolean
  onClick?: (paper: IResearchClaim) => void
  onClose?: () => void
}

export function ResearchPaper({ 
  paper, 
  mode, 
  borderColor, 
  isOpen = false, 
  onClick, 
  onClose 
}: ResearchPaperProps) {
  const [showMethodology, setShowMethodology] = useState(true)
  const [showDailyClaims, setShowDailyClaims] = useState(true)
  const [showProgramClaims, setShowProgramClaims] = useState(true)
  const [showRecoveryClaims, setShowRecoveryClaims] = useState(true)

  const handleClose = () => {
    onClose?.()
    // Reset all sections to open when closing
    setShowMethodology(true)
    setShowDailyClaims(true)
    setShowProgramClaims(true)
    setShowRecoveryClaims(true)
  }

  if (mode === 'card') {
    const confidenceBadges = getConfidenceBadges(paper.id)
    
    return (
      <div
        className="p-4 border-2 rounded-lg transition-all duration-200 cursor-pointer hover:bg-accent/50"
        style={{
          borderColor: borderColor || '#888888'
        }}
        onClick={() => onClick?.(paper)}
      >
        <div className="flex items-start gap-3">
          <div 
            className="w-4 h-4 rounded-full border-2 border-white shadow-sm flex-shrink-0 mt-1" 
            style={{ backgroundColor: borderColor || '#888888' }}
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-sm mb-1 line-clamp-2">
              {paper.name}
            </h3>
            <p className="text-xs text-muted-foreground mb-2">
              {paper.goal && `Goal: ${capitalize(paper.goal)} • `}Sample: {paper.methodology.sampleSize} participants
            </p>
            
            {/* Confidence Badges */}
            {confidenceBadges.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {confidenceBadges.map((badge, index) => (
                  <Badge 
                    key={index}
                    variant={badge.variant}
                    className={`text-xs ${badge.className}`}
                  >
                    {badge.text}
                  </Badge>
                ))}
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {paper.methodology.participantBackground.nationality?.join(", ")} • {paper.methodology.participantBackground.gender}
              </span>
              <Button variant="ghost" size="sm" className="text-xs h-6 px-2">
                View Details
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (mode === 'modal') {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
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
          
          <div className="flex gap-6 h-[calc(90vh-120px)]">
            {/* Left Side - Original Text */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 bg-muted/30 rounded-lg border">
                <h4 className="font-bold text-lg text-foreground mb-3">Original Text</h4>
                <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {paper.originalText}
                </div>
              </div>
            </div>

            {/* Right Side - Paper Details */}
            <div className="flex-1 overflow-y-auto space-y-6">
              <div>
                <h3 className="font-semibold text-lg text-foreground mb-2">
                  {paper.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {paper.goal && `Goal: ${capitalize(paper.goal)}`}
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
                    <p><strong>Sample Size:</strong> {paper.methodology.sampleSize} participants</p>
                    <p><strong>Gender:</strong> {paper.methodology.participantBackground.gender}</p>
                    <p><strong>Age Range:</strong> {paper.methodology.participantBackground.age.from}-{paper.methodology.participantBackground.age.to} {paper.methodology.participantBackground.age.unit}</p>
                    <p><strong>Height Range:</strong> {paper.methodology.participantBackground.height.from}-{paper.methodology.participantBackground.height.to} {paper.methodology.participantBackground.height.unit}</p>
                    <p><strong>Weight Range:</strong> {paper.methodology.participantBackground.weight.from}-{paper.methodology.participantBackground.weight.to} {paper.methodology.participantBackground.weight.unit}</p>
                    {paper.methodology.participantBackground.experience && (
                      <p><strong>Experience:</strong> {paper.methodology.participantBackground.experience.from}-{paper.methodology.participantBackground.experience.to} {paper.methodology.participantBackground.experience.unit}</p>
                    )}
                    {paper.methodology.participantBackground.nationality && (
                      <p><strong>Nationality:</strong> {paper.methodology.participantBackground.nationality.join(", ")}</p>
                    )}
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
                    {Object.entries(paper.dailyClaim).map(([key, claims]) => 
                      claims && claims.length > 0 && (
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
                      )
                    )}
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
                    {Object.entries(paper.programClaim).map(([key, claims]) => 
                      claims && claims.length > 0 && (
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
                      )
                    )}
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
                    {Object.entries(paper.recoveryClaim).map(([key, claims]) => 
                      claims && claims.length > 0 && (
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
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return null
}
