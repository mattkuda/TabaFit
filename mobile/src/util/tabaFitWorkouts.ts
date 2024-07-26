import { Difficulty, TabataWorkoutWithUserInfo } from '../types/workouts';
import { exerciseDict } from './constants';

const featuredWorkout1: TabataWorkoutWithUserInfo = {
    _id: `tabafit-1`,
    name: `Basic Alpha Release`,
    description: 'TODO refine and add more of these.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: 'tabafit',
    warmupDuration: 5,
    tabatas: [
        [
            exerciseDict.burpees,
            exerciseDict.crunches,
            exerciseDict['jump-squats'],
            exerciseDict['jumping-jacks'],
        ],
    ],
    restDuration: 10,
    exerciseDuration: 20,
    numberOfTabatas: 1,
    exercisesPerTabata: 8,
    intermisionDuration: 60,
    cooldownDuration: 0,
    difficulty: Difficulty.Basic,
    equipment: {
        useKettlebell: false,
        useBoxPlatform: false,
        useYogaBall: false,
        useWorkoutBand: false,
        useDumbells: false,
        useHangingBar: false,
    },
    includeSettings: {
        includeUpper: true,
        includeAbs: true,
        includeCardio: true,
        includeLower: true,
    },
    user: {
        username: 'tabafit',
    },
};

const featuredWorkout2: TabataWorkoutWithUserInfo = {
    _id: `tabafit-2`,
    name: `Intermediate Alpha Release`,
    description: 'TODO refine and add more of these.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: 'tabafit',
    warmupDuration: 5,
    tabatas: [
        [
            exerciseDict.burpees,
            exerciseDict['bicycle-crunches'],
            exerciseDict['jump-squats'],
            exerciseDict['mountain-climbers'],
        ],
        [
            exerciseDict.burpees,
            exerciseDict['lying-leg-raises'],
            exerciseDict['alternatin-jump-lunges'],
            exerciseDict['jumping-jacks'],
        ],
        [
            exerciseDict.burpees,
            exerciseDict['v-ups'],
            exerciseDict['jump-squats'],
            exerciseDict['fast-feet'],
        ],
        [
            exerciseDict.burpees,
            exerciseDict['russian-twists'],
            exerciseDict['glute-bridges'],
            exerciseDict['push-ups'],
        ],
    ],
    restDuration: 10,
    difficulty: Difficulty.Basic,
    exerciseDuration: 20,
    numberOfTabatas: 1,
    exercisesPerTabata: 8,
    intermisionDuration: 60,
    cooldownDuration: 0,
    equipment: {
        useKettlebell: false,
        useBoxPlatform: false,
        useYogaBall: false,
        useWorkoutBand: false,
        useDumbells: false,
        useHangingBar: false,
    },
    includeSettings: {
        includeUpper: true,
        includeAbs: true,
        includeCardio: true,
        includeLower: true,
    },
    user: {
        username: 'tabafit',
    },
};

export const tabaFitWorkouts: TabataWorkoutWithUserInfo[] = [featuredWorkout1, featuredWorkout2];
