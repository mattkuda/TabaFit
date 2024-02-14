import React, { useState } from 'react';
import {
    Button, TextInput, View, Text,
} from 'react-native';
import { useSetRecoilState } from 'recoil';
import { Divider } from 'native-base';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { GoogleSigninButton, GoogleSignin } from '@react-native-google-signin/google-signin';
import { useAuth } from '../../context/AuthContext';
import { userState } from '../../atoms/userStateAtom';
import { auth } from '../../../firebase';
import { useNewAuth } from '../../hooks/useNewAuth';

const tokenKey = process.env.EXPO_PUBLIC_TOKEN_KEY;
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export const AuthPage = (): JSX.Element => {
    const [email, setEmail] = useState<string>('test@gmail.com');
    const [password, setPassword] = useState<string>('test');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const setUser = useSetRecoilState(userState);
    const { onLogin, onRegister } = useAuth();
    const { user: newUser } = useNewAuth();
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

    const handleNewLogin = async (): Promise<void> => {
        if (email && password) {
            try {
                await signInWithEmailAndPassword(auth, email, password);
            } catch (err) {
                console.log('got error: ', err.message);
            } finally {
                console.log({ newUser });
            }
        }
    };

    const handleNewSignUp = async (): Promise<void> => {
        let userCredential = null;

        if (email && password) {
            try {
                userCredential = await createUserWithEmailAndPassword(auth, email, password);

                const data = await onRegister(email, password, userCredential.user.uid);

                if (data.success) {
                    // Navigate to the main app
                } else {
                    setErrorMessage(data.message);
                }
            } catch (err) {
                console.log('got error: ', err.message);
            } finally {
                console.log(userCredential.user.uid);
            }
        }
    };

    const handleGoogleSignIn = async (): Promise<void> => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            const { idToken } = userInfo;
            // Use the idToken for authentication on your backend

            // Example: Send the idToken to your backend
            const data = await onRegister(userInfo.user.email, 'test123123', idToken);

            if (data.success) {
            // Navigate to the main app
            } else {
                setErrorMessage(data.message);
            }
        } catch (error) {
            console.log(error);
            setErrorMessage(error.message);
        }
    };

    return (
        <View>
            <Button title="Sign Up" onPress={handleNewSignUp} />
            <Button title="Login" onPress={handleNewLogin} />
            <GoogleSigninButton onPress={handleGoogleSignIn} />
            ;

            <Divider my="2" />

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
