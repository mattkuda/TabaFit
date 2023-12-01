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
    TabataTimerScreen: {workout: TabataWorkout};
    ShuffleScreen: {workout?: TabataWorkout};
}

export type HomeScreenRouteProp = RouteProp<TabNavigatorParamList, 'Home'>;
export type HomeScreenNavigationProp = StackNavigationProp<TabNavigatorParamList, 'Home'>;

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

export type ShareWorkoutrScreenNavigationProp = StackNavigationProp<TabNavigatorParamList, 'ShareWorkout'> & {
    params: TabataWorkout;
};
