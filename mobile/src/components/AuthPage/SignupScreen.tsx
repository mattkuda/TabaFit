import React, { useState } from 'react';
import {
    TextInput, StyleSheet, Image, TouchableOpacity,
} from 'react-native';
import { useSetRecoilState } from 'recoil';
import {
    Button, VStack, Text, IconButton,
} from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { userState } from '../../atoms/userStateAtom';
import { useAuth } from '../../context/AuthContext';
// @ts-ignore
import logo from '../../../assets/TabatableBasicLogo.png'; // Adjust the path and filename as necessary
import { AuthStackParamList } from '../../navigation/navigationTypes';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    logo: {
        maxWidth: '80%',
        height: 100,
        resizeMode: 'contain',
        marginHorizontal: 100,
        marginBottom: 20,
    },
    input: {
        width: '80%',
        padding: 10,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 5,
    },
});

export const SignupScreen = (): JSX.Element => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const setUser = useSetRecoilState(userState);
    const { onRegister } = useAuth();
    const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();

    const handleSignUp = async (): Promise<void> => {
        try {
            const data = await onRegister(email, password, firstName, lastName, username);

            if (data.success) {
                setUser((prevState) => ({
                    ...prevState,
                    isAuthenticated: true,
                    user: data.user,
                }));
            } else {
                setErrorMessage(data.message);
            }
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    const handlePrefill = async (): Promise<void> => {
        const randomNumber = Math.floor(Math.random() * 10000) + 1;

        setEmail(`test${randomNumber}@gmail.com`);
        setUsername(`test${randomNumber}`);
        setFirstName(`test${randomNumber}`);
        setLastName(`test${randomNumber}`);
        setPassword('test');
    };

    const isFormIncomplete = !email || !password || !firstName || !lastName || !username;

    return (
        <VStack
            alignItems="center"
            backgroundColor="gray9"
            flex={1}
            justifyContent="center"
            space={4}
            width="100%"
        >
            <IconButton
                icon={<Ionicons color="white" name="arrow-back" size={24} />}
                left={4}
                position="absolute"
                top={4}
                zIndex={1}
                onPress={(): void => navigation.goBack()}
            />
            <Image source={logo} style={styles.logo} />
            <TextInput
                autoCapitalize="none"
                placeholder="Email"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
            />
            <TextInput secureTextEntry placeholder="Password" style={styles.input} value={password} onChangeText={setPassword} />
            <TextInput placeholder="First Name" style={styles.input} value={firstName} onChangeText={setFirstName} />
            <TextInput placeholder="Last Name" style={styles.input} value={lastName} onChangeText={setLastName} />
            <TextInput
                autoCapitalize="none"
                placeholder="Username"
                style={styles.input}
                value={username}
                onChangeText={setUsername}
            />
            <Button
                borderRadius="full"
                disabled={isFormIncomplete}
                width="80%"
                onPress={handleSignUp}
            >
                Sign Up
            </Button>
            <Button
                borderRadius="full"
                width="80%"
                onPress={handlePrefill}
            >
                Pre-fill
            </Button>
            <TouchableOpacity onPress={(): void => navigation.navigate('LoginScreen')}>
                <Text color="white">
                    Already have an account?
                    <Text textDecorationLine="underline">Log in</Text>
                </Text>
            </TouchableOpacity>
            <Text>{errorMessage}</Text>
        </VStack>
    );
};
