import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ProfilePage } from '../components/ProfilePage';
import { EditProfilePage } from '../components/EditProfilePage';
import { ProfileStackParamList } from './navigationTypes';
import { ConnectionsScreen } from '../ConnectionsScreen';

const Stack = createStackNavigator<ProfileStackParamList>();

export const ProfileStackNavigator = (): JSX.Element => (
    <Stack.Navigator
        initialRouteName="Profile"
        screenOptions={{
            headerTitle: 'Tabatable',
            headerStyle: {
                backgroundColor: 'black',
            },
            headerTintColor: 'white',
        }}
    >
        <Stack.Screen component={ProfilePage} name="Profile" />
        <Stack.Screen component={EditProfilePage} name="EditProfile" />
        <Stack.Screen component={ConnectionsScreen} name="ConnectionsScreen" />
    </Stack.Navigator>
);
