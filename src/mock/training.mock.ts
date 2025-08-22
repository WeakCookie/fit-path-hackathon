import { IDailyTrainingLog } from "@/types/daily.schema";

const trainingData: IDailyTrainingLog[] = [
    {
        date: "2025-08-01",
        exercise: "Long Run",
        duration: 45 * 60,
        distance: 8,
        pace: 300,
        cadence: 168,
        lactaseThresholdPace: 270,
        aerobicDecoupling: 9.8,
        oneMinHRR: 26,
        efficiencyFactor: 0.65
    }
]

export default trainingData;