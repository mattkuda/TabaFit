import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { PostScreen } from '../components/PostScreen';
import { ProfilePage } from '../components/ProfilePage';
import { HomePage } from '../components/HomePage';
import { SearchPage } from '../components/SearchPage';
import { HomeStackParamList } from './navigationTypes';
import { Searchbutton } from '../components/SearchButtons';
import { NotificationsScreen } from '../components/NotificationsScreen';
import { NotificationsButton } from '../components/NotificationsButton';
import { ViewWorkoutScreen } from '../components/ViewWorkoutScreen';
import { BuildWorkoutScreen } from '../components/BuildWorkoutScreen';
import { TabataTimerScreen } from '../components/TabataTimerScreen';
import { ShareWorkoutScreen } from '../components/ShareWorkoutScreen';

const Stack = createStackNavigator<HomeStackParamList>();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SearchButtonComponent = (): JSX.Element => <Searchbutton />;
const NotificationsButtonComponent = (): JSX.Element => <NotificationsButton />;

export const HomeStackNavigator = (): JSX.Element => (
    <Stack.Navigator
        initialRouteName="HomePage"
    >
        <Stack.Screen
            component={HomePage}
            name="HomePage"
            options={{
                headerLeft: SearchButtonComponent,
                headerRight: NotificationsButtonComponent,
            }}
        />
        <Stack.Screen component={SearchPage} name="Search" />
        <Stack.Screen
            component={ProfilePage}
            initialParams={{ userId: null }}
            name="Profile"
        />
        <Stack.Screen component={PostScreen} name="PostScreen" />
        <Stack.Screen component={NotificationsScreen} name="NotificationsScreen" />
        <Stack.Screen component={ViewWorkoutScreen} name="ViewWorkoutScreen" />
        <Stack.Screen component={BuildWorkoutScreen} name="BuildWorkoutScreen" />
        <Stack.Screen component={TabataTimerScreen} name="TabataTimerScreen" />
        <Stack.Screen component={ShareWorkoutScreen} name="ShareWorkoutScreen" />
    </Stack.Navigator>
);
