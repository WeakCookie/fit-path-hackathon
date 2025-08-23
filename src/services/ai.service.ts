import { 
  DailyTrainingSuggestionRequest, 
  DailyTrainingSuggestionResponse,
  TrainingEntry,
  IDailyTrainingLogForAI,
  EnumTrainingStatus,
  IDailyTrainingPrediction
} from '@/types/ai.schema'
import { IDailyTrainingLog } from '@/types/daily.schema'
import mockAIServerResponse from '../../mock_ai_server_response.json'

export const AI_SERVER_BASE_URL = 'https://8dbc12533f9f.ngrok-free.app'

export class AIService {
  private static instance: AIService
  
  private constructor() {}
  
  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService()
    }
    return AIService.instance
  }

  /**
   * Convert internal training log to AI-compatible format
   */
  private convertToAIFormat(trainingLog: IDailyTrainingLog): IDailyTrainingLogForAI {
    return {
      date: trainingLog.date,
      restTime: trainingLog.restTime,
      exercise: trainingLog.exercise,
      intensity: trainingLog.intensity,
      rep: trainingLog.rep,
      set: trainingLog.set,
      duration: trainingLog.duration,
      distance: trainingLog.distance,
      pace: trainingLog.pace,
      cadence: trainingLog.cadence,
      lactaseThresholdPace: trainingLog.lactaseThresholdPace,
      aerobicDecoupling: trainingLog.aerobicDecoupling,
      oneMinHRR: trainingLog.oneMinHRR,
      efficiencyFactor: trainingLog.efficiencyFactor
    }
  }

  /**
   * Map simulation selections to training entry format
   */
  private mapSimulationToTrainingEntry(
    injuries: string[],
    recoveries: string[]
  ): TrainingEntry {
    // Map training status

    // Map injuries to string
    const injuryStatus = injuries.length > 0 ? injuries.join(', ') : undefined

    // Map recoveries to string  
    const recoveryStatus = recoveries.length > 0 ? recoveries.join(', ') : undefined

    return {
      injury_status: [injuryStatus].filter(Boolean),
      recovery_status: recoveryStatus
    }
  }

  /**
   * Map DailyTrainingSuggestionResponse to IDailyTrainingPrediction
   */
  public mapToTrainingPrediction(response: DailyTrainingSuggestionResponse): IDailyTrainingPrediction {
    const predictions: IDailyTrainingPrediction['predictions'] = {}

    // Process suggestions (claims) to build the prediction object
    response.daily_suggestions.claims.forEach(claim => {
      const value = claim.modified_value
      const reference = claim.reference
      const reasoning = claim.reasoning

      switch (claim.type) {
        case 'exercise':
          predictions.exercise = { 
            value: String(value), 
            reference, 
            reasoning 
          }
          break
        case 'intensity':
          predictions.intensity = { 
            value: Number(value), 
            reference, 
            reasoning 
          }
          break
        case 'duration':
          predictions.duration = { 
            value: Number(value), 
            reference, 
            reasoning 
          }
          break
        case 'rest_time':
          predictions.restTime = { 
            value: Number(value), 
            reference, 
            reasoning 
          }
          break
      }
    })

    // Process predictions to add any additional prediction text
    // Note: The predictions array contains prediction text, but claims contain the actual values
    // The claims are the actionable suggestions, so we use those for the values
    
    return {
      paperId: String(response.paper_id),
      predictions
    }
  }

  /**
   * Get daily training suggestions from AI server
   */
  async getDailyTrainingSuggestion(
    injuries: string[],
    recoveries: string[],
    latestTraining: IDailyTrainingLog,
    userId: string = 'user-001',
    paperId: string
  ): Promise<IDailyTrainingPrediction> {
    // return this.mapToTrainingPrediction(mockAIServerResponse as DailyTrainingSuggestionResponse) as IDailyTrainingPrediction

    try {
      const currentForm = this.mapSimulationToTrainingEntry(injuries, recoveries)
      
      const requestBody: DailyTrainingSuggestionRequest = {
        user_id: userId,
        currentForm,
        paper_id: paperId,
        latestTraining: latestTraining ? this.convertToAIFormat(latestTraining) : undefined
      }

      const response = await fetch(`${AI_SERVER_BASE_URL}/daily-training-suggestion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        throw new Error(`AI server responded with status: ${response.status}`)
      }

      const data: DailyTrainingSuggestionResponse = await response.json()
      return this.mapToTrainingPrediction(data)      
    } catch (error) {
      console.error('Error fetching AI suggestions:', error)
      
      // Provide specific error messages for common issues
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Unable to connect to AI server. Please ensure the server is running on localhost:8000 and CORS is properly configured.')
      }
      
      throw new Error(`Failed to get AI suggestions: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Test connection to AI server
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${AI_SERVER_BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors'
      })
      return response.ok
    } catch (error) {
      console.error('AI server connection test failed:', error)
      return false
    }
  }
}

export const aiService = AIService.getInstance()
