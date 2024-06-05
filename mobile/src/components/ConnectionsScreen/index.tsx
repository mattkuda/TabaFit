import React from 'react';
import { Box, useTheme } from 'native-base';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ConnectionCard } from './ConnectionCard';
import { useInfiniteQueryFollowers, useInfiniteQueryFollowing } from '../../hooks/useQueryFollowing';
import { useAuth } from '../../context/AuthContext';
import { InfiniteScrollList } from '../common/InfiniteScrollList';
import { User } from '../../types/users';
import { GradientVStack } from '../common/GradientVStack';

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
        <GradientVStack
            flex={1}
            space={0}
            width="100%"
        >
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
        </GradientVStack>
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
        <GradientVStack
            flex={1}
            space={0}
            width="100%"
        >
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
        </GradientVStack>
    );
};

export const ConnectionsScreen = (): JSX.Element => {
    const { colors } = useTheme();

    return (
        <Box flex={1} justifyContent="center">
            <Tab.Navigator
                screenOptions={{
                    tabBarStyle: { backgroundColor: colors.gray[800] },
                    tabBarActiveTintColor: '#ff9f27',
                    tabBarInactiveTintColor: '#b6b4b3',
                    tabBarPressColor: '#ff9f27',
                    tabBarIndicatorStyle: { backgroundColor: '#ff9f27' },
                }}
            >
                <Tab.Screen component={FollowingTab} name="Following" />
                <Tab.Screen component={FollowersTab} name="Followers" />
            </Tab.Navigator>
        </Box>
    );
};
