import React from 'react';
import { SafeAreaView } from 'react-native';
import { NativeBaseProvider } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';

import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabNavigatorParamList } from './src/types/navigationTypes';
import { TabataSetup } from './src/components/TabataSetup';
import { Timer } from './src/components/Timer';
import { Home } from './src/components/Home';
import { About } from './src/components/About';

// Create a new stack navigator
const TimerStack = createStackNavigator<TabNavigatorParamList>();
const Tab = createBottomTabNavigator<TabNavigatorParamList>();

const TimerStackNavigator = (): JSX.Element => (
    <TimerStack.Navigator>
        <TimerStack.Screen component={TabataSetup} name="TabataSetup" />
        <TimerStack.Screen component={Timer} name="Timer" />
    </TimerStack.Navigator>
);

// Creating separate components for each Icon
const HomeIcon = ({ color, size }): JSX.Element => <Ionicons color={color} name="home-outline" size={size} />;
const TimerIcon = ({ color, size }): JSX.Element => <Ionicons color={color} name="timer-outline" size={size} />;
const AboutIcon = ({ color, size }): JSX.Element => <Ionicons color={color} name="information-circle-outline" size={size} />;

export const App = (): JSX.Element => (
    <NativeBaseProvider>
        <SafeAreaView style={{ flex: 1 }}>
            <NavigationContainer>
                <Tab.Navigator
                    initialRouteName="Home"
                    screenOptions={{ headerShown: false }}
                >
                    <Tab.Screen
                        component={Home}
                        name="Home"
                        options={{
                            tabBarIcon: HomeIcon,
                        }}
                    />
                    <Tab.Screen
                        component={TimerStackNavigator}
                        name="Timer"
                        options={{
                            tabBarIcon: TimerIcon,
                            tabBarStyle: { display: 'none' },
                        }}
                    />
                    <Tab.Screen
                        component={About}
                        name="About"
                        options={{
                            tabBarIcon: AboutIcon,
                        }}
                    />
                </Tab.Navigator>
            </NavigationContainer>
        </SafeAreaView>
    </NativeBaseProvider>
);

// eslint-disable-next-line import/no-default-export
export default App;
