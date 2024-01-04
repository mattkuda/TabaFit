import React, { FC, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
    VStack, Heading, Button, Modal,
} from 'native-base';
import { StackNavigationProp } from '@react-navigation/stack';
import { useQueryClient } from 'react-query';
import { TabataWorkout } from '../../types/workouts';
import { TabNavigatorParamList } from '../../types/navigationTypes';
import { useQueryMySavedWorkouts } from '../../hooks/useQueryMySavedWorkouts';
import { useMutateDeleteWorkout } from '../../mutations/useMutateSaveWorkout';
import { RefreshableScrollView } from '../RefreshableScrollView';
import { WorkoutCard } from '../common/WorkoutCard';

type LoadWorkoutScreenNavigationProp = StackNavigationProp<TabNavigatorParamList, 'LoadWorkoutScreen'>;

export const LoadWorkoutScreen: FC = () => {
    const navigation = useNavigation<LoadWorkoutScreenNavigationProp>();
    const { data, refetch } = useQueryMySavedWorkouts();
    const [showModal, setShowModal] = useState(false);
    const [selectedWorkout, setSelectedWorkout] = useState<TabataWorkout | null>(null);
    const deleteWorkoutMutation = useMutateDeleteWorkout();
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
        }); setShowModal(false);
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
        <RefreshableScrollView onRefresh={refetchData}>
            <VStack>
                <Heading>My Saved Workouts:</Heading>
                <Button
                    onPress={(): void => navigation.navigate('BuildWorkoutScreen')}
                >
                    Create New Workout
                </Button>
                {data?.map((workout) => (
                    <WorkoutCard
                        isInMyWorkouts
                        key={workout._id.toString()}
                        workout={workout}
                        onDelete={handleDeletePress}
                    />
                ))}
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
        </RefreshableScrollView>
    );
};
