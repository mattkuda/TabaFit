import React, { FC } from 'react';
import {
    VStack, Heading,
} from 'native-base';
import { RefreshableScrollView } from '../RefreshableScrollView';
import { useQueryWorkouts } from '../../hooks/useQueryWorkouts';
import { WorkoutCard } from '../common/WorkoutCard';

// NOTE: Keep this similar to LoadWorkoutScreen
// TODO: Make workout card a common component
export const DiscoverWorkoutsScreen: FC = () => {
    const { data, refetch } = useQueryWorkouts();

    const refetchData = async (): Promise<void> => {
        refetch();
    };

    return (
        <RefreshableScrollView onRefresh={refetchData}>
            <VStack>
                <Heading>Discover Workouts:</Heading>
                {data?.map((workout) => (
                    <WorkoutCard
                        isInMyWorkouts={false}
                        key={workout._id.toString()}
                        workout={workout}
                    />
                ))}
            </VStack>
        </RefreshableScrollView>
    );
};
