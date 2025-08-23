export enum EnumTrainingStatus {
  PERFORMANCE_INCREASED = "PERFORMANCE_INCREASED",
  PERFORMANCE_DECREASED = "PERFORMANCE_DECREASED", 
  PERFORMANCE_NEUTRAL = "PERFORMANCE_NEUTRAL"
}

export interface TrainingEntry {
  training_status: EnumTrainingStatus
  injury_status?: string
  recovery_status?: string
}

export interface IDailyTrainingLogForAI {
  date: string
  restTime?: number // in seconds
  exercise?: string
  intensity?: number // RPE
  
  // Strength specific
  rep?: number
  set?: number
  
  // Endurance specific
  duration?: number // in seconds
  distance?: number // in kilometers
  pace?: number // in seconds per kilometer
  cadence?: number // in steps per minute
  lactaseThresholdPace?: number // in seconds per kilometer
  aerobicDecoupling?: number // in percent
  oneMinHRR?: number
  efficiencyFactor?: number
}

export interface DailyTrainingSuggestionRequest {
  user_id: string
  currentForm: TrainingEntry // What user is typing
  latestTraining?: IDailyTrainingLogForAI // Most recent completed session
}

export interface AIClaim {
  type: "exercise" | "intensity" | "duration" | "rest_time"
  modified_value: string | number
  reasoning: string
  reference: string
}

export interface DailySuggestions {
  date: string
  claims: AIClaim[]
}

export interface AIPrediction {
  type: "exercise" | "intensity" | "duration" | "rest_time"
  prediction: string | number
}

export interface DailyPredictions {
  date: string
  predictions: AIPrediction[]
}

export interface DailyTrainingSuggestionResponse {
  paper_id: number
  daily_suggestions: DailySuggestions
  daily_predictions: DailyPredictions
}
