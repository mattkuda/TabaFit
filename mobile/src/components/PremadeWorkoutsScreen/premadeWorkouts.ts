import { Difficulty, TabataWorkout } from '../../types/workouts';

export const premadeWorkout1: TabataWorkout = {
    _id: 'premadeWorkout1',
    name: `premadeWorkout1`,
    description: 'premadeWorkout1. todo update.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: null,
    warmupDuration: 1,
    tabatas: [],
    restDuration: 1,
    exerciseDuration: 1,
    numberOfTabatas: 1,
    exercisesPerTabata: 8,
    intermisionDuration: 1,
    cooldownDuration: 0,
    difficulty: Difficulty.Basic,
    equipment: {
        useKettlebell: false,
        useBoxPlatform: false,
        useYogaBall: false,
        useWorkoutBand: false,
        useDumbbells: false,
        useHangingBar: false,
    },
};

export const premadeWorkouts = [premadeWorkout1];
