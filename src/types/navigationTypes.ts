import { RouteProp, ParamListBase } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export type TabataParams = {
    warmup: number;
    work: number;
    rest: number;
    exercises: number;
    circuits: number;
    intermission: number;
    cooldown: number;
};

export interface TabNavigatorParamList extends ParamListBase {
    Home: undefined,
    Timer: {
        warmup: number;
        work: number;
        rest: number;
        exercises: number;
        circuits: number;
        intermission: number;
        cooldown: number;
    },
    About: undefined
}

export type HomeScreenRouteProp = RouteProp<TabNavigatorParamList, 'Home'>;
export type HomeScreenNavigationProp = StackNavigationProp<TabNavigatorParamList, 'Home'>;

export type TimerScreenRouteProp = RouteProp<TabNavigatorParamList, 'Timer'> & {
    params: TabataParams;
};
export type TimerScreenNavigationProp = StackNavigationProp<TabNavigatorParamList, 'Timer'>;

export type AboutScreenRouteProp = RouteProp<TabNavigatorParamList, 'About'>;
export type AboutScreenNavigationProp = StackNavigationProp<TabNavigatorParamList, 'About'>;
