import React from 'react';
import {
    VStack, Text, Box, Icon,
} from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { WelcomeScreenNavigationProp } from '../../navigation/navigationTypes';
import { GradientVStack } from '../common/GradientVStack';

export const TabataExplanationScreen = (): JSX.Element => {
    const navigation = useNavigation<WelcomeScreenNavigationProp>();
    const handleContinue = async (): Promise<void> => {
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
                    What is Tabata?
                </Text>
                <Text fontSize="lg" mt="5" textAlign="center">
                    Tabata is a form of high-intensity interval training (HIIT)
                    that consists of eight rounds of ultra-high-intensity exercises in a specific 20-seconds-on,
                    10-seconds-off interval.
                </Text>
                <Text fontSize="lg" mt="5" textAlign="center">
                    It's a fast and efficient workout method designed to improve both aerobic and anaerobic systems.
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
