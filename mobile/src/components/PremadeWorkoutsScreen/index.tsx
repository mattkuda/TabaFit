import React, { FC } from 'react';
import {
    VStack,
} from 'native-base';
import { WorkoutCard } from '../common/WorkoutCard';
import { InfiniteScrollList } from '../common/InfiniteScrollList';
import { tabaFitWorkouts } from '../../util/tabaFitWorkouts';

export const PremadeWorkoutsScreen: FC = () => {
    const flatMapWorkouts = tabaFitWorkouts;

    return (
        <VStack backgroundColor="gray9" flex={1} p={2} space={2}>
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
        </VStack>
    );
};
