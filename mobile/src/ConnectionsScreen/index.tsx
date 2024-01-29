import React from 'react';
import { Box } from 'native-base';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ConnectionCard } from './ConnectionCard';
import { useInfiniteQueryFollowers, useInfiniteQueryFollowing } from '../hooks/useQueryFollowing';
import { useAuth } from '../context/AuthContext';
import { InfiniteScrollList } from '../components/common/InfiniteScrollList';
import { User } from '../types/users';

const Tab = createMaterialTopTabNavigator();

const FollowingTab = (): JSX.Element => {
    const { authState: { userId } } = useAuth();
    const {
        data,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
        refetch,
    } = useInfiniteQueryFollowing(userId);

    const flatMap = data?.pages.flatMap((page: User[]) => page);

    const onRefresh = async (): Promise<void> => {
        await refetch();
    };

    return (
        <Box flex={1} justifyContent="center">
            <InfiniteScrollList
                data={flatMap}
                estimatedItemSize={285}
                fetchData={fetchNextPage}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                keyExtractor={(_, index): string => `following-${index}`}
                renderItem={(item): JSX.Element => <ConnectionCard user={item} />}
                onRefresh={onRefresh}
            />
        </Box>
    );
};

const FollowersTab = (): JSX.Element => {
    const { authState: { userId } } = useAuth();
    const {
        data,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
        refetch,
    } = useInfiniteQueryFollowers(userId);

    const onRefresh = async (): Promise<void> => {
        await refetch();
    };

    const flatMap2 = data?.pages.flatMap((page: User[]) => page);

    return (
        <Box flex={1} justifyContent="center">
            <InfiniteScrollList
                data={flatMap2}
                estimatedItemSize={285}
                fetchData={fetchNextPage}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                keyExtractor={(_, index): string => `follower-${index}`}
                renderItem={(item): JSX.Element => <ConnectionCard user={item} />}
                onRefresh={onRefresh}
            />
        </Box>
    );
};

export const ConnectionsScreen = (): JSX.Element => (
    <Box flex={1} justifyContent="center">
        <Tab.Navigator>
            <Tab.Screen component={FollowingTab} name="Following" />
            <Tab.Screen component={FollowersTab} name="Followers" />
        </Tab.Navigator>
    </Box>
);
