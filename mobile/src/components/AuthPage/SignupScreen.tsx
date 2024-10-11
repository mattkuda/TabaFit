import React, { useState } from 'react';
import {
    StyleSheet, Image, KeyboardAvoidingView, Platform,
    TouchableOpacity,
    Linking,
} from 'react-native';
import { useSetRecoilState } from 'recoil';
import {
    Input, VStack, Button, Text, ScrollView,
    Box,
    Icon,
    Spinner,
    Checkbox,
    HStack,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
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
    const [isPrivacyPolicyChecked, setIsPrivacyPolicyChecked] = useState(false);
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
        const randomNumber = Math.floor(Math.random() * 10000) + 1;

        setEmail(`test${randomNumber}@gmail.com`);
        setUsername(`test${randomNumber}`);
        setFirstName(`test${randomNumber}`);
        setLastName(`test${randomNumber}`);
        setPassword('test');
    };

    const isFormIncomplete = !email || !password || !firstName || !lastName || !username || !isPrivacyPolicyChecked;

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
                        <HStack alignContent="top" width="80%">
                            <Checkbox
                                bgColor={isPrivacyPolicyChecked ? 'primary' : 'gray.900'}
                                isChecked={isPrivacyPolicyChecked}
                                size="md"
                                value="privacyPolicy"
                                onChange={setIsPrivacyPolicyChecked}
                            >
                                <Text fontSize="xs">
                                    I agree to the
                                    <Text onPress={(): Promise<void> => Linking.openURL('https://www.freeprivacypolicy.com/live/619bc4e9-efb1-45b2-91d2-f5c7bc802221')}>
                                        {' '}
                                        Privacy Policy
                                    </Text>
                                    {' '}
                                    and the
                                    {' '}
                                    <Text onPress={(): Promise<void> => Linking.openURL('https://www.apple.com/legal/internet-services/itunes/dev/stdeula/')}>
                                        Apple Standard EULA
                                    </Text>
                                    .
                                </Text>
                            </Checkbox>
                        </HStack>
                        <TouchableOpacity
                            disabled={isFormIncomplete}
                            style={{ width: '80%' }}
                            onPress={handleSignUp}
                        >
                            <Box
                                alignItems="center"
                                bg={{
                                    linearGradient: isFormIncomplete
                                        ? {
                                            colors: ['gray.400', 'gray.500'],
                                            start: [0, 1],
                                            end: [1, 0],
                                        }
                                        : {
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
