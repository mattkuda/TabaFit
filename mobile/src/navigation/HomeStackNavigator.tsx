import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ProfilePage } from '../components/ProfilePage';
import { HomePage } from '../components/HomePage';
import { SearchPage } from '../components/SearchPage';
import { HomeStackParamList } from './navigationTypes';

const Stack = createStackNavigator<HomeStackParamList>();

export const HomeStackNavigator = (): JSX.Element => (
    <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
    >
        <Stack.Screen component={HomePage} name="Home" />
        <Stack.Screen component={SearchPage} name="Search" />
        <Stack.Screen
            component={ProfilePage}
            initialParams={{ userId: null }} // Set up initial params for the user ID
            name="Profile"
        />
    </Stack.Navigator>
);
