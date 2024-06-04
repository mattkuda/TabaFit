import React from 'react';
import {
    Box, Spinner, VStack, useTheme,
} from 'native-base';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useInfiniteQueryPostsFollowing, FetchPostsResponse } from '../../hooks/useQueryPostsFollowing';
import { PostCard } from '../common/PostCard';
import { InfiniteScrollList } from '../common/InfiniteScrollList';
import { useInfiniteQueryPosts } from '../../hooks/useQueryPosts';

const Tab = createMaterialTopTabNavigator();

const FollowingTab = (): JSX.Element => {
    const {
        data: postData,
        isLoading,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
        refetch,
    } = useInfiniteQueryPostsFollowing();
    const flatMap = postData?.pages.flatMap((page: FetchPostsResponse) => page);

    const onRefresh = async (): Promise<void> => {
        await refetch();
    };

    return (
        isLoading ? (
            <VStack backgroundColor="gray9" flex={1} space={0} width="100%">
                <Spinner color="white" mt={8} size="lg" />
            </VStack>
        ) : (
            <Box backgroundColor="black" flex={1} justifyContent="center">
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
        )
    );
};

const GlobalTab = (): JSX.Element => {
    const {
        data: postData,
        isLoading,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
        refetch,
    } = useInfiniteQueryPosts();

    const onRefresh = async (): Promise<void> => {
        await refetch();
    };

    const flatMap2 = postData?.pages.flatMap((page: FetchPostsResponse) => page);

    return (
        isLoading ? (
            <VStack backgroundColor="gray9" flex={1} space={0} width="100%">
                <Spinner color="white" mt={8} size="lg" />
            </VStack>
        ) : (
            <Box backgroundColor="black" flex={1} justifyContent="center">
                <InfiniteScrollList
                    data={flatMap2}
                    estimatedItemSize={285}
                    fetchData={fetchNextPage}
                    hasNextPage={hasNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                    keyExtractor={(_, index): string => `post-${index}`}
                    renderItem={(item): JSX.Element => <PostCard post={item} />}
                    onRefresh={onRefresh}
                />
            </Box>
        )
    );
};

export const HomePage = (): JSX.Element => {
    const { colors } = useTheme();

    return (
        <Box flex={1} justifyContent="center">
            <Tab.Navigator
                initialRouteName="Following"
                screenOptions={{
                    tabBarStyle: { backgroundColor: colors.gray[900] },
                    tabBarActiveTintColor: '#ff9f27',
                    tabBarInactiveTintColor: '#ff9f27',
                    tabBarPressColor: '#ff9f27',
                    tabBarIndicatorStyle: { backgroundColor: '#ff9f27' },
                }}
            >
                <Tab.Screen component={FollowingTab} name="Following" />
                <Tab.Screen component={GlobalTab} name="Global" />
            </Tab.Navigator>
        </Box>
    );
};
