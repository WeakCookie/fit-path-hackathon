export { runSimulation } from './performanceSimulation';
export { TrainingSimulationId, InjurySimulationId, RecoverySimulationId } from '@/components/TrainingSimulation';
import { InjurySimulationId, RecoverySimulationId } from '@/components/TrainingSimulation';
import { useState, useEffect } from 'react';

// Import and re-export training data as TRAINING_DATA
import trainingData from '@/mock/training.mock';
import { IDailyTrainingLog } from "@/types/daily.schema";

// Import recovery data and types
import recoveryData from '@/mock/recovery.mock';
import { IRecovery } from "@/types/recovery.schema";

// Interface for confidence score data
export interface IResearchPaperConfidenceScore {
  date: string
  score: number
  paperId: string
}

// Global training data store that can be modified throughout the application
let globalTrainingData: IDailyTrainingLog[] = [...trainingData];

export const TRAINING_DATA = {
  // Get current global training data (always sorted chronologically)
  getData: (): IDailyTrainingLog[] => {
    return [...globalTrainingData].sort((a, b) => a.date.localeCompare(b.date));
  },
  
  // Set new training data
  setData: (data: IDailyTrainingLog[]): void => {
    globalTrainingData = [...data].sort((a, b) => a.date.localeCompare(b.date));
  },
  
  // Add new training data entry
  addData: (data: IDailyTrainingLog): void => {
    globalTrainingData = [...globalTrainingData, data].sort((a, b) => a.date.localeCompare(b.date));
  },
  
  // Reset to original mock data
  reset: (): void => {
    globalTrainingData = [...trainingData];
  }
};

// ------------------------------------------------------------

// Global recovery data store that can be modified throughout the application
let globalRecoveryData: IRecovery[] = [...recoveryData];

export const RECOVERY_DATA = {
  // Get current global recovery data (always sorted chronologically)
  getData: (): IRecovery[] => {
    return [...globalRecoveryData].sort((a, b) => a.date.localeCompare(b.date));
  },
  
  // Set new recovery data
  setData: (data: IRecovery[]): void => {
    globalRecoveryData = [...data].sort((a, b) => a.date.localeCompare(b.date));
  },
  
  // Add new recovery data entry
  addData: (data: IRecovery): void => {
    globalRecoveryData = [...globalRecoveryData, data].sort((a, b) => a.date.localeCompare(b.date));
  },
  
  // Update existing recovery data entry by date
  updateData: (date: string, updatedData: Partial<IRecovery>): void => {
    const index = globalRecoveryData.findIndex(entry => entry.date === date);
    if (index !== -1) {
      globalRecoveryData[index] = { ...globalRecoveryData[index], ...updatedData };
    } else {
      // If entry doesn't exist, add it
      globalRecoveryData.push({ date, ...updatedData } as IRecovery);
    }
    globalRecoveryData.sort((a, b) => a.date.localeCompare(b.date));
  },
  
  // Get recovery data for a specific date
  getDataByDate: (date: string): IRecovery | undefined => {
    return globalRecoveryData.find(entry => entry.date === date);
  },
  
  // Reset to original mock data
  reset: (): void => {
    globalRecoveryData = [...recoveryData];
  }
};

/**
 * Runs recovery simulation based on injury and recovery selections
 * @param recoveryData - Current recovery data array
 * @param injuries - Array of selected injury simulation IDs
 * @param recoveries - Array of selected recovery simulation IDs
 * @returns Updated recovery data array with new simulated entry
 */
export function runRecoverySimulation(
  recoveryData: IRecovery[],
  injuries: InjurySimulationId[],
  recoveries: RecoverySimulationId[]
): IRecovery[] {
  if (recoveryData.length === 0) {
    return recoveryData;
  }

  // Get the most recent recovery entry
  const sortedData = [...recoveryData].sort((a, b) => a.date.localeCompare(b.date));
  const lastEntry = sortedData[sortedData.length - 1];
  
  // Create new simulated recovery entry
  const simulatedEntry = simulateRecoveryData(lastEntry, injuries, recoveries);
  
  // Return new array with simulated data appended
  return [...recoveryData, simulatedEntry];
}

/**
 * Internal function to simulate recovery data based on injuries and recovery factors
 */
function simulateRecoveryData(
  data: IRecovery,
  injuries: InjurySimulationId[],
  recoveries: RecoverySimulationId[]
): IRecovery {
  const updated: IRecovery = { ...data };
  
  // Set the date to TODAY's value for the new simulated data
  updated.date = TODAY.getISOString();
  updated.source = "Simulation";
  
  // Handle injuries - if no injuries selected, clear the array
  const newInjuries: string[] = injuries.length > 0 ? [...(updated.injury || [])] : [];
  injuries.forEach(injury => {
    switch (injury) {
      case InjurySimulationId.KNEE_HURT:
        if (!newInjuries.includes(InjurySimulationId.KNEE_HURT)) {
          newInjuries.push(InjurySimulationId.KNEE_HURT);
        }
        break;
      case InjurySimulationId.BREAK_ANKLE:
        if (!newInjuries.includes(InjurySimulationId.BREAK_ANKLE)) {
          newInjuries.push(InjurySimulationId.BREAK_ANKLE);
        }
        break;
    }
  });
  updated.injury = newInjuries;
  
  // Handle recovery factors
  recoveries.forEach(recovery => {
    switch (recovery) {
      case RecoverySimulationId.SLEEP_UNDER_6:
        // Take current sleep duration, ensure it's under 6, then vary by 5%
        const currentSleep = updated.sleepDuration || 7.5; // Default if not set
        const baseSleep = Math.min(currentSleep, 5.9); // Ensure under 6 hours
        const variation = baseSleep * 0.05; // 5% variation
        updated.sleepDuration = baseSleep + (Math.random() - 0.5) * 2 * variation;
        // Ensure it stays positive and under 6
        updated.sleepDuration = Math.max(0.5, Math.min(updated.sleepDuration, 5.99));
        break;
        
      case RecoverySimulationId.SORE_LEGS:
        const newSoreness = [...(updated.soreness || [])];
        if (!newSoreness.includes(RecoverySimulationId.SORE_LEGS)) {
          newSoreness.push(RecoverySimulationId.SORE_LEGS);
        }
        updated.soreness = newSoreness;
        break;
    }
  });
  
  // If no recovery factors that affect soreness are selected, clear soreness
  const hasSorenessFactors = recoveries.includes(RecoverySimulationId.SORE_LEGS);
  if (!hasSorenessFactors) {
    updated.soreness = [];
  }
  
  // Simulate other recovery metrics with realistic variation
  if (updated.RHR !== undefined) {
    // Increase RHR slightly if there are injuries or poor sleep, otherwise small natural variation
    const stressFactor = (injuries.length * 2) + (recoveries.includes(RecoverySimulationId.SLEEP_UNDER_6) ? 3 : 0);
    const baseVariation = (Math.random() - 0.5) * 3; // ±1.5 natural variation
    updated.RHR = Math.round(updated.RHR + stressFactor + baseVariation);
    updated.RHR = Math.max(40, Math.min(100, updated.RHR)); // Keep within realistic bounds
  }
  
  if (updated.HRV !== undefined) {
    // Decrease HRV with stress factors, otherwise small natural variation
    const stressFactor = (injuries.length * 5) + (recoveries.includes(RecoverySimulationId.SLEEP_UNDER_6) ? 8 : 0);
    const baseVariation = (Math.random() - 0.5) * 5; // ±2.5 natural variation
    updated.HRV = Math.round(updated.HRV - stressFactor + baseVariation);
    updated.HRV = Math.max(20, Math.min(100, updated.HRV)); // Keep within realistic bounds
  }
  
  if (updated.fatigue !== undefined) {
    // Increase fatigue with stress factors, otherwise small natural variation
    const stressFactor = (injuries.length * 1.5) + (recoveries.includes(RecoverySimulationId.SLEEP_UNDER_6) ? 2 : 0);
    const baseVariation = (Math.random() - 0.5) * 1.5; // ±0.75 natural variation
    updated.fatigue = Math.round(updated.fatigue + stressFactor + baseVariation);
    updated.fatigue = Math.min(10, Math.max(1, updated.fatigue)); // Keep within 1-10 scale
  }
  
  // Add small natural variation to sleep duration if no sleep factor was applied
  if (updated.sleepDuration !== undefined && !recoveries.includes(RecoverySimulationId.SLEEP_UNDER_6)) {
    const sleepVariation = (Math.random() - 0.5) * 0.6; // ±0.3 hours natural variation
    updated.sleepDuration = Math.round((updated.sleepDuration + sleepVariation) * 10) / 10; // Round to 1 decimal
    updated.sleepDuration = Math.max(3, Math.min(12, updated.sleepDuration)); // Keep realistic bounds
  }
  
  return updated;
}

// ------------------------------------------------------------

// Initial confidence data (can be empty or contain some starting values)
let globalConfidenceData: IResearchPaperConfidenceScore[] = [
  // Adding some mock confidence scores for testing badge functionality
  {
    date: "2024-12-20",
    score: 1.2,
    paperId: "3"
  },
  {
    date: "2024-12-20", 
    score: 1.8,
    paperId: "4"
  },
  {
    date: "2024-12-20",
    score: 1.3,
    paperId: "5"
  }
];

// Global confidence data store that can be modified throughout the application
export const CONFIDENCE_DATA = {
  // Get current global confidence data (always sorted chronologically)
  getData: (): IResearchPaperConfidenceScore[] => {
    return [...globalConfidenceData].sort((a, b) => a.date.localeCompare(b.date));
  },
  
  // Set new confidence data
  setData: (data: IResearchPaperConfidenceScore[]): void => {
    globalConfidenceData = [...data].sort((a, b) => a.date.localeCompare(b.date));
  },
  
  // Add new confidence score entry
  addScore: (data: IResearchPaperConfidenceScore): void => {
    globalConfidenceData = [...globalConfidenceData, data].sort((a, b) => a.date.localeCompare(b.date));
  },
  
  // Get latest confidence score for a specific paper
  getLatestScore: (paperId: string): IResearchPaperConfidenceScore | null => {
    const paperScores = globalConfidenceData.filter(item => item.paperId === paperId);
    return paperScores.length > 0 ? paperScores[paperScores.length - 1] : null;
  },
  
  // Reset to empty array
  reset: (): void => {
    globalConfidenceData = [];
  }
};

// ------------------------------------------------------------

// Import prediction response type
import { IDailyTrainingPrediction } from '@/types/ai.schema';

// Global prediction data store that can be modified throughout the application
let globalPredictionData: IDailyTrainingPrediction[] = [];

export const PREDICTION_DATA = {
  // Get current global prediction data
  getData: (): IDailyTrainingPrediction[] => {
    return [...globalPredictionData];
  },
  
  // Set new prediction data
  setData: (data: IDailyTrainingPrediction[]): void => {
    globalPredictionData = [...data];
  },
  
  // Add new prediction data entry
  addData: (data: IDailyTrainingPrediction): void => {
    globalPredictionData = [...globalPredictionData, data];
  },
  
  // Get prediction data for a specific paper
  getDataByPaperId: (paperId: string): IDailyTrainingPrediction | undefined => {
    return globalPredictionData.find(entry => entry.paperId === paperId);
  },
  
  // Reset to empty array
  reset: (): void => {
    globalPredictionData = [];
  }
};

/**
 * Convert PREDICTION_DATA to mockPredictedValueData format
 * @param predictionData - Array of IDailyTrainingPrediction objects
 * @returns Array of objects in mockPredictedValueData format
 */
export function convertPredictionDataToMockFormat(predictionData: IDailyTrainingPrediction[]) {
  return predictionData.map(prediction => {
    const { paperId, predictions } = prediction;
    const currentDate = TODAY.getISOString();
    
    // Extract values from predictions object, using defaults if not available
    const predictedData = {
      date: currentDate,
      pace: predictions.pace?.value || 300, // seconds per km
      distance: predictions.distance?.value || 8, // km
      duration: predictions.duration?.value || (45 * 60), // seconds
      cadence: predictions.cadence?.value || 168, // steps per minute
      lactaseThresholdPace: predictions.lactaseThresholdPace?.value || 270, // seconds per km
      aerobicDecoupling: predictions.aerobicDecoupling?.value || 9.8, // percent
      paperId: paperId
    };
    
    return predictedData;
  });
}

/**
 * Calculate prediction error and convert to confidence score
 * @param predictedValue - The predicted value from external source (mock for now)
 * @param actualValue - The actual value from latest training data
 * @param metricType - Type of metric being compared (e.g., 'pace', 'distance', 'duration')
 * @returns Confidence score between 0 and 1
 */
export function calculateConfidenceScore(
  predictedValue: number,
  actualValue: number,
  metricType: string = 'pace'
): number {
  // Calculate percentage error
  const percentageError = Math.abs((predictedValue - actualValue) / actualValue) * 100;
  
  // Convert error to confidence score (higher error = lower confidence)
  // Using exponential decay function to map error to confidence
  const confidence = Math.exp(-percentageError / 20); // 20% error gives ~0.37 confidence
  
  // Ensure confidence is between 0.1 and 1.0
  return Math.max(0.1, Math.min(1.0, confidence));
}

// ------------------------------------------------------------

// Global TODAY value that can be modified throughout the application
let globalToday = new Date();
let todaySubscribers: Set<() => void> = new Set();

// Notify all subscribers when TODAY changes
const notifyTodaySubscribers = () => {
  todaySubscribers.forEach(callback => callback());
};

export const TODAY = {
  // Get current global TODAY as Date object
  getDate: (): Date => globalToday,
  
  // Get current global TODAY as ISO string (YYYY-MM-DD format)
  getISOString: (): string => globalToday.toISOString().split('T')[0],
  
  // Set new TODAY value
  setDate: (date: Date): void => {
    globalToday = new Date(date);
    notifyTodaySubscribers();
  },
  
  // Set TODAY from ISO string
  setFromString: (dateString: string): void => {
    globalToday = new Date(dateString);
    notifyTodaySubscribers();
  },
  
  // Reset to current system date
  reset: (): void => {
    globalToday = new Date();
    notifyTodaySubscribers();
  },
  
  // Advance TODAY by one day
  advanceDay: (): void => {
    globalToday.setDate(globalToday.getDate() + 1);
    notifyTodaySubscribers();
  },
  
  // Subscribe to TODAY changes (for internal use)
  _subscribe: (callback: () => void): (() => void) => {
    todaySubscribers.add(callback);
    return () => todaySubscribers.delete(callback);
  }
};

// React hook to get reactive TODAY value
export const useToday = () => {
  const [todayValue, setTodayValue] = useState(TODAY.getISOString());
  
  useEffect(() => {
    const unsubscribe = TODAY._subscribe(() => {
      setTodayValue(TODAY.getISOString());
    });
    
    return unsubscribe;
  }, []);
  
  return {
    date: TODAY.getDate(),
    isoString: todayValue,
    getDate: TODAY.getDate,
    getISOString: () => todayValue
  };
};

// Date formatting utilities - ensuring consistent YYYY-MM-DD format
export const DateUtils = {
  // Convert any date input to YYYY-MM-DD format
  toISOString: (date: Date | string): string => {
    if (typeof date === 'string') {
      return new Date(date).toISOString().split('T')[0];
    }
    return date.toISOString().split('T')[0];
  },
  
  // Format date for display while maintaining YYYY-MM-DD internally
  toDisplayString: (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  },
  
  // Create Date object from YYYY-MM-DD string
  fromISOString: (dateString: string): Date => {
    return new Date(dateString);
  }
};

/**
 * Generate pastel colors for research papers using chroma-js
 * @param papers - Array of research papers to generate colors for
 * @returns Record mapping paper names to their generated colors
 */
export const generatePastelColors = (papers: Array<{ name: string }>): Record<string, string> => {
  const colors: Record<string, string> = {}
  
  papers.forEach((paper, index) => {
    const hue = (index * 137.5) % 360
    const saturation = 0.3 + (Math.random() * 0.2)
    const lightness = 0.7 + (Math.random() * 0.2)
    
    // Using HSL to hex conversion without chroma-js dependency
    const hslToHex = (h: number, s: number, l: number): string => {
      l /= 100
      const a = s * Math.min(l, 1 - l) / 100
      const f = (n: number) => {
        const k = (n + h / 30) % 12
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
        return Math.round(255 * color).toString(16).padStart(2, '0')
      }
      return `#${f(0)}${f(8)}${f(4)}`
    }
    
    colors[paper.name] = hslToHex(hue, saturation * 100, lightness * 100)
  })
  
  return colors
}
