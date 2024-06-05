import React from 'react';
import {
    VStack, Text, Box, Icon,
} from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { WelcomeScreenNavigationProp } from '../../navigation/navigationTypes';
import { GradientVStack } from '../common/GradientVStack';

export const WelcomeScreen = (): JSX.Element => {
    const navigation = useNavigation<WelcomeScreenNavigationProp>();
    const handleContinue = async (): Promise<void> => {
        // Navigate to the Home screen
        navigation.navigate('TutorialScreen');
    };

    return (
        <GradientVStack
            flex={1}
            space={0}
            width="100%"
        >
            <VStack
                flex={1}
                justifyContent="center"
                px={4}
                space={4}
            >
                <Text fontSize="2xl" fontWeight="bold" mt="10" textAlign="center">
                    Welcome to
                    {' '}
                    <Text color="flame.500">TabaFit</Text>
                    , your tabata social network!
                </Text>
                <Text fontSize="lg" mt="5" textAlign="center">
                    Thank you for being a part of the alpha testing cohort.
                    We're excited to have you here.
                </Text>

                <Text fontSize="lg" mt="5" textAlign="center">
                    Let's familiarize you with your new HIIT home!
                </Text>
            </VStack>
            <TouchableOpacity onPress={handleContinue}>
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
                    mx="4"
                    my="16"
                    p="4"
                    px={4}
                >
                    <Text bold fontSize="lg">
                        Continue
                    </Text>
                    <Icon as={Ionicons} name="chevron-forward" size="lg" />
                </Box>
            </TouchableOpacity>
        </GradientVStack>
    );
};
