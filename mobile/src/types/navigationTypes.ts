import { RouteProp, ParamListBase } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TabataWorkout } from './workouts';
import { User } from './users';

export interface TabNavigatorParamList extends ParamListBase {
    Home: undefined,
    WorkoutsPage: undefined,
    ProfilePage: undefined,
    EditProfile: { user: User };
    Search: undefined;
    TabataTimerScreen: {workout: TabataWorkout, isInMyWorkouts?: boolean};
    ShuffleScreen: {workout?: TabataWorkout};
    // BuildWorkoutScreen: BuildWorkoutScreenProps
    BuildWorkoutScreen: {
        isShuffle?: boolean;
        customWorkout?: TabataWorkout;
    }
    WorkoutsScreen: undefined;
    ViewWorkoutScreen: { workoutId?: string, workout?: TabataWorkout, isInMyWorkouts?: boolean};
    LoadWorkoutScreen;
    PostScreen: {postId: string}
    ConnectionsScreen: {userId: string}
}

export type HomeScreenRouteProp = RouteProp<TabNavigatorParamList, 'HomePage'>;
export type HomeScreenNavigationProp = StackNavigationProp<TabNavigatorParamList, 'HomePage'>;

export type PostScreenNavigationProp = StackNavigationProp<TabNavigatorParamList, 'PostScreen'>;

export type TimerScreenNavigationProp = StackNavigationProp<TabNavigatorParamList, 'WorkoutTimerPage'>;

export type ProfilePageScreenRouteProp = RouteProp<TabNavigatorParamList, 'ProfilePage'>;
export type ProfilePageScreenNavigationProp = StackNavigationProp<TabNavigatorParamList, 'ProfilePage'>;

export type EditProfileScreenNavigationProp = StackNavigationProp<TabNavigatorParamList, 'EditProfile'> & {
    params: User;
};

export type ShuffleScreenNavigationProp = StackNavigationProp<TabNavigatorParamList, 'ShuffleScreen'> & {
    params: TabataWorkout;
};

export type TabataTimerScreenNavigationProp = StackNavigationProp<TabNavigatorParamList, 'TabataTimer'> & {
    params: TabataWorkout;
};

export type ShareWorkoutScreenNavigationProp = StackNavigationProp<TabNavigatorParamList, 'ShareWorkout'> & {
    params: TabataWorkout;
};

export type BuildWorkoutScreenNavigationProp = StackNavigationProp<TabNavigatorParamList, 'BuildWorkoutScreen'> & {
    params: {isShuffle?: boolean, customWorkout?: TabataWorkout, isSaved?: boolean};
};
// I think I can delete the above params

export type ConnectionsScreenNavigationProp = StackNavigationProp<TabNavigatorParamList, 'ConnectionsScreen'>;
