import {
    SafeAreaView,
    Text,
    ViewStyle,
} from 'react-native';
import { Avatar } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useRecoilValue } from 'recoil';
import React from 'react';
import { HomeStackNavigator } from '../navigation/HomeStackNavigator';
import { ProfileStackNavigator } from '../navigation/ProfileStackNavigator';
import { useAuth } from '../context/AuthContext';
import { TabNavigatorParamList } from '../types/navigationTypes';
import { showFooterState } from '../atoms/showFooterAtom';
import { AuthPage } from './AuthPage';
import { Searchbutton } from './SearchButtons';
import { WorkoutsStackNavigator } from '../navigation/WorkoutsStackNavigator';
import { useUserInfo } from '../hooks/useUserInfo';

const Tab = createBottomTabNavigator<TabNavigatorParamList>();

const HomeIcon = ({ color, size }): JSX.Element => <Ionicons color={color} name="home-outline" size={size} />;
const TimerIcon = ({ color, size }): JSX.Element => <Ionicons color={color} name="timer-outline" size={size} />;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SearchButtonComponent = (): JSX.Element => <Searchbutton />;

const ProfileTabIcon = ({ focused, color, size }): JSX.Element => {
    const { authState } = useAuth();
    const { data } = useUserInfo(authState.userId);
    const profilePictureUrl = data?.profilePictureUrl; // Ensure you have the profile picture URL here

    // If there's a profile picture URL, show it, otherwise show a default icon
    if (profilePictureUrl) {
        return (
            <Avatar
                borderColor={focused ? 'primary.500' : 'gray.300'} // Highlight the border if the tab is focused
                borderWidth={2}
                size="sm" // You can adjust the size to fit the tab bar's design
                source={{
                    uri: profilePictureUrl,
                }}
            />
        );
    }
    // Fallback icon if no profile picture is available
    return <Ionicons color={color} name="person-circle-outline" size={size} />;
};

export const Routes = (): JSX.Element => {
    const showFooter = useRecoilValue(showFooterState);
    const { authState } = useAuth();

    if (!authState.authenticated) {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <AuthPage />
                <Text>
                    {authState.authenticated ? 'y' : 'n'}
                </Text>
            </SafeAreaView>
        );
    }

    const tabBarStyle: ViewStyle = {
        // paddingBottom: 0,
        // height: 49,
    };
    const tabBarStyleNoFooter: ViewStyle = {
        ...tabBarStyle,
        display: 'none',
    };

    return (
        <NavigationContainer>
            <SafeAreaView style={{ flex: 1 }}>
                <Tab.Navigator
                    initialRouteName="Home"
                    screenOptions={{
                        headerShown: false,
                    }}
                >
                    <Tab.Screen
                        component={HomeStackNavigator}
                        name="Home"
                        options={{
                            tabBarIcon: HomeIcon,
                            tabBarStyle,
                        }}
                    />
                    <Tab.Screen
                        component={WorkoutsStackNavigator}
                        name="Workouts"
                        options={{
                            tabBarIcon: TimerIcon,
                            tabBarStyle: !showFooter ? tabBarStyleNoFooter : tabBarStyle,
                        }}
                    />
                    <Tab.Screen
                        component={ProfileStackNavigator}
                        name="Profile"
                        options={{
                            tabBarIcon: ProfileTabIcon,
                            tabBarStyle,
                        }}
                    />
                </Tab.Navigator>
            </SafeAreaView>
        </NavigationContainer>
    );
};
