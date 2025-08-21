import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  Watch,
  Smartphone,
  Activity,
  Heart,
  MapPin,
  Bluetooth
} from "lucide-react"

interface ImportDataModalProps {
  isOpen: boolean
  onClose: () => void
}

const importSources = [
  {
    name: "Apple Watch",
    icon: Watch,
    description: "Import health and activity data from Apple Health",
    color: "text-gray-700"
  },
  {
    name: "Garmin",
    icon: Watch,
    description: "Connect your Garmin device for detailed metrics",
    color: "text-blue-600"
  },
  {
    name: "Fitbit",
    icon: Activity,
    description: "Sync sleep, heart rate, and activity data",
    color: "text-teal-600"
  },
  {
    name: "Strava",
    icon: MapPin, 
    description: "Import training activities and performance data",
    color: "text-orange-600"
  },
  {
    name: "Polar",
    icon: Heart,
    description: "Connect Polar devices for heart rate and training data",
    color: "text-red-600"
  },
  {
    name: "Wahoo",
    icon: Bluetooth,
    description: "Import data from Wahoo fitness devices",
    color: "text-blue-500"
  }
]

export function ImportDataModal({ isOpen, onClose }: ImportDataModalProps) {
  const handleConnect = (sourceName: string) => {
    // This would normally handle the actual connection
    console.log(`Connecting to ${sourceName}`)
    // For demo purposes, just close the modal
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Import Recovery Data</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 mt-4">
          <p className="text-sm text-muted-foreground">
            Connect your devices and apps to automatically sync your recovery metrics
          </p>
          
          <div className="grid gap-3">
            {importSources.map((source) => {
              const IconComponent = source.icon
              return (
                <Card 
                  key={source.name}
                  className="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => handleConnect(source.name)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-background ${source.color}`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{source.name}</h3>
                      <p className="text-xs text-muted-foreground">{source.description}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Connect
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
          
          <div className="pt-4 border-t border-border">
            <div className="text-xs text-muted-foreground">
              <p className="mb-2">
                <strong>Supported metrics:</strong> Sleep duration, resting heart rate, 
                heart rate variability, activity levels, and more.
              </p>
              <p>
                Your data is encrypted and secure. You can disconnect any service at any time.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}