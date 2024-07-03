import React, { FC } from 'react';
import { useInfiniteQueryMySavedWorkouts } from '../../hooks/useQueryMySavedWorkouts';
import { WorkoutCard } from '../common/WorkoutCard';
import { InfiniteScrollList } from '../common/InfiniteScrollList';
import { GradientVStack } from '../common/GradientVStack';

export const SavedWorkoutsScreen: FC = () => {
    const {
        data: workouts,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
    } = useInfiniteQueryMySavedWorkouts();

    const refetchData = async (): Promise<void> => {
        refetch();
    };

    return (
        <GradientVStack flex={1} p={4} space={2}>
            <InfiniteScrollList
                data={workouts?.pages.flatMap((page) => page)}
                estimatedItemSize={100} // Adjust estimatedItemSize as needed
                fetchData={fetchNextPage}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                keyExtractor={(_, index): string => `post-${index}`}
                renderItem={(workout): JSX.Element => (
                    <WorkoutCard
                        isInMyWorkouts
                        workout={workout}
                    />
                )}
                onRefresh={refetchData}
            />
        </GradientVStack>
    );
};
