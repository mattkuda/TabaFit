import mongoose from 'mongoose';

export type TabataExerciseType = 'Lower Body' | 'Upper Body' | 'Abs' | 'Cardio' | 'Glutes' | 'Spicy'
export type TabataEquipmentType = 'Kettlebell' | 'Box Platform' | 'Yoga Ball' | 'Workout Band' | 'Dumbbells' | 'Hanging Bar' | 'None';

export interface TabataExercise {
    _id: string;
    name: string;
    types: TabataExerciseType[];
    equipment: TabataEquipmentType[];
    description: string;
    difficulty: 'Basic' | 'Intermediate' | 'Advanced';
    videoLink?: string;
}

export type TabataCircuit = (TabataExercise | null)[];

export enum Difficulty {
    Basic = 'Basic',
    Intermediate = 'Intermediate',
    Advanced = 'Advanced',
}
export interface WorkoutEquipmentSettings {
    useKettlebell: boolean,
    useBoxPlatform: boolean,
    useYogaBall: boolean,
    useWorkoutBand: boolean,
    useDumbbells: boolean,
    useHangingBar: boolean,
}

export interface WorkoutIncludeSettings {
    includeUpper: boolean,
    includeLower: boolean,
    includeAbs: boolean,
    includeCardio: boolean,
}

export interface TabataWorkout {
    _id: mongoose.Types.ObjectId;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    equipment: WorkoutEquipmentSettings;
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
    difficulty: Difficulty;
    isDiscoverable?: boolean;
    isPremade?: boolean;
}

export interface TabataWorkoutSchema extends Omit<TabataWorkout, 'userId'> { userId: mongoose.Types.ObjectId | string; }

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
