import React from 'react';
import { Box, Text, Button } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { HomeScreenNavigationProp } from '../../types/navigationTypes';

export const WelcomeScreen = (): JSX.Element => {
    const navigation = useNavigation<HomeScreenNavigationProp>();

    const handleContinue = (): void => {
        // Navigate to the Home screen
        navigation.navigate('HomePage'); // Ensure 'Home' matches the name of your home screen in the navigator
    };

    return (
        <Box flex={1} justifyContent="center">
            <Text> This is the Welcome Screen </Text>
            <Button mt="5" onPress={handleContinue}>
                Continue
            </Button>
        </Box>
    );
};
