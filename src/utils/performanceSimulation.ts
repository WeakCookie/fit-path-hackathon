import { IDailyTrainingLog } from "@/types/daily.schema";
import { TrainingSimulationId } from "@/components/TrainingSimulation";
import { TODAY } from "./index";

// Re-export the error calculation function for convenience
export { calculateTrainingLogError, WEIGHT_PRESETS, type TrainingLogWeights } from "./trainingLogError";

/**
 * Runs simulation on the last element of training data array and appends result to the end
 * @param dataArray - Array of training log data
 * @param simulationType - The type of simulation to apply ('performance-up', 'performance-neutral', 'performance-down')
 * @param factor - Factor to control the amount of variation (0.05 = 5% default)
 * @param simpleMode - If true, uses factor as direct percentage change (e.g., 0.1 = 10% change)
 * @returns New array with simulated data appended to the end
 */
export function runSimulation(
  dataArray: IDailyTrainingLog[],
  simulationType: TrainingSimulationId,
  factor: number = 0.1,
  simpleMode: boolean = false
): IDailyTrainingLog[] {
  if (dataArray.length === 0) {
    return dataArray;
  }

  // Get the most recent element by date (not by array position)
  const sortedData = [...dataArray].sort((a, b) => a.date.localeCompare(b.date));
  const lastElement = sortedData[sortedData.length - 1];
  
  // Run simulation on the most recent element
  const simulatedData = simulateData(lastElement, simulationType, factor, simpleMode);

  // Return new array with simulated data appended
  return [...dataArray, simulatedData];
}

/**
 * Internal function to simulate data based on type
 */
function simulateData(
  data: IDailyTrainingLog,
  simulationType: TrainingSimulationId,
  factor: number,
  simpleMode: boolean = false
): IDailyTrainingLog {
  const updated = { ...data };
  
  // Set the date to TODAY's value for the new simulated data
  updated.date = TODAY.getISOString();

  switch (simulationType) {
    case TrainingSimulationId.PERFORMANCE_UP:
      return simpleMode ? simulateSimpleImprovement(updated, factor) : simulateImprovement(updated, factor);
    case TrainingSimulationId.PERFORMANCE_DOWN:
      return simpleMode ? simulateSimpleDecline(updated, factor) : simulateDecline(updated, factor);
    case TrainingSimulationId.PERFORMANCE_NEUTRAL:
      return simpleMode ? simulateSimpleStable(updated, factor) : simulateStable(updated, factor);
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

/**
 * Simple performance improvement simulation
 * Uses factor directly as percentage improvement (e.g., 0.1 = 10% improvement)
 */
function simulateSimpleImprovement(
  trainingLog: IDailyTrainingLog,
  factor: number
): IDailyTrainingLog {
  const improvementFactor = 1 + factor; // Direct percentage improvement

  return {
    ...trainingLog,
    duration: trainingLog.duration ? Math.round(trainingLog.duration * improvementFactor) : undefined,
    distance: trainingLog.distance ? Math.round((trainingLog.distance * improvementFactor) * 100) / 100 : undefined,
    pace: trainingLog.pace ? Math.round(trainingLog.pace / improvementFactor) : undefined,
    cadence: trainingLog.cadence ? Math.round(trainingLog.cadence * improvementFactor) : undefined,
    lactaseThresholdPace: trainingLog.lactaseThresholdPace ? Math.round(trainingLog.lactaseThresholdPace / improvementFactor) : undefined,
    aerobicDecoupling: trainingLog.aerobicDecoupling ? Math.round((trainingLog.aerobicDecoupling * (1 - factor)) * 10) / 10 : undefined,
    oneMinHRR: trainingLog.oneMinHRR ? Math.round(trainingLog.oneMinHRR * improvementFactor) : undefined,
    efficiencyFactor: trainingLog.efficiencyFactor ? Math.round((trainingLog.efficiencyFactor * improvementFactor) * 100) / 100 : undefined,
  };
}

/**
 * Simple performance decline simulation
 * Uses factor directly as percentage decline (e.g., 0.1 = 10% decline)
 */
function simulateSimpleDecline(
  trainingLog: IDailyTrainingLog,
  factor: number
): IDailyTrainingLog {
  const declineFactor = 1 - factor; // Direct percentage decline

  return {
    ...trainingLog,
    duration: trainingLog.duration ? Math.round(trainingLog.duration * declineFactor) : undefined,
    distance: trainingLog.distance ? Math.round((trainingLog.distance * declineFactor) * 100) / 100 : undefined,
    pace: trainingLog.pace ? Math.round(trainingLog.pace / declineFactor) : undefined,
    cadence: trainingLog.cadence ? Math.round(trainingLog.cadence * declineFactor) : undefined,
    lactaseThresholdPace: trainingLog.lactaseThresholdPace ? Math.round(trainingLog.lactaseThresholdPace / declineFactor) : undefined,
    aerobicDecoupling: trainingLog.aerobicDecoupling ? Math.round((trainingLog.aerobicDecoupling * (1 + factor)) * 10) / 10 : undefined,
    oneMinHRR: trainingLog.oneMinHRR ? Math.round(trainingLog.oneMinHRR * declineFactor) : undefined,
    efficiencyFactor: trainingLog.efficiencyFactor ? Math.round((trainingLog.efficiencyFactor * declineFactor) * 100) / 100 : undefined,
  };
}

/**
 * Simple stable performance simulation
 * Uses factor as small fluctuation range (e.g., 0.1 = ±5% random fluctuation)
 */
function simulateSimpleStable(
  trainingLog: IDailyTrainingLog,
  factor: number
): IDailyTrainingLog {
  // Use half the factor for fluctuation range to keep changes small
  const fluctuationRange = factor * 0.5;
  const variation = () => 1 + (Math.random() - 0.5) * fluctuationRange;

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

