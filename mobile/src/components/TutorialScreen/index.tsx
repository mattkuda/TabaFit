import React from 'react';
import {
    VStack, Text, Box, Icon, HStack,
} from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { WelcomeScreenNavigationProp } from '../../navigation/navigationTypes';
import { GradientVStack } from '../common/GradientVStack';

export const TutorialScreen = (): JSX.Element => {
    const navigation = useNavigation<WelcomeScreenNavigationProp>();
    const handleContinue = async (): Promise<void> => {
        // Navigate to the next screen in the welcome wizard flow
        navigation.navigate('SuggestedFollowsScreen');
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
                    Get to Know Your Tabs
                </Text>
                <Text fontSize="lg" mt="5" textAlign="center">
                    Here's a quick overview of the main sections in TabaFit:
                </Text>
                <VStack mt="5" space={4}>
                    <HStack alignItems="center" space={2}>
                        <Icon as={Ionicons} name="home-outline" size="lg" />
                        <Text fontSize="lg" fontWeight="bold">
                            Home
                        </Text>
                    </HStack>
                    <Text>
                        Explore posts from your following or the global community.
                        Use this tab to search for users and check notifications.
                    </Text>
                    <HStack alignItems="center" space={2}>
                        <Icon as={Ionicons} name="timer-outline" size="lg" />
                        <Text fontSize="lg" fontWeight="bold">
                            Workouts
                        </Text>
                    </HStack>
                    <Text>
                        Shuffle workouts quickly, build your own routines,
                        and browse pre-made workouts tailored to your needs.
                    </Text>

                    <HStack alignItems="center" space={2}>
                        <Icon as={Ionicons} name="person-outline" size="lg" />
                        <Text fontSize="lg" fontWeight="bold">
                            Profile
                        </Text>
                    </HStack>
                    <Text>
                        View and edit your profile, see your posts,
                        and manage your personal information.
                    </Text>
                </VStack>
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
