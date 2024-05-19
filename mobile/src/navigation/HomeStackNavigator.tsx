import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HStack, useTheme } from 'native-base';
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
import { ConnectionsScreen } from '../components/ConnectionsScreen';
import { DebugModeButton } from '../components/DebugModeButton';

const Stack = createStackNavigator<HomeStackParamList>();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SearchButtonComponent = (): JSX.Element => <Searchbutton />;
const HeaderRightComponent = (): JSX.Element => (
    <HStack marginRight="2" space={2}>
        <NotificationsButton />
        {process.env.ENVIRONMENT !== 'production' && <DebugModeButton />}
    </HStack>
);

export const HomeStackNavigator = (): JSX.Element => {
    const { colors } = useTheme();

    return (
        <Stack.Navigator
            initialRouteName="HomePage"
            screenOptions={{
                headerTitle: 'TabaFit',

                headerStyle: {
                    backgroundColor: colors.gray[900],
                },
                headerTintColor: 'white',
                headerShadowVisible: false,
            }}
        >
            <Stack.Screen
                component={HomePage}
                name="HomePage"
                options={{
                    headerTitle: 'Home',
                    headerLeft: SearchButtonComponent,
                    headerRight: HeaderRightComponent,
                }}
            />
            <Stack.Screen
                component={SearchPage}
                name="Search"
                options={{
                    headerTitle: 'Search',
                }}
            />
            <Stack.Screen
                component={ProfilePage}
                initialParams={{ userId: null }}
                name="Profile"
            />
            <Stack.Screen
                component={PostScreen}
                name="PostScreen"
                options={{
                    headerTitle: 'Post Details',
                }}
            />
            <Stack.Screen
                component={NotificationsScreen}
                name="NotificationsScreen"
                options={{
                    headerTitle: 'Notifications',
                }}
            />
            <Stack.Screen
                component={ViewWorkoutScreen}
                name="ViewWorkoutScreen"
                options={{
                    headerTitle: 'View Workout',
                }}
            />
            <Stack.Screen
                component={BuildWorkoutScreen}
                name="BuildWorkoutScreen"
                options={{
                    headerTitle: 'Build Workout',
                }}
            />
            <Stack.Screen component={TabataTimerScreen} name="TabataTimerScreen" />
            <Stack.Screen
                component={ShareWorkoutScreen}
                name="ShareWorkoutScreen"
                options={{
                    headerTitle: 'Share Workout',
                }}
            />
            <Stack.Screen
                component={ConnectionsScreen}
                name="ConnectionsScreen"
                options={{
                    headerTitle: 'Connections',
                }}
            />
        </Stack.Navigator>
    );
};
