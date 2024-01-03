import mongoose from 'mongoose';

export type TabataExerciseType = 'Lower Body' | 'Upper Body' | 'Abs' | 'Cardio' | 'Glutes' | 'Spicy'
export type TabataEquipmentType = 'Kettlebell' | 'Box Platform' | 'Yoga Ball' | 'Workout Band' | 'Dumbells' | 'Hanging Bar' | 'None';

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

export interface WorkoutIncludeSettings {
    includeUpper: boolean,
    includeLower: boolean,
    includeAbs: boolean,
    includeCardio: boolean,
}

export interface TabataWorkout {
    _id: mongoose.Types.ObjectId | string;
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
    includeSettings?: WorkoutIncludeSettings;
}

export interface UserInfo {
    username: string;
    firstName?: string;
    lastName?: string;
    profilePictureUrl?: string;
}

// Extended workout type to include user info
export interface TabataWorkoutWithUserInfo extends TabataWorkout {
    user: UserInfo;
}
