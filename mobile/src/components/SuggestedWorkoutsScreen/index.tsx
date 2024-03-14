import React, { useState } from 'react';
import {
    Box, Button, ScrollView, VStack, Text, Icon, Card, Heading,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons'; // Assuming you're using Expo
import { useSetRecoilState } from 'recoil';
// import { useSaveAll } from '../../mutations/followMutations';
import { TouchableOpacity } from 'react-native';
import { wizardTodoState } from '../../atoms/wizardTodoAtom';
import { useQuerySuggestedWorkouts } from '../../hooks/useQueryWorkouts';
import { useMutateSaveAllSuggestedWorkout, useMutateSaveWorkout } from '../../mutations/useMutateSaveWorkout';
import { useAuth } from '../../context/AuthContext';

const WorkoutCard = ({
    workout,
    isSavedAll,
}): JSX.Element => {
    const [isSaved, setIsSaved] = useState(false); // Local state to track save status
    const saveWorkoutMutation = useMutateSaveWorkout();
    const { authState } = useAuth();
    const userId = authState?.userId;

    const handleSave = (): void => {
        if (authState?.userId && workout) {
            saveWorkoutMutation.mutate({
                workout: {
                    ...workout,
                    userId,
                },
            }, {
                onSuccess: () => {
                    setIsSaved(true);
                },
            });
        }
    };

    return (
        <TouchableOpacity style={{ width: '100%' }}>
            <Card>
                <Box bg="lightBlue.100" p="12" rounded="xl">
                    <VStack alignItems="center" space={3}>
                        <Heading>{workout.name}</Heading>
                        <Text>{`Created by ${workout.user.username}`}</Text>
                        {/* Additional workout details */}
                        <Button
                            colorScheme="primary"
                            isLoading={false} // Modify according to your API call
                            leftIcon={(
                                <Icon
                                    as={MaterialIcons}
                                    color={isSaved || isSavedAll ? 'green.500' : 'white'}
                                    disabled={isSaved || isSavedAll}
                                    name={isSaved || isSavedAll ? 'check' : 'add'}
                                    size="sm"
                                />
                            )}
                            variant="solid"
                            onPress={handleSave}
                        >
                            {isSaved ? 'Saved' : 'Save'}
                        </Button>
                    </VStack>
                </Box>
            </Card>
        </TouchableOpacity>
    );
};

export const SuggestedWorkoutsScreen = (): JSX.Element => {
    const setWizardTodo = useSetRecoilState(wizardTodoState);
    const [isSavedAll, setSavedAll] = useState(false);
    const { data: workouts } = useQuerySuggestedWorkouts();
    const saveAllMutation = useMutateSaveAllSuggestedWorkout(); // Using the save all mutation
    const handleSaveAll = (): void => {
        saveAllMutation.mutate({}, {
            onSuccess: () => {
                setSavedAll(true); // This marks all workouts as saved once the operation succeeds
            },
        });
    };

    return (
        <ScrollView bg="white">
            <VStack mt="5" px="4" space={4}>
                {/* Other components... */}
                {workouts?.map((workout) => (
                    <WorkoutCard
                        isSavedAll={isSavedAll} // Correctly pass isSavedAll to each WorkoutCard
                        key={workout._id.toString()}
                        workout={workout}
                    />
                ))}
                <Button
                    isDisabled={isSavedAll} // Disable the button once all are saved
                    onPress={handleSaveAll}
                >
                    Save all suggested
                </Button>
                <Button onPress={(): void => setWizardTodo(false)}>Done</Button>
            </VStack>
        </ScrollView>
    );
};
