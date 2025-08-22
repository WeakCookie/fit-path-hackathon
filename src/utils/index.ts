export { runSimulation } from './performanceSimulation';
export { TrainingSimulationId } from '@/components/TrainingSimulation';
import { useState, useEffect } from 'react';

// Import and re-export training data as TRAINING_DATA
import trainingData from '@/mock/training.mock';
import { IDailyTrainingLog } from "@/types/daily.schema";

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
