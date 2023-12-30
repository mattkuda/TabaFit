import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { TabataExercise, TabataWorkout } from '../types/workouts';
import { User } from '../types/users';

// Home Stack
export type HomeStackParamList = {
    Home: undefined;
    Search: undefined;
    Profile: {userId: string | null}
    PostScreen: {postId: string}
    NotificationsScreen: undefined
};

export type SearchScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'Search'>;
export type NotificationsScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'NotificationsScreen'>;
//

// Profile Stack
export type ProfileStackParamList = {
    Profile: { userId?: string };
    EditProfile: { user: User };
};

export type ProfileScreenRouteProp = RouteProp<ProfileStackParamList, 'Profile'>;

// Post Stack
export type PostStackParamList = {
    PostScreen: { postId: string };
};

export type PostScreenRouteProp = RouteProp<PostStackParamList, 'PostScreen'>;

// Shuffle Stack
export type ShuffleStackParamList = {
    ShuffleScreen: { workout?: TabataWorkout };
    LoadWorkoutScreen;
    TabataTimer: {workout: TabataWorkout};
    ShareWorkoutScreen: {workout: TabataWorkout, completedAt: Date};
};

export type ShuffleScreenRouteProp = RouteProp<ShuffleStackParamList, 'ShuffleScreen'>;
export type TabataTimerScreenRouteProp = RouteProp<ShuffleStackParamList, 'TabataTimer'>;
export type ShareWorkoutScreenRouteProp = RouteProp<ShuffleStackParamList, 'ShareWorkoutScreen'>;
export type LoadWorkoutScreenRouteProp = RouteProp<ShuffleStackParamList, 'LoadWorkoutScreen'>;

// OldWorkouts Stack
export type OldWorkoutsStackParamList = {
    LoadWorkoutScreen;
    BuildWorkoutScreen;
    SelectExerciseScreen: {onSelectWorkout: (exercise: TabataExercise) => void };
}
export type OldBuildWorkoutScreenRouteProp = StackNavigationProp<OldWorkoutsStackParamList, 'BuildWorkoutScreen'>;
export type OldSelectExerciseScreenRouteProp = StackNavigationProp<OldWorkoutsStackParamList, 'SelectExerciseScreen'>;

export interface BuildWorkoutScreenProps {
    isShuffle?: boolean;
    customWorkout?: TabataWorkout;
}

// (New) Workouts Stack
export type WorkoutsStackParamList = {
    WorkoutsScreen;
    LoadWorkoutScreen;
    BuildWorkoutScreen: {
        isShuffle?: boolean;
        customWorkout?: TabataWorkout;
    };
    ShuffleScreen: { workout?: TabataWorkout };
    ViewWorkoutScreen: { workout: TabataWorkout };
    SelectExerciseScreen: {onSelectWorkout: (exercise: TabataExercise) => void };
    TabataTimerScreen: {workout?: TabataWorkout}
    ShareWorkoutScreen: {workout: TabataWorkout, completedAt: Date};
}
export type BuildWorkoutScreenRouteProp = StackNavigationProp<WorkoutsStackParamList, 'BuildWorkoutScreen'>;
export type SelectExerciseScreenRouteProp = StackNavigationProp<WorkoutsStackParamList, 'SelectExerciseScreen'>;
export type ShareWorkoutScreenNavigationProp = StackNavigationProp<WorkoutsStackParamList, 'ShareWorkoutScreen'>;
export type ViewWorkoutScreenRouteProp = RouteProp<WorkoutsStackParamList, 'ViewWorkoutScreen'>;
