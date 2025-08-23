import { DailyTrainingSuggestionResponse, IDailyTrainingPrediction } from '@/types/ai.schema'

/**
 * Maps DailyTrainingSuggestionResponse to IDailyTrainingPrediction
 * 
 * This function transforms the AI server response format into the format
 * expected by the frontend components. It extracts the actionable suggestions
 * from the claims and structures them according to the prediction interface.
 * 
 * @param response - The response from the AI server
 * @returns Mapped training prediction object
 */
export function mapDailyTrainingSuggestionToIDailyTrainingPrediction(
  response: DailyTrainingSuggestionResponse
): IDailyTrainingPrediction {
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

  return {
    paperId: String(response.paper_id),
    predictions
  }
}
