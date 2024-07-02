import React from 'react';
import { ViewStyle } from 'react-native';
import { useTheme } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useRecoilValue } from 'recoil';
import { HomeStackNavigator } from '../navigation/HomeStackNavigator';
import { ProfileStackNavigator } from '../navigation/ProfileStackNavigator';
import { useAuth } from '../context/AuthContext';
import { TabNavigatorParamList } from '../types/navigationTypes';
import { showFooterState } from '../atoms/showFooterAtom';
import { WorkoutsStackNavigator } from '../navigation/WorkoutsStackNavigator';
import { AuthStackNavigator } from '../navigation/AuthStackNavigator';
import { SignUpWizardStackNavigator } from '../navigation/SignUpWizardStackNavigator';
import { ProfilePicture } from './ProfilePicture';
import { useUserInfo } from '../hooks/useUserInfo';

const Tab = createBottomTabNavigator<TabNavigatorParamList>();

const HomeIcon = ({ color, size }): JSX.Element => <Ionicons color={color} name="home-outline" size={size} />;
const TimerIcon = ({ color, size }): JSX.Element => <Ionicons color={color} name="timer-outline" size={size} />;

const ProfileTabIcon = ({ focused, color, size }): JSX.Element => {
    const { authState } = useAuth();
    const { data } = useUserInfo(authState.userId);
    const profilePictureUrl = data?.profilePictureUrl;

    if (profilePictureUrl) {
        return (
            <ProfilePicture
                borderColor={focused ? 'primary' : 'white'}
                borderWidth={1}
                size="sm"
                user={data}
            />
        );
    }
    // Fallback icon if no profile picture is available
    return <Ionicons color={color} name="person-circle-outline" size={size} />;
};

export const Routes = (): JSX.Element => {
    const showFooter = useRecoilValue(showFooterState);
    const { authState, hasSeenTutorial } = useAuth();
    const { colors } = useTheme();

    if (authState.authenticated === null || hasSeenTutorial === null) {
        // Show a loading indicator while checking authentication and tutorial status
        return null;
    }

    if (!authState.authenticated) {
        return (
            <NavigationContainer>
                <AuthStackNavigator />
            </NavigationContainer>
        );
    }

    if (authState.authenticated && !hasSeenTutorial) {
        return (
            <NavigationContainer>
                <SignUpWizardStackNavigator />
            </NavigationContainer>
        );
    }

    const tabBarStyle: ViewStyle = {
        backgroundColor: colors.gray[900],
        borderTopWidth: 0,
        borderTopColor: colors.gray[500],
    };
    const tabBarStyleNoFooter: ViewStyle = {
        ...tabBarStyle,
        display: 'none',
    };

    return (
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName="Home"
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: { backgroundColor: colors.gray[700] },
                    tabBarActiveTintColor: '#ff9f27',
                    tabBarInactiveTintColor: 'white',
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
                    name="ProfileStack"
                    options={{
                        tabBarIcon: ProfileTabIcon,
                        tabBarStyle,
                        tabBarLabel: 'Profile',
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
};
