import React, { FC } from 'react';
import {
    VStack, Heading,
} from 'native-base';
import { useInfiniteQueryPremadeWorkouts } from '../../hooks/useQueryPremadeWorkouts';
import { WorkoutCard } from '../common/WorkoutCard';
import { InfiniteScrollList } from '../common/InfiniteScrollList';

export const PremadeWorkoutsScreen: FC = () => {
    const {
        data: workoutsData,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
        refetch,
    } = useInfiniteQueryPremadeWorkouts();

    const refetchData = async (): Promise<void> => {
        refetch();
    };

    const flatMapWorkouts = workoutsData?.pages.flatMap((page) => page) || [];

    return (
        <VStack backgroundColor="gray9" flex={1} p={2} space={2}>
            <Heading px="4">TabaFit Official Workouts</Heading>
            <InfiniteScrollList
                data={flatMapWorkouts}
                estimatedItemSize={100}
                fetchData={fetchNextPage}
                hasNextPage={!!hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                keyExtractor={(_, index): string => `workout-${index}`}
                renderItem={(workout): JSX.Element => (
                    <WorkoutCard
                        isInMyWorkouts={false}
                        workout={workout}
                    />
                )}
                onRefresh={refetchData}
            />
        </VStack>
    );
};
