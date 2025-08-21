import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ImportDataModal } from "./ImportDataModal"
import { IRecovery } from "@/types/recovery.schema"
import { Upload } from "lucide-react"

interface DetailsSectionProps {
  recoveryData: IRecovery[]
}

export function DetailsSection({ recoveryData }: DetailsSectionProps) {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)

  const formatChartData = (metric: 'sleepDuration' | 'RHR' | 'HRV' | 'fatigue') => {
    return recoveryData
      .filter(data => data[metric] !== undefined)
      .map(data => ({
        date: data.date,
        value: data[metric],
        displayDate: new Date(data.date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  const chartConfig = {
    sleepDuration: {
      color: "#3b82f6",
      name: "Sleep Duration (hours)",
      unit: "h"
    },
    RHR: {
      color: "#ef4444", 
      name: "Resting Heart Rate",
      unit: " bpm"
    },
    HRV: {
      color: "#10b981",
      name: "Heart Rate Variability", 
      unit: " ms"
    },
    fatigue: {
      color: "#f59e0b",
      name: "Fatigue Level",
      unit: "/10"
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Details</h2>
        <Button
          onClick={() => setIsImportModalOpen(true)}
          className="bg-fitness-orange hover:bg-fitness-orange-hover text-fitness-orange-foreground"
        >
          <Upload className="h-4 w-4 mr-2" />
          Import Data
        </Button>
      </div>

      <Tabs defaultValue="sleepDuration" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sleepDuration">Sleep Duration</TabsTrigger>
          <TabsTrigger value="RHR">RHR</TabsTrigger>
          <TabsTrigger value="HRV">HRV</TabsTrigger>
          <TabsTrigger value="fatigue">Fatigue</TabsTrigger>
        </TabsList>
        
        {(Object.keys(chartConfig) as Array<keyof typeof chartConfig>).map((metric) => (
          <TabsContent key={metric} value={metric} className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-foreground">
                  {chartConfig[metric].name}
                </h3>
                <div className="text-sm text-muted-foreground">
                  Last 10 days trend
                </div>
              </div>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={formatChartData(metric)}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="displayDate" 
                      tick={{ fontSize: 12 }}
                      tickMargin={8}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickMargin={8}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                      formatter={(value) => [`${value}${chartConfig[metric].unit}`, chartConfig[metric].name]}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={chartConfig[metric].color}
                      strokeWidth={2}
                      dot={{ fill: chartConfig[metric].color, strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: chartConfig[metric].color }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-1">Average</div>
                  <div className="text-lg font-semibold text-foreground">
                    {formatChartData(metric).length > 0 
                      ? (formatChartData(metric).reduce((sum, item) => sum + (item.value || 0), 0) / formatChartData(metric).length).toFixed(1)
                      : 'N/A'
                    }{chartConfig[metric].unit}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-1">Highest</div>
                  <div className="text-lg font-semibold text-foreground">
                    {formatChartData(metric).length > 0 
                      ? Math.max(...formatChartData(metric).map(item => item.value || 0)).toFixed(1)
                      : 'N/A'
                    }{chartConfig[metric].unit}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-1">Lowest</div>
                  <div className="text-lg font-semibold text-foreground">
                    {formatChartData(metric).length > 0 
                      ? Math.min(...formatChartData(metric).map(item => item.value || 0)).toFixed(1)
                      : 'N/A'
                    }{chartConfig[metric].unit}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <ImportDataModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />
    </Card>
  )
}