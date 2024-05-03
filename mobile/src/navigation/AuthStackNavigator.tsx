import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthStackParamList } from './navigationTypes';
import { AuthPage } from '../components/AuthPage';
import { LoginScreen } from '../components/AuthPage/LoginPage';
import { SignupScreen } from '../components/AuthPage/SignupScreen';
import { BackButton } from '../components/BackButton';

const Stack = createStackNavigator<AuthStackParamList>();
const headerLeftComponent = (): JSX.Element => <BackButton />;

export const AuthStackNavigator = (): JSX.Element => (
    <Stack.Navigator initialRouteName="AuthPage">
        <Stack.Screen component={AuthPage} name="AuthPage" options={{ headerShown: false }} />
        <Stack.Screen
            component={LoginScreen}
            name="LoginScreen"
            options={{
                headerLeft: headerLeftComponent,
                headerTransparent: true,
            }}
        />
        <Stack.Screen
            component={SignupScreen}
            name="SignupScreen"
            options={{
                headerLeft: headerLeftComponent,
                headerTransparent: true,
            }}
        />
    </Stack.Navigator>
);
