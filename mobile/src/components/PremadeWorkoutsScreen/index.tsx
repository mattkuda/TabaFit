import React, { FC } from 'react';
import { WorkoutCard } from '../common/WorkoutCard';
import { InfiniteScrollList } from '../common/InfiniteScrollList';
import { tabaFitWorkouts } from '../../util/tabaFitWorkouts';
import { GradientVStack } from '../common/GradientVStack';

export const PremadeWorkoutsScreen: FC = () => {
    const flatMapWorkouts = tabaFitWorkouts;

    return (
        <GradientVStack flex={1} p={4} space={2}>
            <InfiniteScrollList
                data={flatMapWorkouts}
                estimatedItemSize={100}
                keyExtractor={(_, index): string => `workout-${index}`}
                renderItem={(workout): JSX.Element => (
                    <WorkoutCard
                        isInMyWorkouts={false}
                        workout={workout}
                    />
                )}
            />
        </GradientVStack>
    );
};
