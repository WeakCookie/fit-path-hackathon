import { IDailyTrainingLog } from "@/types/daily.schema";

/**
 * Calculates an error score between two training logs
 * Returns a positive score (0-100) where:
 * - Higher scores (closer to 100) indicate high similarity (many correct predictions)
 * - Lower scores (closer to 0) indicate high differences (many wrong predictions)
 * - Negative scores indicate severe mismatches
 * 
 * @param actual - The actual/target training log
 * @param predicted - The predicted/simulated training log
 * @param weights - Optional weights for different metrics (defaults provided)
 * @returns Error score between -100 and 100
 */
export function calculateTrainingLogError(
  actual: IDailyTrainingLog,
  predicted: IDailyTrainingLog,
  weights: Partial<TrainingLogWeights> = {}
): number {
  const defaultWeights: TrainingLogWeights = {
    duration: 0.15,
    distance: 0.15,
    pace: 0.20,
    cadence: 0.10,
    lactaseThresholdPace: 0.15,
    aerobicDecoupling: 0.10,
    oneMinHRR: 0.10,
    efficiencyFactor: 0.05,
    ...weights
  };

  let totalScore = 0;
  let totalWeight = 0;

  // Helper function to calculate individual metric error
  const calculateMetricError = (actualValue: number, predictedValue: number, tolerance: number = 0.1): number => {
    const percentError = Math.abs(actualValue - predictedValue) / actualValue;
    
    if (percentError <= tolerance) {
      // Very good prediction - high positive score
      return 100 - (percentError / tolerance) * 20; // 80-100 points
    } else if (percentError <= tolerance * 2) {
      // Acceptable prediction - moderate positive score
      return 80 - ((percentError - tolerance) / tolerance) * 30; // 50-80 points
    } else if (percentError <= tolerance * 3) {
      // Poor prediction - low positive score
      return 50 - ((percentError - tolerance * 2) / tolerance) * 40; // 10-50 points
    } else if (percentError <= tolerance * 5) {
      // Very poor prediction - near zero or negative
      return 10 - ((percentError - tolerance * 3) / (tolerance * 2)) * 60; // -50 to 10 points
    } else {
      // Extremely poor prediction - heavily penalized
      return -50 - Math.min((percentError - tolerance * 5) * 10, 50); // -100 to -50 points
    }
  };

  // Duration comparison (tolerance: 10%)
  if (actual.duration && predicted.duration) {
    const score = calculateMetricError(actual.duration, predicted.duration, 0.10);
    totalScore += score * defaultWeights.duration;
    totalWeight += defaultWeights.duration;
  }

  // Distance comparison (tolerance: 10%)
  if (actual.distance && predicted.distance) {
    const score = calculateMetricError(actual.distance, predicted.distance, 0.10);
    totalScore += score * defaultWeights.distance;
    totalWeight += defaultWeights.distance;
  }

  // Pace comparison (tolerance: 5% - more strict as it's important)
  if (actual.pace && predicted.pace) {
    const score = calculateMetricError(actual.pace, predicted.pace, 0.05);
    totalScore += score * defaultWeights.pace;
    totalWeight += defaultWeights.pace;
  }

  // Cadence comparison (tolerance: 8%)
  if (actual.cadence && predicted.cadence) {
    const score = calculateMetricError(actual.cadence, predicted.cadence, 0.08);
    totalScore += score * defaultWeights.cadence;
    totalWeight += defaultWeights.cadence;
  }

  // Lactate Threshold Pace comparison (tolerance: 5%)
  if (actual.lactaseThresholdPace && predicted.lactaseThresholdPace) {
    const score = calculateMetricError(actual.lactaseThresholdPace, predicted.lactaseThresholdPace, 0.05);
    totalScore += score * defaultWeights.lactaseThresholdPace;
    totalWeight += defaultWeights.lactaseThresholdPace;
  }

  // Aerobic Decoupling comparison (tolerance: 15% - can be more variable)
  if (actual.aerobicDecoupling && predicted.aerobicDecoupling) {
    const score = calculateMetricError(actual.aerobicDecoupling, predicted.aerobicDecoupling, 0.15);
    totalScore += score * defaultWeights.aerobicDecoupling;
    totalWeight += defaultWeights.aerobicDecoupling;
  }

  // One Minute HRR comparison (tolerance: 12%)
  if (actual.oneMinHRR && predicted.oneMinHRR) {
    const score = calculateMetricError(actual.oneMinHRR, predicted.oneMinHRR, 0.12);
    totalScore += score * defaultWeights.oneMinHRR;
    totalWeight += defaultWeights.oneMinHRR;
  }

  // Efficiency Factor comparison (tolerance: 10%)
  if (actual.efficiencyFactor && predicted.efficiencyFactor) {
    const score = calculateMetricError(actual.efficiencyFactor, predicted.efficiencyFactor, 0.10);
    totalScore += score * defaultWeights.efficiencyFactor;
    totalWeight += defaultWeights.efficiencyFactor;
  }

  // Return weighted average score, or 0 if no comparable metrics found
  return totalWeight > 0 ? Math.round(totalScore / totalWeight) / 100 : 0;
}

/**
 * Interface for defining weights for different training log metrics
 */
export interface TrainingLogWeights {
  duration: number;
  distance: number;
  pace: number;
  cadence: number;
  lactaseThresholdPace: number;
  aerobicDecoupling: number;
  oneMinHRR: number;
  efficiencyFactor: number;
}

/**
 * Predefined weight configurations for different use cases
 */
export const WEIGHT_PRESETS = {
  // Balanced weights for general comparison
  balanced: {
    duration: 0.15,
    distance: 0.15,
    pace: 0.20,
    cadence: 0.10,
    lactaseThresholdPace: 0.15,
    aerobicDecoupling: 0.10,
    oneMinHRR: 0.10,
    efficiencyFactor: 0.05,
  } as TrainingLogWeights,

  // Focus on performance metrics (pace, efficiency)
  performanceFocused: {
    duration: 0.10,
    distance: 0.10,
    pace: 0.30,
    cadence: 0.15,
    lactaseThresholdPace: 0.20,
    aerobicDecoupling: 0.05,
    oneMinHRR: 0.05,
    efficiencyFactor: 0.05,
  } as TrainingLogWeights,

  // Focus on endurance metrics (duration, distance)
  enduranceFocused: {
    duration: 0.25,
    distance: 0.25,
    pace: 0.15,
    cadence: 0.10,
    lactaseThresholdPace: 0.10,
    aerobicDecoupling: 0.05,
    oneMinHRR: 0.05,
    efficiencyFactor: 0.05,
  } as TrainingLogWeights,

  // Focus on recovery metrics (HRR, aerobic decoupling)
  recoveryFocused: {
    duration: 0.10,
    distance: 0.10,
    pace: 0.15,
    cadence: 0.10,
    lactaseThresholdPace: 0.10,
    aerobicDecoupling: 0.25,
    oneMinHRR: 0.20,
    efficiencyFactor: 0.00,
  } as TrainingLogWeights,
};