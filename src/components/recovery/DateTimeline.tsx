import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { IRecovery } from "@/types/recovery.schema"
import { format, subDays, addDays } from "date-fns"

interface DateTimelineProps {
  selectedDate: string
  onDateSelect: (date: string) => void
  recoveryData: IRecovery[]
}

export function DateTimeline({ selectedDate, onDateSelect, recoveryData }: DateTimelineProps) {
  const today = new Date()
  const selectedDateObj = new Date(selectedDate)
  
  // Generate 7 days around selected date
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(selectedDateObj, 3 - i)
    return date
  })

  const handlePrevious = () => {
    const newDate = subDays(selectedDateObj, 1)
    onDateSelect(newDate.toISOString().split('T')[0])
  }

  const handleNext = () => {
    const nextDate = addDays(selectedDateObj, 1)
    if (nextDate <= today) {
      onDateSelect(nextDate.toISOString().split('T')[0])
    }
  }

  const handleToday = () => {
    onDateSelect(today.toISOString().split('T')[0])
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">Timeline</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevious}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleToday}
            className="h-8 px-3 text-xs"
          >
            Today
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            disabled={addDays(selectedDateObj, 1) > today}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {dates.map((date) => {
          const dateStr = date.toISOString().split('T')[0]
          const hasData = recoveryData.some(data => data.date === dateStr)
          const isSelected = dateStr === selectedDate
          const isToday = dateStr === today.toISOString().split('T')[0]
          
          return (
            <Button
              key={dateStr}
              variant={isSelected ? "default" : "ghost"}
              onClick={() => onDateSelect(dateStr)}
              className={`flex flex-col items-center p-3 h-auto w-full ${
                isSelected ? "bg-fitness-orange text-fitness-orange-foreground" : ""
              }`}
            >
              <span className="text-xs font-medium">
                {format(date, "EEE")}
              </span>
              <span className="text-lg font-bold">
                {format(date, "dd")}
              </span>
              {isToday && (
                <span className="text-xs text-fitness-orange font-medium">Today</span>
              )}
              {hasData && !isSelected && (
                <div className="w-1.5 h-1.5 bg-fitness-orange rounded-full mt-1" />
              )}
            </Button>
          )
        })}
      </div>
    </Card>
  )
}