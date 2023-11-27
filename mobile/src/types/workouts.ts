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
export type TabataEquipmentType = 'Kettlebells' | 'Box Platform' | 'Yoga Ball' | 'Workout Band' | 'Dumbells' | 'Hanging Bar' | 'None';

export interface TabataExercise {
    _id: string;
    name: string;
    types: TabataExerciseType[];
    equipment: TabataEquipmentType[];
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
    equipment: TabataEquipmentType[];
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
