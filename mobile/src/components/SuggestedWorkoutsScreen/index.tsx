import React, { useState } from 'react';
import {
    Box, Button, ScrollView, VStack, Text, Icon, Center, Avatar, HStack,
} from 'native-base';
import { Ionicons, MaterialIcons } from '@expo/vector-icons'; // Assuming you're using Expo
import { useSetRecoilState } from 'recoil';
// import { useSaveAll } from '../../mutations/followMutations';
import { TouchableOpacity } from 'react-native';
import { format } from 'date-fns';
import { wizardActiveState } from '../../atoms/wizardActiveAtom';
import { useQuerySuggestedWorkouts } from '../../hooks/useQueryWorkouts';
import { useMutateSaveAllSuggestedWorkout, useMutateSaveWorkout } from '../../mutations/useMutateSaveWorkout';
import { useAuth } from '../../context/AuthContext';
import { getFormattedTimeForTabataWorkout } from '../TabataTimerScreen/util';

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

    const formattedDate = format(new Date(workout.createdAt), 'MMMM do, yyyy');

    return (
        <TouchableOpacity
            style={{
                width: '100%',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
            }}
        >
            <VStack
                backgroundColor="gray9"
                borderColor="gray7"
                borderRadius="md"
                borderWidth={1}
                mt={4}
                p={4}
                space={4}
                width="100%"
            >
                <VStack space={0}>
                    <HStack justifyContent="space-between">
                        <Text
                            ellipsizeMode="tail"
                            fontSize="md"
                            numberOfLines={2}
                            style={{
                                fontWeight: 'bold',
                                lineHeight: 16,
                                height: 32,
                            }}
                        >
                            {workout.name}
                        </Text>
                    </HStack>
                    <Box alignItems="center" flexDirection="row" justifyContent="space-between">
                        <Box alignItems="center" flexDirection="row">
                            <Avatar size="xs" source={{ uri: workout?.user?.profilePictureUrl }} />
                            <Text style={{ marginLeft: 8 }}>
                                {`${workout?.user?.firstName} ${workout?.user?.lastName}`}
                            </Text>
                        </Box>
                        {formattedDate}
                    </Box>
                </VStack>
                <HStack justifyContent="space-between" mt={2}>
                    <VStack alignItems="center" flex={1} space={0}>
                        <Icon as={Ionicons} name="body-outline" size="md" />
                        <Text fontSize="sm">
                            {`${workout.numberOfTabatas} ${workout.numberOfTabatas === 1 ? 'Tabata' : 'Tabatas'}`}
                        </Text>
                    </VStack>
                    <VStack alignItems="center" flex={1} space={0}>
                        <Icon as={Ionicons} name="time-outline" size="md" />
                        <Text fontSize="sm">{getFormattedTimeForTabataWorkout(workout)}</Text>
                    </VStack>
                </HStack>
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
        </TouchableOpacity>
    );
};

export const SuggestedWorkoutsScreen = (): JSX.Element => {
    const setwizardActive = useSetRecoilState(wizardActiveState);
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
        <VStack
            backgroundColor="gray9"
            flex={1}
            width="100%"
        >
            <ScrollView flex={1}>
                <VStack
                    flex={1}
                    justifyContent="center"
                    mt="5"
                    px="4"
                    space={8}
                >
                    <VStack
                        flex={1}
                        justifyContent="center"
                        space={2}
                    >
                        <Text fontSize="2xl" fontWeight="bold" mt="10" textAlign="center">
                            {`Next, let's save some workouts!`}
                        </Text>
                        <Text fontSize="lg" mt="5" textAlign="center">
                            Save some suggested workouts, or save all of them!
                        </Text>
                    </VStack>
                    <Center>
                        <Button
                            borderRadius="full"
                            colorScheme="primary"
                            isDisabled={isSavedAll} // Disable the button once all are saved
                            leftIcon={<Icon as={MaterialIcons} color={isSavedAll ? 'green.500' : 'white'} name={isSavedAll ? 'check' : 'add'} size="sm" />}
                            variant="solid"
                            width={180}
                            onPress={handleSaveAll}
                        >
                            Save All
                        </Button>
                    </Center>
                    {workouts?.map((workout) => (
                        <WorkoutCard
                            isSavedAll={isSavedAll} // Correctly pass isSavedAll to each WorkoutCard
                            key={workout._id.toString()}
                            workout={workout}
                        />
                    ))}
                </VStack>
            </ScrollView>
            <Box bg="gray9" height={110} p="4" width="100%">
                <Button
                    borderRadius="full"
                    bottom={8}
                    endIcon={(
                        <Icon as={Ionicons} name="chevron-forward" />
                    )}
                    flex={1}
                    m={4}
                    position="absolute"
                    width="100%"
                    onPress={(): void => setwizardActive(false)}
                >
                    Finish!
                </Button>
            </Box>
        </VStack>

    );
};
