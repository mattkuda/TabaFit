import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { TabataExercise, TabataWorkout } from '../types/workouts';
import { User } from '../types/users';

// Home Stack
export type HomeStackParamList = {
    HomePage: undefined;
    Search: undefined;
    Profile: { userId: string | null }
    PostScreen: { postId: string }
    NotificationsScreen: undefined
    ViewWorkoutScreen: { workoutId?: string, workout?: TabataWorkout };
    BuildWorkoutScreen: {
        isShuffle?: boolean;
        customWorkout?: TabataWorkout;
    }
    TabataTimerScreen: { workout: TabataWorkout, isInMyWorkouts?: boolean };
    ShareWorkoutScreen: { workout: TabataWorkout, completedAt: Date };
    ConnectionsScreen: { userId: string };
    SignUpWizardStack: undefined;
};

export type SearchScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'Search'>;
export type NotificationsScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'NotificationsScreen'>;
//

// Profile Stack
export type ProfileStackParamList = {
    Profile: { userId?: string };
    EditProfile: { user: User };
    ConnectionsScreen: { userId: string }
    SettingsScreen: { user: User };
    PostScreen: { postId: string };
    AboutScreen: undefined;
    PreferencesScreen: undefined;
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
    SavedWorkoutsScreen;
    TabataTimer: { workout: TabataWorkout, isInMyWorkouts?: boolean };
    ShareWorkoutScreen: { workout: TabataWorkout, completedAt: Date, isInMyWorkouts?: boolean };
};

export type ShuffleScreenRouteProp = RouteProp<ShuffleStackParamList, 'ShuffleScreen'>;
export type TabataTimerScreenRouteProp = RouteProp<ShuffleStackParamList, 'TabataTimer'>;
export type ShareWorkoutScreenRouteProp = RouteProp<ShuffleStackParamList, 'ShareWorkoutScreen'>;
export type SavedWorkoutsScreenRouteProp = RouteProp<ShuffleStackParamList, 'SavedWorkoutsScreen'>;

// OldWorkouts Stack
export type OldWorkoutsStackParamList = {
    SavedWorkoutsScreen;
    MyCreatedWorkoutsScreen;
    BuildWorkoutScreen;
    SelectExerciseScreen: { onSelectWorkout: (exercise: TabataExercise) => void };
}
export type OldBuildWorkoutScreenRouteProp = StackNavigationProp<OldWorkoutsStackParamList, 'BuildWorkoutScreen'>;
export type OldSelectExerciseScreenRouteProp = StackNavigationProp<OldWorkoutsStackParamList, 'SelectExerciseScreen'>;

export interface BuildWorkoutScreenProps {
    isShuffle?: boolean;
    customWorkout?: TabataWorkout;
}
export interface ShuffleWorkoutScreenProps {
    workout?: TabataWorkout;
}

// (New) Workouts Stack
export type WorkoutsStackParamList = {
    WorkoutsScreen;
    SavedWorkoutsScreen;
    MyCreatedWorkoutsScreen;
    BuildWorkoutScreen: {
        shouldUpdate?: boolean;
        workout?: TabataWorkout;
    };
    ShuffleWorkoutScreen: {
        workout?: TabataWorkout;
    };
    ViewWorkoutScreen: { workoutId?: string, workout?: TabataWorkout, isInMyWorkouts?: boolean };
    SelectExerciseScreen: { onSelectWorkout: (exercise: TabataExercise) => void };
    TabataTimerScreen: { workout: TabataWorkout, isInMyWorkouts?: boolean };
    ShareWorkoutScreen: { workout: TabataWorkout, completedAt: Date };
    DiscoverWorkoutsScreen;
    PremadeWorkoutsScreen;
    ManualWorkoutScreen;
}
export type BuildWorkoutScreenRouteProp = StackNavigationProp<WorkoutsStackParamList, 'BuildWorkoutScreen'>;
export type ShuffleWorkoutScreenRouteProp = StackNavigationProp<WorkoutsStackParamList, 'ShuffleWorkoutScreen'>;
export type SelectExerciseScreenRouteProp = StackNavigationProp<WorkoutsStackParamList, 'SelectExerciseScreen'>;
export type ShareWorkoutScreenNavigationProp = StackNavigationProp<WorkoutsStackParamList, 'ShareWorkoutScreen'>;
export type ViewWorkoutScreenRouteProp = RouteProp<WorkoutsStackParamList, 'ViewWorkoutScreen'>;
export type DiscoverWorkoutsScreenRouteProp = RouteProp<WorkoutsStackParamList, 'DiscoverWorkoutsScreen'>;
export type PremadeWorkoutsScreenRouteProp = RouteProp<WorkoutsStackParamList, 'PremadeWorkoutsScreen'>;
export type ManualWorkoutScreenRouteProp = RouteProp<WorkoutsStackParamList, 'ManualWorkoutScreen'>;

// Auth Stack
export type AuthStackParamList = {
    AuthPage: undefined;
    LoginScreen: undefined;
    SignupScreen: undefined;
};

export type SignUpWizardStackParamList = {
    WelcomeScreen: undefined;
    TabataExplanationScreen: undefined;
    TutorialScreen: undefined;
    SuggestedFollowsScreen: undefined;
    SuggestedWorkoutsScreen: undefined;
};
export type WelcomeScreenNavigationProp = StackNavigationProp<SignUpWizardStackParamList, 'WelcomeScreen'>;
export type TabataExplanationScreenNavigationProp = StackNavigationProp<SignUpWizardStackParamList, 'TabataExplanationScreen'>;
export type TutorialScreenNavigationProp = StackNavigationProp<SignUpWizardStackParamList, 'TutorialScreen'>;
export type SuggestedFollowsScreenNavigationProp = StackNavigationProp<SignUpWizardStackParamList, 'SuggestedFollowsScreen'>;
export type SuggestedWorkoutsScreenNavigationProp = StackNavigationProp<SignUpWizardStackParamList, 'SuggestedWorkoutsScreen'>;
