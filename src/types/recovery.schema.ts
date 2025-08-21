export interface IRecovery {
    date: string,
    sleepDuration?: number,
    RHR?: number,
    HRV?: number,
    soreness?: string[], // From user input, example: ["arm", "legs", ...]
    fatigue?: number, // From user input, self-rated from 1 to 10
    source?: string,
    injury?: string[], // From user input, example: ["shoulder", "knee", ...]
}