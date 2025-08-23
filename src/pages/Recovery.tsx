import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { DateTimeline } from "@/components/recovery/DateTimeline"
import { ChatInterface } from "@/components/recovery/ChatInterface"
import { ReadinessSection } from "@/components/recovery/ReadinessSection"
import { DetailsSection } from "@/components/recovery/DetailsSection"
import { useToday, RECOVERY_DATA } from "@/utils"

export default function Recovery() {
  const today = useToday()
  const [selectedDate, setSelectedDate] = useState<string>(
    today.isoString
  )
  
  const recoveryData = RECOVERY_DATA.getData()
  const selectedDayData = recoveryData.find(data => data.date === selectedDate)
  const isToday = selectedDate === today.isoString

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-foreground">Recovery</h1>
            <p className="text-muted-foreground">Track your recovery metrics and daily wellness</p>
          </div>

          {/* Timeline */}
          <DateTimeline 
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            recoveryData={recoveryData}
          />

          {/* Chat Interface - Only show for today */}
          {isToday && (
            <ChatInterface selectedDate={selectedDate} />
          )}

          {/* Readiness Section */}
          <ReadinessSection data={selectedDayData} date={selectedDate} />

          {/* Details Section */}
          <DetailsSection recoveryData={recoveryData} />
        </div>
      </main>
    </div>
  )
}