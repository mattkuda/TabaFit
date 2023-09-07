import React from 'react';
import { VStack, Text, Button } from 'native-base';
import Config from 'react-native-config';
import { useAuth } from '../../context/AuthContext';

export const ProfilePage = (): JSX.Element => {
    const { onLogout } = useAuth();
    // eslint-disable-next-line prefer-destructuring
    const TOKEN_KEY = Config.TOKEN_KEY; // <-- Use Config to access environment variables

    const handleLogout = async (): Promise<void> => {
        try {
            await onLogout();
            // You can also navigate to the login page or show a message after logging out if needed
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <VStack alignItems="center" space={4}>
            <Text>Todo: Add Profile Page</Text>
            <Text>
                {TOKEN_KEY}
                asdf
            </Text>
            <Button onPress={handleLogout}>Logout</Button>
        </VStack>
    );
};
