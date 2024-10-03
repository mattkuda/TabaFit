import React, { useState } from 'react';
import {
    StyleSheet, Image, KeyboardAvoidingView, Platform,
    TouchableOpacity,
} from 'react-native';
import { useSetRecoilState } from 'recoil';
import {
    Input, VStack, Button, Text, ScrollView,
    Box,
    Icon,
    Spinner,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { userState } from '../../atoms/userStateAtom';
import { useAuth } from '../../context/AuthContext';
// @ts-ignore
import logo from '../../../assets/tabafit-icon.png';
import { GradientVStack } from '../common/GradientVStack';

const styles = StyleSheet.create({
    logo: {
        maxWidth: '80%',
        height: 100,
        resizeMode: 'contain',
        marginBottom: 20,
        alignSelf: 'center',
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
    const [isLoading, setIsLoading] = useState(false);

    const handleSignUp = async (): Promise<void> => {
        setIsLoading(true);
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
        } finally {
            setIsLoading(false);
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
        <GradientVStack
            backgroundColor="gray9"
            flex={1}
            width="100%"
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <VStack
                        alignItems="center"
                        flex={1}
                        justifyContent="center"
                        padding={4}
                        space={4}
                        width="100%"
                    >
                        <Image
                            alt="TabaFit logo"
                            source={logo}
                            style={styles.logo}
                        />
                        <Input
                            autoCapitalize="none"
                            placeholder="Email"
                            returnKeyType="done"
                            value={email}
                            width="80%"
                            onChangeText={setEmail}
                        />
                        <Input
                            secureTextEntry
                            placeholder="Password"
                            returnKeyType="done"
                            value={password}
                            width="80%"
                            onChangeText={setPassword}
                        />
                        <Input
                            placeholder="First Name"
                            returnKeyType="done"
                            value={firstName}
                            width="80%"
                            onChangeText={setFirstName}
                        />
                        <Input
                            placeholder="Last Name"
                            returnKeyType="done"
                            value={lastName}
                            width="80%"
                            onChangeText={setLastName}
                        />
                        <Input
                            autoCapitalize="none"
                            placeholder="Username"
                            returnKeyType="go"
                            value={username}
                            width="80%"
                            onChangeText={setUsername}
                            onSubmitEditing={handleSignUp}
                        />
                        <TouchableOpacity
                            disabled={isFormIncomplete}
                            style={{ width: '80%' }}
                            onPress={handleSignUp}
                        >
                            <Box
                                alignItems="center"
                                bg={{
                                    linearGradient: {
                                        colors: ['flame.500', 'cherry.500'],
                                        start: [0, 1],
                                        end: [1, 0],
                                    },
                                }}
                                borderRadius="full"
                                flexDirection="row"
                                // @ts-expect-error
                                gap={2}
                                justifyContent="center"
                                p="2"
                            >
                                <Text color="white">
                                    Sign Up
                                </Text>
                                {isLoading ? (
                                    <Spinner color="white" size="sm" />
                                ) : (
                                    <Icon as={Ionicons} color="white" name="chevron-forward" size="sm" />
                                )}
                            </Box>
                        </TouchableOpacity>
                        {process.env.EXPO_PUBLIC_ENVIRONMENT !== 'production' && (
                            <Button
                                borderRadius="full"
                                width="80%"
                                onPress={handlePrefill}
                            >
                                Pre-fill
                            </Button>
                        )}
                        <Text style={{ minHeight: 100, color: 'red' }}>{errorMessage ?? ' '}</Text>
                    </VStack>
                </ScrollView>
            </KeyboardAvoidingView>
        </GradientVStack>
    );
};
