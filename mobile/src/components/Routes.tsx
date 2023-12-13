import {
    SafeAreaView,
    Text,
    ViewStyle,
} from 'react-native';
import { NativeBaseProvider } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';

import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useRecoilValue } from 'recoil';
import React from 'react';
import { ShuffleStackNavigator } from '../navigation/ShuffleStackNavigator';
import { HomeStackNavigator } from '../navigation/HomeStackNavigator';
import { ProfileStackNavigator } from '../navigation/ProfileStackNavigator';
import { useAuth } from '../context/AuthContext';
import { TabNavigatorParamList } from '../types/navigationTypes';
import { showFooterState } from '../atoms/showFooterAtom';
import { AuthPage } from './AuthPage';
import { Searchbutton } from './SearchButtons';
import { WorkoutsStackNavigator } from '../navigation/WorkoutsStackNavigator';

const Tab = createBottomTabNavigator<TabNavigatorParamList>();

const HomeIcon = ({ color, size }): JSX.Element => <Ionicons color={color} name="home-outline" size={size} />;
const TimerIcon = ({ color, size }): JSX.Element => <Ionicons color={color} name="timer-outline" size={size} />;
const ProfilePageIcon = ({ color, size }): JSX.Element => <Ionicons color={color} name="information-circle-outline" size={size} />;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SearchButtonComponent = (): JSX.Element => <Searchbutton />;

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
        <NativeBaseProvider>
            <NavigationContainer>
                <SafeAreaView style={{ flex: 1 }}>
                    <Tab.Navigator
                        initialRouteName="HomePage"
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
                            name="View Workouts"
                            options={{
                                tabBarIcon: TimerIcon,
                                tabBarStyle: !showFooter ? tabBarStyleNoFooter : tabBarStyle,
                            }}
                        />
                        <Tab.Screen
                            component={ShuffleStackNavigator}
                            name="Shuffle"
                            options={{
                                tabBarIcon: TimerIcon,
                                tabBarStyle: !showFooter ? tabBarStyleNoFooter : tabBarStyle,
                            }}
                        />
                        <Tab.Screen
                            component={ProfileStackNavigator}
                            name="Profile"
                            options={{
                                tabBarIcon: ProfilePageIcon,
                                tabBarStyle,
                            }}
                        />
                    </Tab.Navigator>
                </SafeAreaView>
            </NavigationContainer>
        </NativeBaseProvider>
    );
};
