import { StackNavigationProp } from '@react-navigation/stack';
import { User } from '../types/users';

export type ProfileStackParamList = {
    Profile: undefined;
    EditProfile: { user: User };
};

export type HomeStackParamList = {
    Home: undefined;
    Search: undefined;
};

export type SearchScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'Search'>;
