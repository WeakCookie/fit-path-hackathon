interface INumericalRange {
    from: number,
    to: number,
    unit: string
}

export interface IResearchClaim {
    id: string,
    name: string,
    goal: 'strength' | 'endurance'
    originalText: string,
    methodology: IResearchMethodology,
    dailyClaim: IDailyClaim,
    recoveryClaim: IRecoveryClaim,
    programClaim: IProgramClaim
}

interface IResearchMethodology {
    sampleSize: string,
    participantBackground: {
        gender: string,
        age: INumericalRange,
        height: INumericalRange,
        weight: INumericalRange,
        experience?: INumericalRange,
        nationality?: string[]
    }
    duration?: INumericalRange,
}

interface IDailyClaim {
    restTime?: string[],
    exercise?: string[],

    // Strength specific
    rep?: string[],
    set?: string[],
    intensity?: string[],

    // Endurance specific
    duration?: string[],
    distance?: string[],
    pace?: string[],
    cadence?: string[],
    lactaseThresholdPace?: string[], // Exertion level above which fatigue accumulates much more rapidly. Unit min/km 
    aerobicDecoupling?: string[] // How much HR rises relative to pace. Compare first half vs. second half of steady run (Pace₂/HR₂) ÷ (Pace₁/HR₁) × 100 (<5% drift: Excellent aerobic base, well-adapted to current intensity | 5-10% drift: Good aerobic fitness, sustainable effort | 10% drift: Either too intense for current fitness or inadequate aerobic base)
    oneMinHRR?: string[] // drop in HR during the first minute after stopping (Faster HRR = better aerobic fitness | Declining HRR trend = potential overreaching/overtraining | Consistently fast HRR = good recovery, ready for hard training)
    efficiencyFactor?: string[] // Average Pace / Average Heart Rate
}

interface IRecoveryClaim {
    sleepDuration?: string[],
    RHR?: string[],
    HRV?: string[],
    soreness?: string[],
    fatigue?: string[],
}

interface IProgramClaim {
    duration?: string[]
    exercises?: string[]
    periodization?: string[]
    injuryPrevention?: string[]
    performanceImprovementExpected?: string[]
}