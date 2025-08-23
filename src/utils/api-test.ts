// Simple utility to test backend API connectivity
export const testBackendConnection = async () => {
  try {
    const response = await fetch('http://localhost:8000/health', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (response.ok) {
      const result = await response.json()
      console.log('Backend health check successful:', result)
      return true
    } else {
      console.error('Backend health check failed:', response.status, response.statusText)
      return false
    }
  } catch (error) {
    console.error('Backend connection error:', error)
    return false
  }
}

// Test sample daily data
export const testDailyAPI = async () => {
  const sampleData = {
    date: "2024-08-23",
    sleepDuration: 7.5,
    RHR: 65,
    HRV: 45,
    soreness: ["Lower back", "Shoulders"],
    fatigue: 6,
    source: "Manual Entry",
    injury: []
  }

  try {
    console.log('Testing daily API with sample data:', sampleData)
    const response = await fetch('http://localhost:8000/daily', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sampleData)
    })

    if (response.ok) {
      const result = await response.json()
      console.log('Daily API test successful:', result)
      return result
    } else {
      const errorText = await response.text()
      console.error('Daily API test failed:', response.status, errorText)
      return null
    }
  } catch (error) {
    console.error('Daily API connection error:', error)
    return null
  }
}

// Test sample long-term data  
export const testLongTermAPI = async () => {
  const sampleData = {
    age: 28,
    height: "175cm",
    weight: "70kg",
    sex: "Male",
    emotional_well: "Fair - Moderate stress levels",
    medical_history: "Minor knee injury 2 years ago, no current issues",
    sleep_quality: "Poor - Frequent sleep disruptions",
    fatigue: "High - Often tired",
    soreness: "Moderate - Noticeable soreness",
    rhr: 65,
    hrv: 35,
    training_profile: "Weight training 4x/week, running 2x/week",
    nutrition: "Irregular meal timing, high processed foods",
    hydration: "1-2 liters per day, mostly coffee",
    sleep_duration: 5.5,
    rest_days: 1,
    stretching: 2,
    previous_recovery_plan: "None",
    working_hour: 10,
    frequent_travel: 5
  }

  try {
    console.log('Testing long-term API with sample data:', sampleData)
    const response = await fetch('http://localhost:8000/longterm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sampleData)
    })

    if (response.ok) {
      const result = await response.json()
      console.log('Long-term API test successful:', result)
      // Log the structure to verify array fields
      console.log('Weekly schedule type:', typeof result.weekly_schedule, result.weekly_schedule)
      console.log('Action items type:', typeof result.action_items, result.action_items)
      return result
    } else {
      const errorText = await response.text()
      console.error('Long-term API test failed:', response.status, errorText)
      return null
    }
  } catch (error) {
    console.error('Long-term API connection error:', error)
    return null
  }
}