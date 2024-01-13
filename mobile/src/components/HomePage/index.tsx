import React from 'react';
import { Box } from 'native-base';
import { useQueryPostsFollowing, FetchPostsResponse } from '../../hooks/useQueryPostsFollowing';
import { PostCard } from '../common/PostCard';
import { InfiniteScrollList } from '../common/InfiniteScrollList';

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
