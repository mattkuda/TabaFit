import React from 'react';
import {
    VStack, Text, Button, Box, Icon,
} from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { WelcomeScreenNavigationProp } from '../../navigation/navigationTypes';

export const WelcomeScreen = (): JSX.Element => {
    const navigation = useNavigation<WelcomeScreenNavigationProp>();
    const handleContinue = async (): Promise<void> => {
        // Navigate to the Home screen
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
                space={2}
            >
                <Text fontSize="2xl" fontWeight="bold" mt="10" textAlign="center">
                    Welcome to TabaFit, your tabata social network!
                </Text>
                <Text fontSize="lg" mt="5" textAlign="center">
                    {`Let's get you set up`}
                </Text>
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
