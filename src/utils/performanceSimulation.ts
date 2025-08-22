import { IDailyTrainingLog } from "@/types/daily.schema";
import { TrainingSimulationId } from "@/components/TrainingSimulation";

/**
 * Runs simulation on the last element of training data array and appends result to the end
 * @param dataArray - Array of training log data
 * @param simulationType - The type of simulation to apply ('performance-up', 'performance-neutral', 'performance-down')
 * @param factor - Factor to control the amount of variation (0.05 = 5% default)
 * @returns New array with simulated data appended to the end
 */
export function runSimulation(
  dataArray: IDailyTrainingLog[],
  simulationType: TrainingSimulationId,
  factor: number = 0.05
): IDailyTrainingLog[] {
  if (dataArray.length === 0) {
    return dataArray;
  }

  // Get the last element
  const lastElement = dataArray[dataArray.length - 1];
  
  // Run simulation on the last element
  const simulatedData = simulateData(lastElement, simulationType, factor);

  // Return new array with simulated data appended
  return [...dataArray, simulatedData];
}

/**
 * Internal function to simulate data based on type
 */
function simulateData(
  data: IDailyTrainingLog,
  simulationType: TrainingSimulationId,
  factor: number
): IDailyTrainingLog {
  const updated = { ...data };

  switch (simulationType) {
    case TrainingSimulationId.PERFORMANCE_UP:
      return simulateImprovement(updated, factor);
    case TrainingSimulationId.PERFORMANCE_DOWN:
      return simulateDecline(updated, factor);
    case TrainingSimulationId.PERFORMANCE_NEUTRAL:
      return simulateStable(updated, factor);
    default:
      return updated;
  }
}

/**
 * Simulates performance improvement
 * - Duration: increases (longer workouts)
 * - Distance: increases (going further)
 * - Pace: decreases (running faster, lower seconds per km)
 * - Cadence: increases (more steps per minute)
 * - Lactate Threshold Pace: decreases (can maintain faster pace at threshold)
 * - Aerobic Decoupling: decreases (better aerobic efficiency)
 * - One Minute HRR: increases (better recovery)
 * - Efficiency Factor: increases (better pace to HR ratio)
 */
function simulateImprovement(
  trainingLog: IDailyTrainingLog,
  variabilityFactor: number
): IDailyTrainingLog {
  const improvementFactor = 1 + (0.1 + Math.random() * 0.15); // 10-25% improvement
  const variation = () => 1 + (Math.random() - 0.5) * variabilityFactor;

  return {
    ...trainingLog,
    duration: trainingLog.duration ? Math.round(trainingLog.duration * improvementFactor * variation()) : undefined,
    distance: trainingLog.distance ? Math.round((trainingLog.distance * improvementFactor * variation()) * 100) / 100 : undefined,
    pace: trainingLog.pace ? Math.round(trainingLog.pace / (improvementFactor * variation())) : undefined,
    cadence: trainingLog.cadence ? Math.round(trainingLog.cadence * (1 + 0.05 * variation())) : undefined,
    lactaseThresholdPace: trainingLog.lactaseThresholdPace ? Math.round(trainingLog.lactaseThresholdPace / (improvementFactor * variation())) : undefined,
    aerobicDecoupling: trainingLog.aerobicDecoupling ? Math.round((trainingLog.aerobicDecoupling * (1 - 0.2 * variation())) * 10) / 10 : undefined,
    oneMinHRR: trainingLog.oneMinHRR ? Math.round(trainingLog.oneMinHRR * (1 + 0.15 * variation())) : undefined,
    efficiencyFactor: trainingLog.efficiencyFactor ? Math.round((trainingLog.efficiencyFactor * improvementFactor * variation()) * 100) / 100 : undefined,
  };
}

/**
 * Simulates performance decline
 * - Duration: decreases (shorter workouts)
 * - Distance: decreases (can't go as far)
 * - Pace: increases (running slower, more seconds per km)
 * - Cadence: decreases (fewer steps per minute)
 * - Lactate Threshold Pace: increases (threshold at slower pace)
 * - Aerobic Decoupling: increases (worse aerobic efficiency)
 * - One Minute HRR: decreases (worse recovery)
 * - Efficiency Factor: decreases (worse pace to HR ratio)
 */
function simulateDecline(
  trainingLog: IDailyTrainingLog,
  variabilityFactor: number
): IDailyTrainingLog {
  const declineFactor = 1 - (0.1 + Math.random() * 0.15); // 10-25% decline
  const variation = () => 1 + (Math.random() - 0.5) * variabilityFactor;

  return {
    ...trainingLog,
    duration: trainingLog.duration ? Math.round(trainingLog.duration * declineFactor * variation()) : undefined,
    distance: trainingLog.distance ? Math.round((trainingLog.distance * declineFactor * variation()) * 100) / 100 : undefined,
    pace: trainingLog.pace ? Math.round(trainingLog.pace / (declineFactor * variation())) : undefined,
    cadence: trainingLog.cadence ? Math.round(trainingLog.cadence * (1 - 0.05 * variation())) : undefined,
    lactaseThresholdPace: trainingLog.lactaseThresholdPace ? Math.round(trainingLog.lactaseThresholdPace / (declineFactor * variation())) : undefined,
    aerobicDecoupling: trainingLog.aerobicDecoupling ? Math.round((trainingLog.aerobicDecoupling * (1 + 0.3 * variation())) * 10) / 10 : undefined,
    oneMinHRR: trainingLog.oneMinHRR ? Math.round(trainingLog.oneMinHRR * (1 - 0.15 * variation())) : undefined,
    efficiencyFactor: trainingLog.efficiencyFactor ? Math.round((trainingLog.efficiencyFactor * declineFactor * variation()) * 100) / 100 : undefined,
  };
}

/**
 * Simulates stable performance with minor fluctuations
 * - All metrics stay relatively the same with small random variations
 * - Variations are within ±5% of original values
 */
function simulateStable(
  trainingLog: IDailyTrainingLog,
  variabilityFactor: number
): IDailyTrainingLog {
  const variation = () => 1 + (Math.random() - 0.5) * variabilityFactor;

  return {
    ...trainingLog,
    duration: trainingLog.duration ? Math.round(trainingLog.duration * variation()) : undefined,
    distance: trainingLog.distance ? Math.round((trainingLog.distance * variation()) * 100) / 100 : undefined,
    pace: trainingLog.pace ? Math.round(trainingLog.pace * variation()) : undefined,
    cadence: trainingLog.cadence ? Math.round(trainingLog.cadence * variation()) : undefined,
    lactaseThresholdPace: trainingLog.lactaseThresholdPace ? Math.round(trainingLog.lactaseThresholdPace * variation()) : undefined,
    aerobicDecoupling: trainingLog.aerobicDecoupling ? Math.round((trainingLog.aerobicDecoupling * variation()) * 10) / 10 : undefined,
    oneMinHRR: trainingLog.oneMinHRR ? Math.round(trainingLog.oneMinHRR * variation()) : undefined,
    efficiencyFactor: trainingLog.efficiencyFactor ? Math.round((trainingLog.efficiencyFactor * variation()) * 100) / 100 : undefined,
  };
}


