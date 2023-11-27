import {
    SafeAreaView,
    Text,
    ViewStyle,
} from 'react-native';
import { NativeBaseProvider } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';

import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useRecoilValue } from 'recoil';
import { ShuffleStackNavigator } from '../navigation/ShuffleStackNavigator';
import { HomeStackNavigator } from '../navigation/HomeStackNavigator';
import { ProfileStackNavigator } from '../navigation/ProfileStackNavigator';
import { useAuth } from '../context/AuthContext';
import { TabNavigatorParamList } from '../types/navigationTypes';
import { TabataSetup } from './TabataSetupPage/TabataSetup';
import { WorkoutTimerPage } from './WorkoutTimerPage';
import { showFooterState } from '../atoms/showFooterAtom';
import { WorkoutsPage } from './WorkoutsPage';
import { AuthPage } from './AuthPage';

const TimerStack = createStackNavigator<TabNavigatorParamList>();
const Tab = createBottomTabNavigator<TabNavigatorParamList>();

const TimerStackNavigator = (): JSX.Element => (
    <TimerStack.Navigator
        initialRouteName="WorkoutsPage"
        screenOptions={{ headerShown: false }}
    >
        <TimerStack.Screen component={WorkoutsPage} name="WorkoutsPage" />
        <TimerStack.Screen
            component={TabataSetup}
            name="TabataSetup"
        />
        <TimerStack.Screen
            component={WorkoutTimerPage}
            name="WorkoutTimerPage"
        />
    </TimerStack.Navigator>
);

const HomeIcon = ({ color, size }): JSX.Element => <Ionicons color={color} name="home-outline" size={size} />;
const TimerIcon = ({ color, size }): JSX.Element => <Ionicons color={color} name="timer-outline" size={size} />;
const ProfilePageIcon = ({ color, size }): JSX.Element => <Ionicons color={color} name="information-circle-outline" size={size} />;

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
        paddingBottom: 0,
        height: 49,
    };
    const tabBarStyleNoFooter: ViewStyle = {
        ...tabBarStyle,
        display: 'none',
    };

    return (
        <NativeBaseProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <NavigationContainer>
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
                            component={TimerStackNavigator}
                            name="My Workouts"
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
                </NavigationContainer>
            </SafeAreaView>
        </NativeBaseProvider>
    );
};
