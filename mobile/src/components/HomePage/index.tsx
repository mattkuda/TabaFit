import React from 'react';
import { Box, Text } from 'native-base';
import { FlashList } from '@shopify/flash-list';
import { useQueryPostsFollowing, FetchPostsResponse } from '../../hooks/useQueryPostsFollowing';
import { PostCard } from '../common/PostCard';
import { RefreshableScrollView } from '../RefreshableScrollView';

export const HomePage = (): JSX.Element => {
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
            <RefreshableScrollView onRefresh={onRefresh}>
                <FlashList
                    data={flatMap}
                    estimatedItemSize={100}
                    keyExtractor={(_, index): string => `post-${index}`}
                    refreshing={isFetchingNextPage}
                    renderItem={({ item }): JSX.Element => <PostCard post={item} />}
                    onEndReached={hasNextPage ? fetchNextPage : undefined}
                    onEndReachedThreshold={0.2}
                />
                {isFetchingNextPage && <Text>Loading more...</Text>}
            </RefreshableScrollView>
        </Box>
    );
};
