import React, { useCallback, useEffect, useState } from 'react';
import {
    VStack, Text, Button, HStack, Icon, IconButton, Spinner,
} from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { FlatList, RefreshControl } from 'react-native';
import { useInfiniteQueryUserPosts } from '../../hooks/useQueryUserPosts';
import { ProfileScreenRouteProp } from '../../navigation/navigationTypes';
import { useUserInfo } from '../../hooks/useUserInfo';
import { EditProfileScreenNavigationProp } from '../../types/navigationTypes';
import { useAuth } from '../../context/AuthContext';
import { FollowButton } from './FollowButton';
import { PostCard } from '../common/PostCard';
import { formatName } from '../../util/util';
import { ProfilePicture } from '../ProfilePicture';

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
                            color: 'flame',
                            size: 'md',
                        }}
                        borderRadius="full"
                        color="flame"
                        icon={<Icon as={Ionicons} name="settings-outline" />}
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
        <>
            {userInfo && (
                <HStack alignItems="center" backgroundColor="gray9" p={4} px={4} space={4} width="100%">
                    <ProfilePicture
                        borderColor="flame"
                        borderWidth={2}
                        size="xl"
                        user={userInfo}
                    />
                    <VStack backgroundColor="gray9">
                        <Text>
                            <Text bold fontSize="lg">{formatName(userInfo.firstName, userInfo.lastName)}</Text>
                            {'  '}
                            <Text color="coolGray.600" fontSize="lg">
                                {`@${userInfo.username}`}
                            </Text>
                        </Text>
                        <Text fontSize="sm">
                            {userInfo.bio}
                        </Text>
                        <Text italic fontSize="sm">
                            Joined
                            {' '}
                            {format(new Date(userInfo.createdAt), 'PPP')}
                        </Text>
                        <Text fontSize="sm" onPress={handlePressFollowers}>
                            {`${userInfo.followersCount} Followers • ${userInfo.followingCount} Following`}
                        </Text>
                    </VStack>
                </HStack>
            )}
            <HStack alignItems="center" px={4} space={4} width="100%">
                {isCurrentUserProfile ? (
                    <Button
                        color="flame"
                        leftIcon={<Icon as={<Ionicons name="pencil" />} color="flame" size="sm" />}
                        size="sm"
                        variant="outline"
                        onPress={navigateToEditProfile}
                    >
                        Edit
                    </Button>
                ) : (
                    <FollowButton profileUserId={userId} />
                )}
                <Button
                    color="flame"
                    size="sm"
                    variant="outline"
                    onPress={handleLogout}
                >
                    E-Logout
                </Button>
            </HStack>
        </>
    ), [userInfo, handlePressFollowers, isCurrentUserProfile,
        navigateToEditProfile, userId, handleLogout]);

    return data && data.pages.length === 0 ? (
        <VStack backgroundColor="gray9" flex={1} space={4} width="100%">
            {renderProfileHeader}
            <Spinner color="white" mt={8} size="lg" />
        </VStack>
    ) : (
        <VStack backgroundColor="gray9" flex={1} space={4} width="100%">
            <FlatList
                data={flatMap}
                keyExtractor={(_, index): string => `post-${index}`}
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
    );
};
