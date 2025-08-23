import { 
  DailyTrainingSuggestionRequest, 
  DailyTrainingSuggestionResponse,
  TrainingEntry,
  IDailyTrainingLogForAI,
  EnumTrainingStatus
} from '@/types/ai.schema'
import { IDailyTrainingLog } from '@/types/daily.schema'

const AI_SERVER_BASE_URL = 'http://localhost:8000'

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
    trainingStatus: string,
    injuries: string[],
    recoveries: string[]
  ): TrainingEntry {
    // Map training status
    let mappedStatus: EnumTrainingStatus
    switch (trainingStatus) {
      case 'performance-up':
        mappedStatus = EnumTrainingStatus.PERFORMANCE_INCREASED
        break
      case 'performance-down':
        mappedStatus = EnumTrainingStatus.PERFORMANCE_DECREASED
        break
      case 'performance-neutral':
        mappedStatus = EnumTrainingStatus.PERFORMANCE_NEUTRAL
        break
      default:
        mappedStatus = EnumTrainingStatus.PERFORMANCE_NEUTRAL
    }

    // Map injuries to string
    const injuryStatus = injuries.length > 0 ? injuries.join(', ') : undefined

    // Map recoveries to string  
    const recoveryStatus = recoveries.length > 0 ? recoveries.join(', ') : undefined

    return {
      training_status: mappedStatus,
      injury_status: injuryStatus,
      recovery_status: recoveryStatus
    }
  }

  /**
   * Get daily training suggestions from AI server
   */
  async getDailyTrainingSuggestion(
    trainingStatus: string,
    injuries: string[],
    recoveries: string[],
    latestTraining?: IDailyTrainingLog,
    userId: string = 'user-001'
  ): Promise<DailyTrainingSuggestionResponse> {
    try {
      const currentForm = this.mapSimulationToTrainingEntry(trainingStatus, injuries, recoveries)
      
      const requestBody: DailyTrainingSuggestionRequest = {
        user_id: userId,
        currentForm,
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
      return data
      
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
