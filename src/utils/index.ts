export { runSimulation } from './performanceSimulation';
export { TrainingSimulationId } from '@/components/TrainingSimulation';
import { useState, useEffect } from 'react';

// Import and re-export training data as TRAINING_DATA
import trainingData from '@/mock/training.mock';
import { IDailyTrainingLog } from "@/types/daily.schema";

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
    score: 2.1,
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
