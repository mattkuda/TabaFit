import React, { FC, useState } from 'react';
import {
    Button, Modal,
} from 'native-base';
import { useQueryClient } from 'react-query';
import { TabataWorkout } from '../../types/workouts';
import { useInfiniteQueryMySavedWorkouts } from '../../hooks/useQueryMySavedWorkouts';
import { useMutateDeleteWorkout } from '../../mutations/useMutateSaveWorkout';
import { WorkoutCard } from '../common/WorkoutCard';
import { InfiniteScrollList } from '../common/InfiniteScrollList';
import { GradientVStack } from '../common/GradientVStack';

export const LoadWorkoutScreen: FC = () => {
    const [showModal,
        setShowModal] = useState(false);
    const [selectedWorkout, setSelectedWorkout] = useState<TabataWorkout | null>(null);
    const deleteWorkoutMutation = useMutateDeleteWorkout();
    const {
        data: workouts,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
    } = useInfiniteQueryMySavedWorkouts();

    const queryClient = useQueryClient();
    const refetchData = async (): Promise<void> => {
        refetch();
    };

    const handleDelete = (workout: TabataWorkout): void => {
        deleteWorkoutMutation.mutate({ workoutId: workout._id.toString() }, {
            onSuccess: () => {
                refetch();
                queryClient.invalidateQueries('my-saved-workouts');
            },
        });
        setShowModal(false);
    };

    const handleDeletePress = (workout: TabataWorkout): void => {
        setSelectedWorkout(workout);
        setShowModal(true);
    };

    const closeModal = (): void => {
        setShowModal(false);
        setSelectedWorkout(null);
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
                        onDelete={handleDeletePress}
                    />
                )}
                onRefresh={refetchData}
            />
            <Modal isOpen={showModal} onClose={closeModal}>
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header>Delete Workout</Modal.Header>
                    <Modal.Body>
                        Are you sure you want to delete this workout?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button.Group space={2}>
                            <Button colorScheme="blueGray" variant="ghost" onPress={closeModal}>
                                Cancel
                            </Button>
                            <Button colorScheme="danger" onPress={(): void => handleDelete(selectedWorkout)}>
                                Delete
                            </Button>
                        </Button.Group>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </GradientVStack>
    );
};
