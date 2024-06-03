import React from 'react';
import {
    VStack, Text, Button, Box, Icon, HStack,
} from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { WelcomeScreenNavigationProp } from '../../navigation/navigationTypes';

export const TutorialScreen = (): JSX.Element => {
    const navigation = useNavigation<WelcomeScreenNavigationProp>();
    const handleContinue = async (): Promise<void> => {
        // Navigate to the next screen in the welcome wizard flow
        navigation.navigate('SuggestedFollowsScreen');
    };

    return (
        <VStack
            backgroundColor="gray9"
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
            <Box flex={1} px={4}>
                <Button
                    borderRadius="full"
                    bottom={8}
                    endIcon={(
                        <Icon as={Ionicons} name="chevron-forward" />
                    )}
                    flex={1}
                    m={4}
                    position="absolute"
                    width="100%"
                    onPress={handleContinue}
                >
                    Continue
                </Button>
            </Box>
        </VStack>
    );
};
