import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ProfilePage } from '../components/ProfilePage';
import { EditProfilePage } from '../components/EditProfilePage';
import { ProfileStackParamList } from './navigationTypes';
import { ConnectionsScreen } from '../components/ConnectionsScreen';
import { SettingsScreen } from '../components/SettingsScreen';
import { PostScreen } from '../components/PostScreen';

const Stack = createStackNavigator<ProfileStackParamList>();

export const ProfileStackNavigator = (): JSX.Element => (
    <Stack.Navigator
        initialRouteName="Profile"
        screenOptions={{
            headerTitle: 'Taboot',
            headerStyle: {
                backgroundColor: 'black',
            },
            headerTintColor: 'white',
        }}
    >
        <Stack.Screen component={ProfilePage} name="Profile" />
        <Stack.Screen component={EditProfilePage} name="EditProfile" />
        <Stack.Screen component={SettingsScreen} name="SettingsScreen" />
        <Stack.Screen component={ConnectionsScreen} name="ConnectionsScreen" />
        <Stack.Screen component={PostScreen} name="PostScreen" />
    </Stack.Navigator>
);
