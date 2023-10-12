import React, { useCallback } from 'react';
import { VStack, Text, Button } from 'native-base';
import Config from 'react-native-config';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useUserInfo } from '../../hooks/useUserInfo';
import { EditProfileScreenNavigationProp } from '../../types/navigationTypes';
import { useAuth } from '../../context/AuthContext';

export const ProfilePage = (): JSX.Element => {
    const { onLogout } = useAuth();
    // eslint-disable-next-line prefer-destructuring
    const TOKEN_KEY = Config.TOKEN_KEY; // <-- Use Config to access environment variables
    const navigation = useNavigation<EditProfileScreenNavigationProp>();
    // TODO: replace with the user's username based on cookie
    const userInfo = useUserInfo('test');

    useFocusEffect(
        useCallback(() => {
            // Refetch the user data when the screen comes into focus
            userInfo.refetch();

            return () => {
                // Do any cleanup if needed when the screen goes out of focus
            };
        }, [userInfo]),
    );

    const navigateToEditProfile = (): void => {
        if (userInfo.isSuccess && userInfo) {
            // Navigate to EditProfilePage with user data
            navigation.navigate('EditProfile', { user: userInfo.data });
        }
    };

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
            <Text>Profile Page</Text>
            {userInfo.data && (
                <>
                    <Text>{`Username: ${userInfo.data.username}`}</Text>
                    <Text>{`Name: ${userInfo.data.firstName}${userInfo.data.lastName ? ` ${userInfo.data.lastName}` : ''}`}</Text>
                </>
            )}
            <Button onPress={navigateToEditProfile}>Edit Profile</Button>
            <Text>
                {TOKEN_KEY}
            </Text>
            <Button onPress={handleLogout}>Logout</Button>
        </VStack>
    );
};
