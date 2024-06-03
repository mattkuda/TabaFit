import { TabataWorkoutWithUserInfo } from '../types/workouts';
import {
    lowerBodyExercises, upperBodyExercises, absExercises, cardioExercises,
} from './constants';

const featuredWorkout1: TabataWorkoutWithUserInfo = {
    _id: `tabafit-1`,
    name: `Easy Alpha Release`,
    description: 'TODO refine and add more of these.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: 'tabafit',
    warmupDuration: 5,
    tabatas: [
        [
            cardioExercises.Burpees,
            absExercises.Crunches,
            lowerBodyExercises['Jump Squats'],
            cardioExercises['Jumping Jacks'],
        ],
    ],
    restDuration: 10,
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
        useNone: true,
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
    name: `Medium Alpha Release`,
    description: 'TODO refine and add more of these.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: 'tabafit',
    warmupDuration: 5,
    tabatas: [
        [
            cardioExercises.Burpees,
            absExercises['Bicycle Crunches'],
            lowerBodyExercises['Jump Squats'],
            absExercises['Mountain Climbers'],
        ],
        [
            cardioExercises.Burpees,
            absExercises['Lying Leg Raises'],
            lowerBodyExercises['Alternating Jump Lunges'],
            cardioExercises['Jumping Jacks'],
        ],
        [
            cardioExercises.Burpees,
            absExercises['V-Ups'],
            lowerBodyExercises['Jump Squats'],
            cardioExercises['Fast Feet'],
        ],
        [
            cardioExercises.Burpees,
            absExercises['Russian Twists'],
            lowerBodyExercises['Glute Bridges'],
            upperBodyExercises['Push-Ups'],
        ],
    ],
    restDuration: 10,
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
        useNone: true,
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
