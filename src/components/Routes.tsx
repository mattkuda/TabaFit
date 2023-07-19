import { SafeAreaView } from 'react-native';
import { NativeBaseProvider } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';

import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useRecoilValue } from 'recoil';
import { TabNavigatorParamList } from '../types/navigationTypes';
import { TabataSetup } from './TabataSetup';
import { Timer } from './Timer';
import { Home } from './Home';
import { About } from './About';
import { showFooterState } from '../atoms/showFooterAtom';

// Create a new stack navigator
const TimerStack = createStackNavigator<TabNavigatorParamList>();
const Tab = createBottomTabNavigator<TabNavigatorParamList>();

const TimerStackNavigator = (): JSX.Element => (
    <TimerStack.Navigator
        initialRouteName="TabataSetup"
        screenOptions={{ headerShown: false }}
    >
        <TimerStack.Screen component={TabataSetup} name="TabataSetup" />
        <TimerStack.Screen component={Timer} name="Timer" />
    </TimerStack.Navigator>
);

// Creating separate components for each Icon
const HomeIcon = ({ color, size }): JSX.Element => <Ionicons color={color} name="home-outline" size={size} />;
const TimerIcon = ({ color, size }): JSX.Element => <Ionicons color={color} name="timer-outline" size={size} />;
const AboutIcon = ({ color, size }): JSX.Element => <Ionicons color={color} name="information-circle-outline" size={size} />;

export const Routes = (): JSX.Element => {
    const showFooter = useRecoilValue(showFooterState);

    return (
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
                                unmountOnBlur: true, // Add this line
                                tabBarStyle: !showFooter ? { display: 'none' } : undefined,
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
};
