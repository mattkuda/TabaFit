import { RouteProp, ParamListBase } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Workout } from './workouts';

export interface TabNavigatorParamList extends ParamListBase {
    Home: undefined,
    WorkoutTimerPage: Workout,
    WorkoutsPage: undefined,
    ProfilePage: undefined
}

export type HomeScreenRouteProp = RouteProp<TabNavigatorParamList, 'Home'>;
export type HomeScreenNavigationProp = StackNavigationProp<TabNavigatorParamList, 'Home'>;

export type TimerScreenRouteProp = RouteProp<TabNavigatorParamList, 'WorkoutTimerPage'> & {
    params: Workout;
};
export type TimerScreenNavigationProp = StackNavigationProp<TabNavigatorParamList, 'WorkoutTimerPage'>;

export type ProfilePageScreenRouteProp = RouteProp<TabNavigatorParamList, 'ProfilePage'>;
export type ProfilePageScreenNavigationProp = StackNavigationProp<TabNavigatorParamList, 'ProfilePage'>;
