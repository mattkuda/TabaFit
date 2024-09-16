import React, { useState } from 'react';
import {
    StyleSheet, Image, ScrollView, KeyboardAvoidingView, Platform,
    TouchableOpacity,
} from 'react-native';
import { useSetRecoilState } from 'recoil';
import {
    VStack, Text, Input,
    Box,
    Icon,
    Button,
    Spinner,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { userState } from '../../atoms/userStateAtom';
import { useAuth } from '../../context/AuthContext';
// @ts-ignore
import logo from '../../../assets/tabafit-icon.png';
import { GradientVStack } from '../common/GradientVStack';

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

export const LoginScreen = (): JSX.Element => {
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const setUser = useSetRecoilState(userState);
    const { onLogin } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const handleSignIn = async (): Promise<void> => {
        setIsLoading(true);

        try {
            const data = await onLogin(emailOrUsername, password);

            if (data.success) {
                setUser((prevState) => ({
                    ...prevState,
                    isAuthenticated: true,
                    user: data.user,
                }));
                setErrorMessage('');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    setErrorMessage(error.response.data.message);
                } else {
                    setErrorMessage('An error occurred. Please try again.');
                }
            } else {
                setErrorMessage('An error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handlePrefill = async (): Promise<void> => {
        setEmailOrUsername('test@gmail.com');
        setPassword('test');
        await handleSignIn();
    };

    const handlePrefillOther = async (): Promise<void> => {
        setEmailOrUsername('other@gmail.com');
        setPassword('other');
        await handleSignIn();
    };

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
                            alt="TabaFit Logo"
                            source={logo}
                            style={styles.logo}
                        />
                        <Input
                            autoCapitalize="none"
                            placeholder="Username or email"
                            value={emailOrUsername}
                            width="80%"
                            onChangeText={setEmailOrUsername}
                        />
                        <Input
                            secureTextEntry
                            placeholder="Password"
                            value={password}
                            width="80%"
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity
                            disabled={isLoading}
                            style={{ width: '80%' }}
                            onPress={handleSignIn}
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
                                <Text
                                    color="white" // Ensure the text color is white
                                >
                                    Login
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
                        {process.env.EXPO_PUBLIC_ENVIRONMENT !== 'production' && (
                            <Button
                                borderRadius="full"
                                width="80%"
                                onPress={handlePrefillOther}
                            >
                                Pre-fill for Other User
                            </Button>
                        )}
                        <Text style={{ minHeight: 100, color: 'red' }}>{errorMessage ?? ' '}</Text>
                    </VStack>
                </ScrollView>
            </KeyboardAvoidingView>
        </GradientVStack>
    );
};
