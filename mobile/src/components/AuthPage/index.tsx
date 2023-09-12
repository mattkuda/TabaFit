import React, { useState } from 'react';
import {
    Button, TextInput, View, Text,
} from 'react-native';
import { useSetRecoilState } from 'recoil';
import { useAuth } from '../../context/AuthContext';
import { isAuthenticatedState } from '../../atoms/isAuthenticatedAtom';

export const AuthPage = (): JSX.Element => {
    const [email, setEmail] = useState<string>('test@gmail.com');
    const [password, setPassword] = useState<string>('test');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const setIsAuthenticated = useSetRecoilState(isAuthenticatedState);
    const { onLogin, onRegister } = useAuth();

    const handleSignUp = async (): Promise<void> => {
        try {
            const data = await onRegister(email, password);

            if (data.success) {
                // Navigate to the main app
            } else {
                setErrorMessage(data.message);
            }
        } catch (error) {
            setErrorMessage(error.message);
        }
    };
    const tokenKey = process.env.EXPO_PUBLIC_TOKEN_KEY;
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;

    const handleSignIn = async (): Promise<void> => {
        try {
            const data = await onLogin(email, password);

            setErrorMessage(JSON.stringify(data));

            if (data.success) {
                setIsAuthenticated(true); // This will update the global state in Recoil
                // Navigate to the main app
            } else {
                // setErrorMessage(data.message);
            }
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    return (
        <View>
            <TextInput placeholder="Email" value={email} onChangeText={(text: string): void => setEmail(text.toLocaleLowerCase())} />
            <TextInput secureTextEntry placeholder="Password" value={password} onChangeText={(text: string): void => setPassword(text)} />
            <Button title="Sign Up" onPress={handleSignUp} />
            <Button title="Sign In" onPress={handleSignIn} />
            {errorMessage && <Text>{errorMessage}</Text>}
            <Text>{tokenKey}</Text>
            <Text>{apiUrl}</Text>
        </View>
    );
};
