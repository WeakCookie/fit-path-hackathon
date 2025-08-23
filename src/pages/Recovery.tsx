import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { DateTimeline } from "@/components/recovery/DateTimeline"
import { ChatInterface } from "@/components/recovery/ChatInterface"
import { ReadinessSection } from "@/components/recovery/ReadinessSection"
import { DetailsSection } from "@/components/recovery/DetailsSection"
import { LongTermRecovery } from "@/components/recovery/LongTermRecovery"
import { ScenarioSimulator } from "@/components/recovery/ScenarioSimulator"
import recoveryData from "@/mock/recovery.mock"
import { IRecovery } from "@/types/recovery.schema"
import { useToday } from "@/utils"

export default function Recovery() {
  const today = useToday()
  const [selectedDate, setSelectedDate] = useState<string>(
    today.isoString
  )
  const [simulatedData, setSimulatedData] = useState<IRecovery | null>(null)
  const [isSimulating, setIsSimulating] = useState(false)
  const [autoOpenForm, setAutoOpenForm] = useState(false)
  
  // Use simulated data if available, otherwise use mock data
  const selectedDayData = simulatedData || recoveryData.find(data => data.date === selectedDate)
  const isToday = selectedDate === today.isoString && !isSimulating

  const handleScenarioSelect = (data: IRecovery) => {
    setSimulatedData(data)
    setIsSimulating(true)
  }

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
  }

  const handleTimelineSelect = (date: string) => {
    setSelectedDate(date)
    setSimulatedData(null)
    setIsSimulating(false)
  }

  const handleDailyCheckIn = () => {
    // Set the flag to auto-open the form
    setAutoOpenForm(true)
    
    // Scroll to daily check-in section
    const dailyCheckInElement = document.getElementById('daily-checkin')
    if (dailyCheckInElement) {
      dailyCheckInElement.scrollIntoView({ behavior: 'smooth' })
    }
    
    // Reset the auto-open flag after a short delay
    setTimeout(() => {
      setAutoOpenForm(false)
    }, 1000)
  }

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
            onDateSelect={handleTimelineSelect}
            recoveryData={recoveryData}
          />

          {/* Scenario Simulator */}
          <ScenarioSimulator 
            onScenarioSelect={handleScenarioSelect}
            onDateSelect={handleDateSelect}
            onDailyCheckIn={handleDailyCheckIn}
          />

          {/* Chat Interface - Show for today or when simulating */}
          {(isToday || isSimulating) && (
            <div id="daily-checkin">
              <ChatInterface 
                selectedDate={selectedDate} 
                simulatedData={simulatedData}
                autoOpenForm={autoOpenForm}
              />
            </div>
          )}

          {/* Long Term Recovery Section */}
          <LongTermRecovery />

          {/* Readiness Section */}
          <div className="relative">
            {isSimulating && (
              <div className="absolute -top-2 right-0 z-10">
                <span className="bg-fitness-orange text-white text-xs px-2 py-1 rounded-full">
                  Simulated Data
                </span>
              </div>
            )}
            <ReadinessSection data={selectedDayData} date={selectedDate} />
          </div>

          {/* Details Section */}
          <DetailsSection recoveryData={recoveryData} />
        </div>
      </main>
    </div>
  )
}