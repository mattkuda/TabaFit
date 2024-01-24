import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
    VStack, Heading, Button, Pressable, Text, Box, HStack, Icon, IconButton, Checkbox,
} from 'native-base';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { TabNavigatorParamList } from '../../types/navigationTypes';
import { useQueryMySavedWorkouts } from '../../hooks/useQueryMySavedWorkouts';
import { defaultShuffleTabataWorkout } from '../ShuffleScreen/util';
import { BuildWorkoutScreenProps } from '../../navigation/navigationTypes';
import { TabataWorkout } from '../../types/workouts';
import { RefreshableScrollView } from '../RefreshableScrollView';
import { HorizontalWorkoutCards } from '../HorizontalWorkoutCards';

type CheckboxItemProps = {
    label: string;
    value: boolean;
    setValue: (value: boolean) => void;
    disabled: boolean;
};

const CheckboxItem: React.FC<CheckboxItemProps> = ({
    label, value, setValue, disabled,
}) => (
    <Checkbox
        isChecked={value}
        isDisabled={disabled}
        value=""
        onChange={(): void => setValue(!value)}
    >
        {label}
    </Checkbox>
);

type WorkoutsScreenNavigationProp = StackNavigationProp<TabNavigatorParamList, 'WorkoutsScreen'>;

export const WorkoutsScreen = (): JSX.Element => {
    const navigation = useNavigation<WorkoutsScreenNavigationProp>();
    const {
        data: mySavedWorkouts, refetch,
        isLoading: isMySavedWorkoutsLoading,
    } = useQueryMySavedWorkouts({ limit: 5, offset: 0 });
    const [shuffledWorkout, setShuffledWorkout] = useState<TabataWorkout>(defaultShuffleTabataWorkout);

    const handlePressQuickShuffle = (): void => {
        // First go to customizable settings screen (to-build)
        navigation.navigate('BuildWorkoutScreen', { customWorkout: shuffledWorkout, isShuffle: true } as BuildWorkoutScreenProps);
    };

    const handlePressBuildWorkout = (): void => {
        navigation.navigate('BuildWorkoutScreen', { isShuffle: false });
    };

    const handlePressViewWorkout = (workout: TabataWorkout): void => {
        navigation.navigate('ViewWorkoutScreen', { workoutId: workout._id.toString() });
    };

    const handlePressViewMyWorkouts = (): void => {
        navigation.navigate('LoadWorkoutScreen');
    };

    const handlePressDiscoverWorkouts = (): void => {
        navigation.navigate('DiscoverWorkoutsScreen');
    };

    const shouldDisableCheckbox = (checkboxValue: boolean): boolean => {
        const checkedCount = [shuffledWorkout.includeSettings.includeUpper,
            shuffledWorkout.includeSettings.includeLower, shuffledWorkout.includeSettings.includeAbs,
            shuffledWorkout.includeSettings.includeCardio]
            .filter((val) => val).length;

        return checkedCount === 1 && checkboxValue;
    };

    const refetchData = async (): Promise<void> => {
        refetch();
    };

    return (
        <RefreshableScrollView onRefresh={refetchData}>
            <VStack mt={4} px={5} space={4}>
                <Box
                    bg="orange.500" // Set the background to orange
                    p="12"
                    rounded="xl"
                >
                    <Heading color="warmGray.50" size="md" textAlign="center">Generate Workout</Heading>
                    <HStack alignItems="center" justifyContent="center" mt={4}>
                        <IconButton
                            icon={<Icon as={Ionicons} color="white" name="remove" />}
                            onPress={(): void => setShuffledWorkout((prev) => ({
                                ...prev,
                                numberOfTabatas: prev.numberOfTabatas - 1,
                            }))}
                        />
                        <Text color="white" mx={2}>{`${shuffledWorkout.numberOfTabatas} Tabatas`}</Text>
                        <IconButton
                            icon={<Icon as={Ionicons} color="white" name="add" />}
                            onPress={(): void => setShuffledWorkout((prev) => ({
                                ...prev,
                                numberOfTabatas: prev.numberOfTabatas + 1,
                            }))}
                        />
                    </HStack>
                    <HStack alignItems="center" justifyContent="space-between" mt={4}>
                        <CheckboxItem
                            disabled={shouldDisableCheckbox(shuffledWorkout.includeSettings.includeUpper)}
                            label="Upper"
                            setValue={(newValue): void => setShuffledWorkout((prev) => ({
                                ...prev,
                                includeSettings: {
                                    ...prev.includeSettings,
                                    includeUpper: newValue,
                                },
                            }))}
                            value={shuffledWorkout.includeSettings.includeUpper}
                        />
                        <CheckboxItem
                            disabled={shouldDisableCheckbox(shuffledWorkout.includeSettings.includeLower)}
                            label="Lower"
                            setValue={(newValue): void => setShuffledWorkout((prev) => ({
                                ...prev,
                                includeSettings: {
                                    ...prev.includeSettings,
                                    includeLower: newValue,
                                },
                            }))}
                            value={shuffledWorkout.includeSettings.includeLower}
                        />
                        <CheckboxItem
                            disabled={shouldDisableCheckbox(shuffledWorkout.includeSettings.includeAbs)}
                            label="Abs"
                            setValue={(newValue): void => setShuffledWorkout((prev) => ({
                                ...prev,
                                includeSettings: {
                                    ...prev.includeSettings,
                                    includeAbs: newValue,
                                },
                            }))}
                            value={shuffledWorkout.includeSettings.includeAbs}
                        />
                        <CheckboxItem
                            disabled={shouldDisableCheckbox(shuffledWorkout.includeSettings.includeCardio)}
                            label="Cardio"
                            setValue={(newValue): void => setShuffledWorkout((prev) => ({
                                ...prev,
                                includeSettings: {
                                    ...prev.includeSettings,
                                    includeCardio: newValue,
                                },
                            }))}
                            value={shuffledWorkout.includeSettings.includeCardio}
                        />
                    </HStack>
                    <Button mt={4} onPress={handlePressQuickShuffle}>Create</Button>
                </Box>

                {/* Build Workout Row */}
                <Pressable onPress={handlePressBuildWorkout}>
                    <Box>
                        <Text>Build a Workout</Text>
                    </Box>
                </Pressable>

                {/* Discover Workouts */}
                <HStack alignItems="center" justifyContent="space-between">
                    <Heading size="md">Discover Workouts</Heading>
                    <Button onPress={handlePressDiscoverWorkouts}>Browse all</Button>
                </HStack>
                <HStack space={2}>
                    <Pressable onPress={(): void => console.log('Navigate to Discoverable workout 1')}>
                        <Box><Text>Discoverable workout 1</Text></Box>
                    </Pressable>
                    <Pressable onPress={(): void => console.log('Navigate to Discoverable workout 2')}>
                        <Box><Text>Discoverable workout 2</Text></Box>
                    </Pressable>
                </HStack>

                {/* My Workouts */}
                <HStack alignItems="center" justifyContent="space-between">
                    <Heading size="md">My Workouts</Heading>
                    <Button onPress={handlePressViewMyWorkouts}>View all</Button>
                </HStack>
                <HorizontalWorkoutCards
                    isLoading={isMySavedWorkoutsLoading}
                    workouts={mySavedWorkouts}
                    onPressWorkout={handlePressViewWorkout}
                />
                {/* Abcountable Workouts */}
                <HStack alignItems="center" justifyContent="space-between">
                    <Heading size="md">Abcountable Workouts</Heading>
                    <Button onPress={handlePressDiscoverWorkouts}>Browse all</Button>
                </HStack>
                <HStack space={2}>
                    <Pressable onPress={(): void => console.log('Navigate to Abcountable workout 1')}>
                        <Box><Text>Abcountable workout 1</Text></Box>
                    </Pressable>
                    <Pressable onPress={(): void => console.log('Navigate to Abcountable workout 2')}>
                        <Box><Text>Abcountable workout 2</Text></Box>
                    </Pressable>
                </HStack>
            </VStack>
        </RefreshableScrollView>
    );
};
