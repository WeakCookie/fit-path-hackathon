import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Moon, 
  Heart, 
  Activity, 
  Zap, 
  AlertTriangle,
  Smartphone
} from "lucide-react"
import { IRecovery } from "@/types/recovery.schema"

interface ReadinessSectionProps {
  data?: IRecovery
  date: string
}

export function ReadinessSection({ data, date }: ReadinessSectionProps) {
  if (!data) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Readiness</h2>
        <p className="text-muted-foreground">No data available for {date}</p>
      </Card>
    )
  }

  const getScoreColor = (score: number, type: 'sleep' | 'rhr' | 'hrv' | 'fatigue') => {
    if (type === 'sleep') {
      if (score >= 8) return "bg-green-500"
      if (score >= 7) return "bg-yellow-500"
      return "bg-red-500"
    }
    if (type === 'rhr') {
      if (score <= 60) return "bg-green-500"
      if (score <= 70) return "bg-yellow-500"
      return "bg-red-500"
    }
    if (type === 'hrv') {
      if (score >= 60) return "bg-green-500"
      if (score >= 40) return "bg-yellow-500"
      return "bg-red-500"
    }
    if (type === 'fatigue') {
      if (score <= 3) return "bg-green-500"
      if (score <= 6) return "bg-yellow-500"
      return "bg-red-500"
    }
    return "bg-gray-500"
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-foreground mb-6">Readiness</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Sleep Duration */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Moon className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium text-muted-foreground">Sleep Duration</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getScoreColor(data.sleepDuration || 0, 'sleep')}`} />
            <span className="text-2xl font-bold text-foreground">
              {data.sleepDuration?.toFixed(1) || 'N/A'}h
            </span>
          </div>
        </div>

        {/* RHR */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-red-500" />
            <span className="text-sm font-medium text-muted-foreground">Resting HR</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getScoreColor(data.RHR || 0, 'rhr')}`} />
            <span className="text-2xl font-bold text-foreground">
              {data.RHR || 'N/A'} bpm
            </span>
          </div>
        </div>

        {/* HRV */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium text-muted-foreground">HRV</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getScoreColor(data.HRV || 0, 'hrv')}`} />
            <span className="text-2xl font-bold text-foreground">
              {data.HRV || 'N/A'} ms
            </span>
          </div>
        </div>

        {/* Fatigue */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium text-muted-foreground">Fatigue Level</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getScoreColor(data.fatigue || 0, 'fatigue')}`} />
            <span className="text-2xl font-bold text-foreground">
              {data.fatigue || 'N/A'}/10
            </span>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="space-y-4">
        {/* Source */}
        <div className="flex items-center gap-2">
          <Smartphone className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Data Source: {data.source}</span>
        </div>

        {/* Soreness */}
        {data.soreness && data.soreness.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Soreness Areas</h3>
            <div className="flex flex-wrap gap-2">
              {data.soreness.map((area, index) => (
                <Badge key={index} variant="secondary" className="bg-yellow-100 text-yellow-800">
                  {area}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Injuries */}
        {data.injury && data.injury.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <h3 className="text-sm font-medium text-muted-foreground">Injuries</h3>
            </div>
            <div className="space-y-1">
              {data.injury.map((injuryItem, index) => (
                <div key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded-md">
                  {injuryItem}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}