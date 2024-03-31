import React, { useCallback, useEffect, useState } from 'react';
import {
    VStack, Text, Button, Avatar, HStack, Icon, IconButton,
} from 'native-base';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
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
        refetch,
    } = useInfiniteQueryUserPosts(userId);
    const [refreshing, setRefreshing] = useState(false);

    const flatMap = data?.pages.flatMap((page) => page);

    const handleRefresh = async (): Promise<void> => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    useFocusEffect(
        useCallback(() => {
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
        await onLogout();
    };

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
                        onPress={(): void => navigation.navigate('SettingsScreen')}

                    />
                ),
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigation, isCurrentUserProfile]);

    const renderProfileHeader = (): JSX.Element => (
        <>
            {userInfo.data && (
                <HStack alignItems="center" backgroundColor="gray9" p={4} px={4} space={4} width="100%">
                    <Avatar
                        borderColor="flame"
                        borderWidth={2}
                        size="xl"
                        source={{ uri: userInfo.data.profilePictureUrl }}
                    />
                    <VStack backgroundColor="gray9">
                        <Text bold fontSize="lg">{formatName(userInfo.data.firstName, userInfo.data.lastName)}</Text>
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
                    <>
                        <FollowButton profileUserId={userId} />
                        <Text>other</Text>
                    </>
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
    );

    return (
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
