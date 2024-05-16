import {
    ViewStyle,
} from 'react-native';
import { useTheme } from 'native-base';
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
import { WorkoutsStackNavigator } from '../navigation/WorkoutsStackNavigator';
import { useUserInfo } from '../hooks/useUserInfo';
import { AuthStackNavigator } from '../navigation/AuthStackNavigator';
import { SignUpWizardStackNavigator } from '../navigation/SignUpWizardStackNavigator';
import { wizardActiveState } from '../atoms/wizardActiveAtom';
import { ProfilePicture } from './ProfilePicture';

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
                borderColor={focused ? 'flame' : 'white'}
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
    const { authState } = useAuth();
    const wizardActive = useRecoilValue(wizardActiveState);
    const { colors } = useTheme();

    if (!authState.authenticated) {
        return (
            <NavigationContainer>
                <AuthStackNavigator />
            </NavigationContainer>
        );
    }

    if (authState.authenticated && wizardActive) {
        return (
            <NavigationContainer>
                <SignUpWizardStackNavigator />
            </NavigationContainer>
        );
    }

    const tabBarStyle: ViewStyle = {
        // paddingBottom: 0,
        // height: 49,
        backgroundColor: colors.gray[900], // Set the background color to gray[900]
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
                    tabBarStyle: { backgroundColor: colors.gray[900] },
                    tabBarActiveTintColor: '#F3754B',
                    tabBarInactiveTintColor: 'white',
                    // tabBarPressColor: '#F3754B',
                    // tabBarIndicatorStyle: { backgroundColor: '#F3754B' },
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
