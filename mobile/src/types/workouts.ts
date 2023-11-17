import { Exercise } from './exercises';

export interface Workout {
    _id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    userId: string;
    warmupDuration: number;
    exercises: Exercise[];
    restDuration: number;
    exerciseDuration: number;
    circuits: number;
    intermisionDuration: number;
    cooldownDuration: number;
}

export type TabataExerciseType = 'Lower Body' | 'Upper Body' | 'Abs' | 'Cardio' | 'Glutes' | 'Spicy'

export interface TabataExercise {
    _id: string;
    name: string;
    types: TabataExerciseType[];
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    videoLink: string;
}

export type TabataCircuit = TabataExercise[]

export interface TabataWorkout {
    _id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    userId: string;
    warmupDuration: number;
    tabatas: TabataCircuit[];
    restDuration: number;
    exerciseDuration: number;
    numberOfTabatas: number;
    exercisesPerTabata: number;
    intermisionDuration: number;
    cooldownDuration: number;
}

// export const workouts: Workout[] = [
//     {
//         _id: '1',
//         name: 'Lightning Workout (for testing)',
//         createdAt: '2023-07-08T00:00:00Z',
//         updatedAt: '2023-07-08T00:00:00Z',
//         userId: '123',
//         warmupDuration: 1,
//         exercises: [{
//             _id: '1',
//             name: 'Burpees',
//             description: 'A full body exercise that combines a squat, push-up, and jump.',
//             difficulty: 'Hard',
//             videoLink: 'https://www.youtube.com/watch?v=1fO8DGHK4Eo',
//         },
//         ],
//         restDuration: 1,
//         exerciseDuration: 1,
//         circuits: 1,
//         intermisionDuration: 1,
//         cooldownDuration: 1,
//     }, {
//         _id: '1',
//         name: 'Workout 1',
//         createdAt: '2023-07-08T00:00:00Z',
//         updatedAt: '2023-07-08T00:00:00Z',
//         userId: '123',
//         warmupDuration: 5,
//         exercises: [{
//             _id: '1',
//             name: 'Burpees',
//             description: 'A full body exercise that combines a squat, push-up, and jump.',
//             difficulty: 'Hard',
//             videoLink: 'https://www.youtube.com/watch?v=1fO8DGHK4Eo',
//         },
//         {
//             _id: '2',
//             name: 'Lying Leg Raises',
//             description: 'An exercise for the abs and hips, performed lying down on the back.',
//             difficulty: 'Medium',
//             videoLink: 'https://www.youtube.com/watch?v=JB2oyawG9KI',
//         },
//         {
//             _id: '3',
//             name: 'Jump Squats',
//             description: 'A high-intensity exercise that builds lower-body strength.',
//             difficulty: 'Medium',
//             videoLink: 'https://www.youtube.com/watch?v=CVaEhXotL7M',
//         },
//         {
//             _id: '4',
//             name: 'Jumping Jacks',
//             description: 'A classic cardio exercise that raises your heart rate and improves stamina.',
//             difficulty: 'Easy',
//             videoLink: 'https://www.youtube.com/watch?v=c4DAnQ6DtF8',
//         }],
//         restDuration: 60,
//         exerciseDuration: 20,
//         circuits: 4,
//         intermisionDuration: 60,
//         cooldownDuration: 5,
//     },
//     {
//         _id: '2',
//         name: 'Workout 2',
//         createdAt: '2023-07-08T00:00:00Z',
//         updatedAt: '2023-07-08T00:00:00Z',
//         userId: '123',
//         warmupDuration: 5,
//         exercises: [{
//             _id: '1',
//             name: 'Burpees',
//             description: 'A full body exercise that combines a squat, push-up, and jump.',
//             difficulty: 'Hard',
//             videoLink: 'https://www.youtube.com/watch?v=1fO8DGHK4Eo',
//         },
//         {
//             _id: '2',
//             name: 'Lying Leg Raises',
//             description: 'An exercise for the abs and hips, performed lying down on the back.',
//             difficulty: 'Medium',
//             videoLink: 'https://www.youtube.com/watch?v=JB2oyawG9KI',
//         }],
//         restDuration: 10,
//         exerciseDuration: 20,
//         circuits: 4,
//         intermisionDuration: 180,
//         cooldownDuration: 5,
//     },
//     // More workouts...
// ];
