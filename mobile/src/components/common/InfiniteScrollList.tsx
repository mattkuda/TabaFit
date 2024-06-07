import React from 'react';
import { Box, Spinner } from 'native-base';
import { FlashList } from '@shopify/flash-list';
import { RefreshControl } from 'react-native';

type InfiniteScrollListProps<T> = {
    data: T[] | undefined;
    fetchData?: () => void;
    hasNextPage?: boolean;
    isFetchingNextPage?: boolean;
    keyExtractor?: (item: T, index: number) => string;
    renderItem?: (item: T) => JSX.Element;
    onRefresh?: () => Promise<void>;
    estimatedItemSize: number;
};
// TODO: Update to the functionality of that in ProfilePage
export const InfiniteScrollList = <T, >({
    data,
    fetchData,
    hasNextPage,
    isFetchingNextPage,
    keyExtractor,
    renderItem,
    onRefresh,
    estimatedItemSize,
}: InfiniteScrollListProps<T>): JSX.Element => (
    <Box flex={1} justifyContent="center">
        <FlashList
            data={data}
            estimatedItemSize={estimatedItemSize}
            keyExtractor={keyExtractor}
            refreshControl={(
                <RefreshControl
                    colors={['white']}
                    refreshing={!!isFetchingNextPage}
                    tintColor="white"
                    onRefresh={onRefresh}
                />
              )}
            refreshing={isFetchingNextPage}
            renderItem={({ item }): JSX.Element => renderItem(item)}
            showsHorizontalScrollIndicator={false} // Hide horizontal scroll indicator
            showsVerticalScrollIndicator={false} // Hide vertical scroll indicator
            onEndReached={hasNextPage ? fetchData : undefined}
            onEndReachedThreshold={0.2}
            onRefresh={onRefresh}
        />
        {isFetchingNextPage && (
            <Box alignContent="center" justifyContent="center" p="4">
                <Spinner accessibilityLabel="Loading more items" color="white" />
            </Box>
        )}
    </Box>
    );
