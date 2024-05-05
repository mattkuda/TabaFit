import React from 'react';
import {
    Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
    VStack, Button, Box, Text,
} from 'native-base';
import { AuthStackParamList } from '../../navigation/navigationTypes';
// @ts-ignore
import logo from '../../../assets/TabatableBasicLogo.png';

export const AuthPage = (): JSX.Element => {
    const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();

    return (
        <VStack
            backgroundColor="gray9"
            flex={1}
            height="100%"
            space={2}
            width="100%"
        >
            <VStack flex={1} justifyContent="center" p={4}>
                <Image
                    source={logo}
                    style={{
                        width: 200,
                        height: 40,
                        marginBottom: 20,
                        alignSelf: 'flex-start',
                    }}
                />
                <Text color="flame" fontSize="2xl">
                    Taboot
                </Text>
                <Text fontSize="4xl" fontWeight="bold">
                    Your Tabata  Workout Community
                </Text>
                <Text fontSize="xl">
                    Generate workouts with custom settings. Track your track progress.
                    Share your workouts and interact with friends.
                </Text>
            </VStack>
            <Box bg="gray9" height={110} p="4" width="100%">
                <Button.Group
                    isAttached
                    bottom={8}
                >
                    <Button
                        borderColor="flame"
                        borderLeftRadius="full"
                        borderWidth={2}
                        flex={1}
                        size="lg"
                        variant="outline"
                        onPress={(): void => navigation.navigate('LoginScreen')}
                    >
                        <Text color="white" fontSize="lg" fontWeight="bold">
                            Login
                        </Text>
                    </Button>
                    <Button
                        borderColor="flame"
                        borderRightRadius="full"
                        borderWidth={2}
                        flex={1}
                        size="lg"
                        variant="outline"
                        onPress={(): void => navigation.navigate('SignupScreen')}
                    >
                        <Text color="white" fontSize="lg" fontWeight="bold">
                            Signup
                        </Text>
                    </Button>
                </Button.Group>
            </Box>
        </VStack>
    );
};
