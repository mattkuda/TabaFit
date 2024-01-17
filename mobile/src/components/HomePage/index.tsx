import React from 'react';
import { Box } from 'native-base';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useQueryPostsFollowing, FetchPostsResponse } from '../../hooks/useQueryPostsFollowing';
import { PostCard } from '../common/PostCard';
import { InfiniteScrollList } from '../common/InfiniteScrollList';
import { useInfiniteQueryPosts } from '../../hooks/useQueryPosts';

const Tab = createMaterialTopTabNavigator();

// FollowingTab Component
const FollowingTab = (): JSX.Element => {
    // Logic for fetching posts from followed users
    // Similar structure to your current HomePage component
    const {
        data: postData,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
        refetch,
    } = useQueryPostsFollowing();

    const onRefresh = async (): Promise<void> => {
        await refetch();
    };

    const flatMap = postData?.pages.flatMap((page: FetchPostsResponse) => page);

    return (
        <Box flex={1} justifyContent="center">
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
        </Box>
    );
};

// GlobalTab Component
const GlobalTab = (): JSX.Element => {
    // Logic for fetching posts from followed users
    // Similar structure to your current HomePage component
    const {
        data: postData,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
        refetch,
    } = useInfiniteQueryPosts();

    const onRefresh = async (): Promise<void> => {
        await refetch();
    };

    const flatMap = postData?.pages.flatMap((page: FetchPostsResponse) => page);

    return (
        <Box flex={1} justifyContent="center">
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
        </Box>
    );
};

export const HomePage = (): JSX.Element => (
    <Box flex={1} justifyContent="center">
        <Tab.Navigator>
            <Tab.Screen component={FollowingTab} name="Following" />
            <Tab.Screen component={GlobalTab} name="Global" />
        </Tab.Navigator>
    </Box>
);
