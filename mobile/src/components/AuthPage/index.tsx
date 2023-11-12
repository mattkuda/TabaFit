import React, { useState } from 'react';
import {
    Button, TextInput, View, Text,
} from 'react-native';
import { useSetRecoilState } from 'recoil';
import { useAuth } from '../../context/AuthContext';
import { userState } from '../../atoms/userStateAtom';

const tokenKey = process.env.EXPO_PUBLIC_TOKEN_KEY;
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export const AuthPage = (): JSX.Element => {
    const [email, setEmail] = useState<string>('test@gmail.com');
    const [password, setPassword] = useState<string>('test');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const setUser = useSetRecoilState(userState);
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

    const handleSignIn = async (): Promise<void> => {
        try {
            const data = await onLogin(email, password);

            setErrorMessage(JSON.stringify(data));

            if (data.success) {
                setUser((prevState) => ({
                    ...prevState,
                    isAuthenticated: true,
                    user: data.user, // Assuming 'data.user' contains the user data returned from the server
                }));
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
