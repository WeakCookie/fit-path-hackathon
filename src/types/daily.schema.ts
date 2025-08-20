export interface IDailyTrainingLog {
    date: string,
    restTime?: number, // in Second
    exercise?: string,
    intensity?: number, // RPE

    // Strength specific
    rep?: number,
    set?: number,

    // Endurance specific
    duration?: number, // in Second
    distance?: number, // in Kilometer
    pace?: number, // in Second per Kilometer
    cadence?: number, // in Step per Minute
    lactaseThresholdPace?: number, // in Second per Kilometer
    aerobicDecoupling?: number, // in Percent
    oneMinHRR?: string[],
    efficiencyFactor?: string[],
}