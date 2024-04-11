import React, { FC, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
    VStack, Heading, Button, Modal, Icon,
} from 'native-base';
import { StackNavigationProp } from '@react-navigation/stack';
import { useQueryClient } from 'react-query';
import { Ionicons } from '@expo/vector-icons';
import { TabataWorkout } from '../../types/workouts';
import { TabNavigatorParamList } from '../../types/navigationTypes';
import { useInfiniteQueryMySavedWorkouts } from '../../hooks/useQueryMySavedWorkouts';
import { useMutateDeleteWorkout } from '../../mutations/useMutateSaveWorkout';
import { WorkoutCard } from '../common/WorkoutCard';
import { InfiniteScrollList } from '../common/InfiniteScrollList';
import { BuildWorkoutScreenProps } from '../../navigation/navigationTypes';

type LoadWorkoutScreenNavigationProp = StackNavigationProp<TabNavigatorParamList, 'LoadWorkoutScreen'>;

export const LoadWorkoutScreen: FC = () => {
    const navigation = useNavigation<LoadWorkoutScreenNavigationProp>();
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
        console.log(`Deleting workout with ID: ${workout._id}`);
        deleteWorkoutMutation.mutate({ workoutId: workout._id.toString() }, {
            onSuccess: () => {
                console.log('Workout deleted successfully');
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

    // ... other parts of the component ...

    return (
        <VStack backgroundColor="gray9" flex={1} p={2} space={2}>
            <Heading>My Saved Workouts:</Heading>
            <Button
                alignSelf="flex-end"
                endIcon={(
                    <Icon as={Ionicons} name="add" />
                )}
                onPress={(): void => navigation.navigate('BuildWorkoutScreen', {
                    isSavedWorkout: true,
                } as BuildWorkoutScreenProps)}
            >
                Create New Workout
            </Button>
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
        </VStack>
    );
};
