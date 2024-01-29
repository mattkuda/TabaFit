import React, { useCallback } from 'react';
import {
    VStack, Text, Button, Avatar, HStack,
} from 'native-base';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import { useInfiniteQueryUserPosts } from '../../hooks/useQueryUserPosts';
import { ProfileScreenRouteProp } from '../../navigation/navigationTypes';
import { useUserInfo } from '../../hooks/useUserInfo';
import { EditProfileScreenNavigationProp } from '../../types/navigationTypes';
import { useAuth } from '../../context/AuthContext';
import { FollowButton } from './FollowButton';
import { PostCard } from '../common/PostCard';
import { InfiniteScrollList } from '../common/InfiniteScrollList';

export const ProfilePage = (): JSX.Element => {
    const { onLogout } = useAuth();
    const navigation = useNavigation<EditProfileScreenNavigationProp>();
    const route = useRoute<ProfileScreenRouteProp>();
    const { authState: { userId: authUserId } } = useAuth();
    const userId = route.params?.userId || authUserId;
    const userInfo = useUserInfo(userId);
    const isCurrentUserProfile = userId === authUserId;

    const {
        data,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
        refetch,
    } = useInfiniteQueryUserPosts(userId);

    const flatMap = data?.pages.flatMap((page) => page);

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

    const handlePressFollowers = (): void => {
        navigation.navigate('ConnectionsScreen', { userId });
    };

    const handleLogout = async (): Promise<void> => {
        try {
            await onLogout();
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const onRefresh = async (): Promise<void> => {
        await refetch();
    };

    return (
        <VStack flex={1} space={4} width="100%">
            {userInfo.data && (
                <HStack alignItems="center" px={4} space={4} width="100%">
                    <Avatar
                        borderColor="blue.500"
                        borderWidth={2}
                        size="xl"
                        source={{ uri: userInfo.data.profilePictureUrl }}
                    />
                    <VStack>
                        <Text bold fontSize="lg">{`${userInfo.data.firstName} ${userInfo.data.lastName} @${userInfo.data.username}`}</Text>
                        <Text fontSize="sm">
                            Member since
                            {' '}
                            {format(new Date(userInfo.data.createdAt), 'PPP')}
                        </Text>
                        <Text fontSize="sm" onPress={handlePressFollowers}>
                            {`${userInfo.data.followersCount} Followers • ${userInfo.data.followingCount} Following`}
                        </Text>
                    </VStack>
                </HStack>
            )}
            <HStack alignItems="center" px={4} space={4} width="100%">
                {isCurrentUserProfile ? (
                    <Button onPress={navigateToEditProfile}>Edit Profile</Button>
                ) : (
                    <>
                        <FollowButton profileUserId={userId} />
                        <Text>other</Text>
                    </>
                )}
                <Button onPress={handleLogout}>E-Logout</Button>
            </HStack>
            <InfiniteScrollList
                data={flatMap}
                estimatedItemSize={285}
                fetchData={fetchNextPage}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                keyExtractor={(_, index): string => `post-${index}`}
                renderItem={(item): JSX.Element => <PostCard post={item} />}
                onRefresh={onRefresh}
            />
        </VStack>
    );
};
