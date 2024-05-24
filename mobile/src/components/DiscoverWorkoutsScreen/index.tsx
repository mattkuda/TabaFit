import React, { FC } from 'react';
import {
    VStack,
} from 'native-base';
import { useInfiniteQueryWorkouts } from '../../hooks/useQueryWorkouts';
import { WorkoutCard } from '../common/WorkoutCard';
import { InfiniteScrollList } from '../common/InfiniteScrollList';

// NOTE: Keep this similar to LoadWorkoutScreen
// TODO: Make workout card a common component
export const DiscoverWorkoutsScreen: FC = () => {
    const {
        data: workoutsData,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
        refetch,
    } = useInfiniteQueryWorkouts();

    const refetchData = async (): Promise<void> => {
        refetch();
    };

    const flatMapWorkouts = workoutsData?.pages.flatMap((page) => page) || [];

    return (
        <VStack backgroundColor="black" flex={1} p={2} space={2}>
            <InfiniteScrollList
                data={flatMapWorkouts}
                estimatedItemSize={100} // Adjust based on the average size of your WorkoutCard
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
