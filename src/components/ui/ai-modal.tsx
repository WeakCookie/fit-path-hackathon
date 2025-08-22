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
}

export function AIModal({ isOpen, onClose, type, title, reasoning }: AIModalProps) {
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
        
        <div className="mt-4">
          <div className={`p-4 rounded-lg ${bgClass} border border-border/50`}>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {reasoning}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}