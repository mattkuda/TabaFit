import { TabataWorkoutWithUserInfo } from '../types/workouts';

const basicWorkout1: TabataWorkoutWithUserInfo = {
    _id: `workout-shuffle`,
    name: `Tabata Shuffle`,
    description: 'TODO refine and add more of these.',
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
    equipment: [],
    includeSettings: {
        includeUpper: true,
        includeAbs: true,
        includeCardio: true,
        includeLower: true,
    },
    user: null,
};

export const featuredWorkouts: TabataWorkoutWithUserInfo[] = [basicWorkout1];
