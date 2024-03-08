import React from 'react';
import { Box, Text, Button } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { WelcomeScreenNavigationProp } from '../../navigation/navigationTypes';

export const WelcomeScreen = (): JSX.Element => {
    const navigation = useNavigation<WelcomeScreenNavigationProp>();
    const handleContinue = async (): Promise<void> => {
        // Navigate to the Home screen
        navigation.navigate('SuggestedFollowsScreen');
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
