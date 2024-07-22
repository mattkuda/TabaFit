import React, { useCallback, useEffect, useState } from 'react';
import {
    VStack, Text, Button, HStack, Icon, IconButton, Spinner,
    Flex,
    Box,
} from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { useInfiniteQueryUserPosts } from '../../hooks/useQueryUserPosts';
import { ProfileScreenRouteProp } from '../../navigation/navigationTypes';
import { useUserInfo } from '../../hooks/useUserInfo';
import { EditProfileScreenNavigationProp } from '../../types/navigationTypes';
import { useAuth } from '../../context/AuthContext';
import { FollowButton } from './FollowButton';
import { PostCard } from '../common/PostCard';
import { formatName } from '../../util/util';
import { ProfilePicture } from '../ProfilePicture';
import { GradientVStack } from '../common/GradientVStack';
import { EmptyState } from '../EmptyState';

export const ProfilePage = (): JSX.Element => {
    const { onLogout } = useAuth();
    const navigation = useNavigation<EditProfileScreenNavigationProp>();
    const route = useRoute<ProfileScreenRouteProp>();
    const { authState: { userId: authUserId } } = useAuth();
    const userId = route.params?.userId || authUserId;
    const {
        data: userInfo, isSuccess: isUserInfoSuccess,
        refetch: refetchUserInfo,
    } = useUserInfo(userId);
    const isCurrentUserProfile = userId === authUserId;

    const {
        data,
        hasNextPage,
        fetchNextPage,
        refetch,
        isLoading,
    } = useInfiniteQueryUserPosts(userId);
    const [refreshing, setRefreshing] = useState(false);

    const flatMap = data?.pages.flatMap((page) => page);

    const handleRefresh = async (): Promise<void> => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    // useFocusEffect(
    //     useCallback(() => {
    //         userInfo.refetch();

    //         return () => {
    //             // Do any cleanup if needed when the screen goes out of focus
    //         };
    //     }, [userInfo]),
    // );

    // Refetch user info only on component mount
    useEffect(() => {
        refetchUserInfo();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const navigateToEditProfile = useCallback((): void => {
        if (isUserInfoSuccess && userInfo) {
            navigation.navigate('EditProfile', { user: userInfo });
        }
    }, [isUserInfoSuccess, navigation, userInfo]);

    const handlePressFollowers = useCallback((): void => {
        navigation.navigate('ConnectionsScreen', { userId });
    }, [navigation, userId]);

    const handleLogout = useCallback(async (): Promise<void> => {
        await onLogout();
    }, [onLogout]);

    useEffect(() => {
        if (isCurrentUserProfile) {
            navigation.setOptions({
                // eslint-disable-next-line react/no-unstable-nested-components
                headerRight: (): JSX.Element => (
                    <IconButton
                        _icon={{
                            color: 'white',
                            size: 'lg',
                        }}
                        borderRadius="full"
                        icon={<Icon as={Ionicons} name="settings" />}
                        onPress={(): void => navigation.navigate('SettingsScreen', { user: userInfo })}
                    />
                ),
                headerTitle: 'You',
            });
        } else {
            navigation.setOptions({
                headerTitle: 'Profile',
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigation, isCurrentUserProfile]);

    const renderProfileHeader = React.useMemo(() => (
        <VStack>
            {userInfo && (
                <HStack alignItems="center" p={4} pb={0} px={4} space={4} width="100%">
                    <ProfilePicture
                        borderColor="primary"
                        borderWidth={2}
                        size="xl"
                        user={userInfo}
                    />
                    <VStack flex={1}>
                        <Text>
                            <Text bold fontSize="lg">{formatName(userInfo.firstName, userInfo.lastName)}</Text>
                            {'  '}
                            <Text color="gray.400" fontSize="lg">
                                {`@${userInfo.username}`}
                            </Text>
                        </Text>
                        <Box flex={1}>
                            <Text flex={1} fontSize="sm">
                                {userInfo.bio}
                            </Text>
                        </Box>
                        <Text italic fontSize="sm">
                            Joined
                            {' '}
                            {format(new Date(userInfo.createdAt), 'PPP')}
                        </Text>
                    </VStack>
                </HStack>
            )}
            <HStack alignItems="center" justifyContent="space-between" p={2} px={4} space={4} width="100%">
                <TouchableOpacity onPress={handlePressFollowers}>
                    <Flex
                        align="center"
                        direction="row"
                        // @ts-expect-error
                        gap={4}
                        justify="space-between"
                    >
                        <VStack alignItems="center">
                            <Text fontSize="md">Following</Text>
                            <Text bold fontSize="md">{isUserInfoSuccess ? userInfo.followingCount : '--'}</Text>
                        </VStack>
                        <VStack alignItems="center">
                            <Text fontSize="md">Followers</Text>
                            <Text bold fontSize="md">{isUserInfoSuccess ? userInfo.followersCount : '--'}</Text>
                        </VStack>
                    </Flex>
                </TouchableOpacity>
                <HStack space={4}>
                    {isCurrentUserProfile ? (
                        <Button
                            colorScheme="secondary"
                            leftIcon={<Icon as={<Ionicons name="pencil" />} color="white" size="sm" />}
                            size="sm"
                            variant="outline"
                            onPress={navigateToEditProfile}
                        >
                            Edit
                        </Button>
                    ) : (
                        <FollowButton profileUserId={userId} />
                    )}
                    {process.env.EXPO_PUBLIC_ENVIRONMENT !== 'production' && (
                        <Button
                            color="primary"
                            size="sm"
                            variant="outline"
                            onPress={handleLogout}
                        >
                            E-Logout
                        </Button>
                    )}
                </HStack>
            </HStack>
        </VStack>
    ), [userInfo, handlePressFollowers, isUserInfoSuccess, isCurrentUserProfile,
        navigateToEditProfile, userId, handleLogout]);

    return (
        <GradientVStack flex={1} space={4} width="100%">
            {isLoading ? (
                <VStack flex={1} space={0} width="100%">
                    {renderProfileHeader}
                    <VStack flex={1} space={4} width="100%">
                        <Spinner color="white" mt={8} size="lg" />
                    </VStack>
                </VStack>
            ) : (
                <VStack flex={1} space={4} width="100%">
                    <FlatList
                        data={flatMap}
                        keyExtractor={(_, index): string => `post-${index}`}
                        ListEmptyComponent={<EmptyState />}
                        ListHeaderComponent={renderProfileHeader}
                        refreshControl={(
                            <RefreshControl
                                colors={['#FFFFFF', '#FFFFFF']}
                                refreshing={refreshing}
                                tintColor="#FFFFFF"
                                onRefresh={handleRefresh}
                            />
                  )}
                        renderItem={({ item }): JSX.Element => <PostCard post={item} />}
                        onEndReached={(): void => {
                            if (hasNextPage) {
                                fetchNextPage();
                            }
                        }}
                        onEndReachedThreshold={0.1}
                    />
                </VStack>
            )}

        </GradientVStack>
    );
};
