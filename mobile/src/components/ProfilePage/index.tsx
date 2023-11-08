import React, { useCallback } from 'react';
import { VStack, Text, Button } from 'native-base';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { ProfileScreenRouteProp } from '../../navigation/navigationTypes';
import { useUserInfo } from '../../hooks/useUserInfo';
import { EditProfileScreenNavigationProp } from '../../types/navigationTypes';
import { useAuth } from '../../context/AuthContext';
import { FollowButton } from './FollowButton';

export const ProfilePage = (): JSX.Element => {
    const { onLogout } = useAuth();
    const navigation = useNavigation<EditProfileScreenNavigationProp>();
    const route = useRoute<ProfileScreenRouteProp>();
    const { authState: { userId: authUserId } } = useAuth();
    const userId = route.params?.userId || authUserId;
    const userInfo = useUserInfo(userId);
    const isCurrentUserProfile = userId === authUserId;

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
            navigation.navigate('EditProfile', { user: userInfo.data });
        }
    };

    const handleLogout = async (): Promise<void> => {
        try {
            await onLogout();
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <VStack alignItems="center" space={4}>
            <Text>Profile Page!</Text>
            {userInfo.data && (
                <>
                    <Text>{`Username: ${userInfo.data.username}`}</Text>
                    <Text>{`Name: ${userInfo.data.firstName}${userInfo.data.lastName ? ` ${userInfo.data.lastName}` : ''}`}</Text>
                </>
            )}
            {isCurrentUserProfile ? (
                <>
                    <Button onPress={navigateToEditProfile}>Edit Profile</Button>
                    <Button onPress={handleLogout}>Logout</Button>
                </>
            ) : (
                <>
                    <FollowButton profileUserId={userId} />
                    <Text>other</Text>
                </>

            )}
            <Text>userState</Text>
            <Text>{authUserId}</Text>
            <Button onPress={handleLogout}>Emergency Logout</Button>
        </VStack>
    );
};
