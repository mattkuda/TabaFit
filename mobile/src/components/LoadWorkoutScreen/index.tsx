import React, { FC, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
    VStack, Heading, Text, Button, Card, Box, HStack, Modal, Icon, IconButton,
} from 'native-base';
import { StackNavigationProp } from '@react-navigation/stack';
import { format } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { TabataWorkout } from '../../types/workouts';
import { TabNavigatorParamList } from '../../types/navigationTypes';
import { useQueryMySavedWorkouts } from '../../hooks/useQueryMySavedWorkouts';
import { useMutateDeleteWorkout } from '../../mutations/useMutateSaveWorkout';

type LoadWorkoutScreenNavigationProp = StackNavigationProp<TabNavigatorParamList, 'LoadWorkoutScreen'>;

interface WorkoutCardProps {
    workout: TabataWorkout;
    navigation: LoadWorkoutScreenNavigationProp;
    onDelete: (workout: TabataWorkout) => void;
}

const WorkoutCard: FC<WorkoutCardProps> = ({ workout, navigation, onDelete }) => {
    const formattedDate = format(new Date(workout.createdAt), 'MMMM do, yyyy, HH:mm:ss.SSS');

    const handleQuickStart = (): void => {
        navigation.navigate('TabataTimer', { workout });
    };

    const handleCustomize = (): void => {
        console.log('TODO: Go to shuffle with preloaded stuff');
        console.log('and add the typs (upper vs lower) into Tabata Workout Type');
        navigation.navigate('ShuffleScreen', { workout });
    };

    return (
        <Card>
            <VStack alignItems="center" space={3}>
                <Box>
                    <Heading>{workout.name}</Heading>
                    <Text>{`Number of tabatas: ${workout.tabatas.length}`}</Text>
                    <Text>{`Created on ${formattedDate}`}</Text>
                    <IconButton
                        colorScheme="danger"
                        icon={<Icon as={Ionicons} name="trash-bin" />}
                        size="sm"
                        onPress={(): void => onDelete(workout)}
                    />
                </Box>

                <HStack space={3}>
                    <Button onPress={handleQuickStart}>Quick Start</Button>
                    <Button onPress={handleCustomize}>Customize</Button>
                </HStack>
            </VStack>
        </Card>
    );
};

export const LoadWorkoutScreen: FC = () => {
    const navigation = useNavigation<LoadWorkoutScreenNavigationProp>();
    const { data, refetch } = useQueryMySavedWorkouts();
    const [showModal, setShowModal] = useState(false);
    const [selectedWorkout, setSelectedWorkout] = useState<TabataWorkout | null>(null);
    const deleteWorkoutMutation = useMutateDeleteWorkout();

    const handleDelete = (workout: TabataWorkout): void => {
        // Your delete logic here
        // For example, you could call a mutation to delete the workout from the database
        console.log(`Deleting workout with ID: ${workout._id}`);
        deleteWorkoutMutation.mutate({ workoutId: workout._id.toString() }, {
            onSuccess: () => {
                console.log('Workout deleted successfully');
                refetch();
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
        <VStack>
            <Heading>My Saved Workouts:</Heading>
            {data?.map((workout) => (
                <WorkoutCard
                    key={workout._id.toString()}
                    navigation={navigation}
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
    );
};
