import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ProfilePage } from '../components/ProfilePage';
import { EditProfilePage } from '../components/EditProfilePage';
import { ProfileStackParamList } from './navigationTypes';

const Stack = createStackNavigator<ProfileStackParamList>();

export const ProfileStackNavigator = (): JSX.Element => (
    <Stack.Navigator
        initialRouteName="Profile"
    >
        <Stack.Screen component={ProfilePage} name="Profile" />
        <Stack.Screen component={EditProfilePage} name="EditProfile" />
    </Stack.Navigator>
);
