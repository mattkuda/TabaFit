import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthStackParamList } from './navigationTypes';
import { AuthPage } from '../components/AuthPage';
import { LoginScreen } from '../components/AuthPage/LoginPage';
import { SignupScreen } from '../components/AuthPage/SignupScreen';

const Stack = createStackNavigator<AuthStackParamList>();

export const AuthStackNavigator = (): JSX.Element => (
    <Stack.Navigator
        initialRouteName="AuthPage"
        screenOptions={{
            headerShown: false,
        }}
    >
        <Stack.Screen component={AuthPage} name="AuthPage" />
        <Stack.Screen component={LoginScreen} name="LoginScreen" />
        <Stack.Screen component={SignupScreen} name="SignupScreen" />
    </Stack.Navigator>
);
