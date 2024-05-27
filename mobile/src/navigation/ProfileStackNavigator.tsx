import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from 'native-base';
import { ProfilePage } from '../components/ProfilePage';
import { EditProfilePage } from '../components/EditProfilePage';
import { ProfileStackParamList } from './navigationTypes';
import { ConnectionsScreen } from '../components/ConnectionsScreen';
import { SettingsScreen } from '../components/SettingsScreen';
import { PostScreen } from '../components/PostScreen';
import { AboutScreen } from '../components/AboutScreen';

const Stack = createStackNavigator<ProfileStackParamList>();

export const ProfileStackNavigator = (): JSX.Element => {
    const { colors } = useTheme();

    return (
        <Stack.Navigator
            initialRouteName="Profile"
            screenOptions={{
                headerTitle: 'TabaFit',
                headerStyle: {
                    backgroundColor: colors.gray[900],
                },
                // eslint-disable-next-line
                headerTintColor: "white",
                headerTitleStyle: { color: 'white' },
                headerShadowVisible: false,
            }}
        >
            <Stack.Screen component={ProfilePage} name="Profile" />
            <Stack.Screen
                component={EditProfilePage}
                name="EditProfile"
                options={{
                    headerTitle: 'Edit Prdfile',
                }}
            />
            <Stack.Screen
                component={SettingsScreen}
                name="SettingsScreen"
                options={{
                    headerTitle: 'Settings',
                }}
            />
            <Stack.Screen
                component={AboutScreen}
                name="AboutScreen"
                options={{
                    headerTitle: 'About TabaFit',
                }}
            />
            <Stack.Screen
                component={ConnectionsScreen}
                name="ConnectionsScreen"
                options={{
                    headerTitle: 'Connections',
                }}
            />
            <Stack.Screen
                component={PostScreen}
                name="PostScreen"
                options={{
                    headerTitle: 'Post Details',
                }}
            />
        </Stack.Navigator>
    );
};
