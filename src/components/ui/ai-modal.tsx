import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, Brain, Target } from "lucide-react"

interface AIModalProps {
  isOpen: boolean
  onClose: () => void
  type: "prediction" | "suggestion"
  title: string
  reasoning: string
  paperId?: string
  reference?: string
}

export function AIModal({ isOpen, onClose, type, title, reasoning, paperId, reference }: AIModalProps) {
  const Icon = type === "prediction" ? Brain : Target
  const colorClass = type === "prediction" ? "text-prediction-gray" : "text-fitness-orange"
  const bgClass = type === "prediction" ? "bg-prediction-gray/10" : "bg-fitness-orange/10"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center gap-3">
          <div className={`p-2.5 rounded-lg ${bgClass}`}>
            <Icon className={`h-5 w-5 ${colorClass}`} />
          </div>
          <DialogTitle className="text-lg font-semibold">
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          {/* Paper Information Section - only show for predictions with paper data */}
          {type === "prediction" && (paperId || reference) && (
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <h4 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Research Paper Information
              </h4>
              <div className="space-y-2">
                {paperId && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-blue-700 bg-blue-100 px-2 py-1 rounded">
                      Paper ID
                    </span>
                    <span className="text-sm text-blue-800 font-medium">
                      Paper {paperId}
                    </span>
                  </div>
                )}
                {reference && (
                  <div>
                    <span className="text-xs font-medium text-blue-700 bg-blue-100 px-2 py-1 rounded inline-block mb-1">
                      Reference
                    </span>
                    <p className="text-sm text-blue-800 italic">
                      {reference}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reasoning Section */}
          <div className={`p-4 rounded-lg ${bgClass} border border-border/50`}>
            <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Icon className={`h-4 w-4 ${colorClass}`} />
              {type === "prediction" ? "Prediction Reasoning" : "Recommendation Reasoning"}
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {reasoning}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}