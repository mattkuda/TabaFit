import React, { useEffect, useState } from 'react';
import {
    VStack, IconButton, Icon, HStack, Text, Input,
    Modal, Button, Checkbox, FormControl, Box,
    Select,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { NestableScrollContainer } from 'react-native-draggable-flatlist';
import { useNavigation } from '@react-navigation/native';
import { Animated, TouchableOpacity } from 'react-native';
import {
    buildNewTabataInitialState, shuffleExercises,
} from '../shuffleUtil';
import { ShuffleWorkoutScreenNavigationProp } from '../../types/navigationTypes';
import {
    TabataExercise, TabataWorkout,
} from '../../types/workouts';
import { GradientVStack } from '../common/GradientVStack';
import { TabataItem } from '../BuildWorkoutScreen/TabataItem';

// type ShuffleWorkoutScreenRouteProp = RouteProp<WorkoutsStackParamList, 'ShuffleWorkoutScreen'>;

export const ShuffleWorkoutScreen: React.FC<ShuffleWorkoutScreenNavigationProp> = (): JSX.Element => {
    const navigation = useNavigation<ShuffleWorkoutScreenNavigationProp>();
    const [workout, setWorkout] = useState<TabataWorkout>(buildNewTabataInitialState);
    const [modalWorkout, setModalWorkout] = useState<TabataWorkout>(workout);
    const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
    const [showHelpDialog, setShowHelpDialog] = useState<boolean>(false);

    const hanldeAddTabata = (): void => {
        const {
            includeUpper, includeLower, includeAbs, includeCardio,
        } = workout.includeSettings;
        const selectedEquipment = workout.equipment;

        const newlyShuffledTabata = shuffleExercises(
            1,
            selectedEquipment,
            includeUpper,
            includeLower,
            includeAbs,
            includeCardio,
        );

        setWorkout((prev) => ({
            ...prev,
            numberOfTabatas: workout.numberOfTabatas + 1,
            tabatas: [...workout.tabatas, newlyShuffledTabata[0]],
        }));
    };

    const removeTabata = (index: number): void => {
        setWorkout((currentWorkout) => ({
            ...currentWorkout,
            numberOfTabatas: workout.numberOfTabatas - 1,
            tabatas: currentWorkout.tabatas.filter((_, i) => i !== index),
        }));
    };

    const moveTabataUp = (index: number): void => {
        if (index === 0) return;
        setWorkout((currentWorkout) => {
            const newTabatas = [...currentWorkout.tabatas];

            [newTabatas[index - 1], newTabatas[index]] = [newTabatas[index], newTabatas[index - 1]];
            return { ...currentWorkout, tabatas: newTabatas };
        });
    };

    const moveTabataDown = (index: number): void => {
        if (index === workout.tabatas.length - 1) return;
        setWorkout((currentWorkout) => {
            const newTabatas = [...currentWorkout.tabatas];

            [newTabatas[index], newTabatas[index + 1]] = [newTabatas[index + 1], newTabatas[index]];
            return { ...currentWorkout, tabatas: newTabatas };
        });
    };

    const handleStartWorkout = (): void => {
        navigation.navigate('TabataTimerScreen', { workout });
    };

    useEffect(() => {
        navigation.setOptions({
            // eslint-disable-next-line react/no-unstable-nested-components
            headerRight: (): JSX.Element => (
                <HStack marginRight="3" space={0}>
                    <IconButton
                        borderRadius="full"
                        icon={<Icon as={Ionicons} color="white" name="help-circle" size="lg" />}
                        size="lg"
                        onPress={(): void => setShowHelpDialog(true)}
                    />
                </HStack>
            ),
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigation]);

    const updateExercisesOrder = (tabataIndex: number, newExercisesOrder: TabataExercise[]): void => {
        setWorkout((currentWorkout) => {
            const updatedTabatas = [...currentWorkout.tabatas];

            updatedTabatas[tabataIndex] = newExercisesOrder;
            return { ...currentWorkout, tabatas: updatedTabatas };
        });
    };

    const handleSelectExercise = (tabataIndex: number, exerciseIndex: number): void => {
        navigation.navigate('SelectExerciseScreen', {
            onSelectWorkout: (selectedExercise) => {
                setWorkout((currentWorkout) => {
                    const updatedTabatas = [...currentWorkout.tabatas];
                    const updatedExercises = [...updatedTabatas[tabataIndex]];

                    updatedExercises[exerciseIndex] = selectedExercise;
                    updatedTabatas[tabataIndex] = updatedExercises;
                    return { ...currentWorkout, tabatas: updatedTabatas };
                });
            },
        });
    };

    const triggerShuffle = (): void => {
        if (workout.includeSettings) {
            const {
                includeUpper, includeLower, includeAbs, includeCardio,
            } = workout.includeSettings;
            const selectedEquipment = workout.equipment;

            const shuffledTabatas = shuffleExercises(
                workout.numberOfTabatas,
                selectedEquipment,
                includeUpper,
                includeLower,
                includeAbs,
                includeCardio,
            );

            setWorkout((prev) => ({
                ...prev,
                tabatas: shuffledTabatas,
            }));
        }
    };

    useEffect(() => {
        triggerShuffle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // When the select is used to change the number of tabatas, shuffle the exercises
    useEffect(() => {
        triggerShuffle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [workout.numberOfTabatas]);

    const handleModalDone = (): void => {
        setShowSettingsModal(false);
        setWorkout(modalWorkout);
        triggerShuffle();
    };

    const handleModalCancel = (): void => {
        setShowSettingsModal(false);
        setModalWorkout(workout);
    };

    const handleNumberTabatasChange = (itemValue): void => {
        setWorkout((prevWorkout) => ({
            ...prevWorkout,
            numberOfTabatas: itemValue,
        }));
    };

    const handleWorkoutSettingChange = (name, value): void => {
        setModalWorkout((prevWorkout) => ({
            ...prevWorkout,
            [name]: value,
        }));
    };

    const handleWorkoutEquipmentChange = (name, value): void => {
        setModalWorkout((prev) => ({
            ...prev,
            equipment: {
                ...prev.equipment,
                [name]: value,
            },
        }));
    };

    const scaleAnimation = new Animated.Value(1);

    Animated.loop(
        Animated.sequence([
            Animated.timing(scaleAnimation, {
                toValue: 1.4,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnimation, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
        ]),
    ).start();

    return (
        <GradientVStack
            flex={1}
            space={0}
            width="100%"
        >
            <HStack alignItems="center" background="transparent" justifyContent="space-between" pt={2} space={4} width="100%">
                <Box alignItems="flex-start" flex={1}>
                    <Select
                        _actionSheetContent={{
                            bg: 'gray.900',
                        }}
                        _item={{
                            bg: 'gray.900',
                            color: 'white',
                            _text: {
                                color: 'white',
                            },
                            _pressed: {
                                bg: 'gray.800',
                            },
                        }}
                        _selectedItem={{
                            bg: 'gray.700',
                            color: 'white',
                        }}
                        backgroundColor="transparent"
                        borderColor="transparent"
                        dropdownIcon={(
                            <HStack alignItems="center" space={2}>
                                <Text fontSize="md">{`${workout.numberOfTabatas.toString()} ${workout.numberOfTabatas > 0 ? 'Tabatas' : 'Tabata'}`}</Text>
                                <Icon as={Ionicons} color="gray.400" ml={0} mr={4} name="chevron-down" pl={0} size="xs" />
                            </HStack>
                            )}
                        minWidth="125"
                        ml={-2}
                        size="lg"
                        onValueChange={(itemValue): void => handleNumberTabatasChange(parseInt(itemValue, 10) || 0)}
                    >
                        {[...Array(99).keys()].map((val, i) => (
                            <Select.Item key={val} label={`${(i + 1).toString()} ${i > 0 ? 'Tabatas' : 'Tabata'}`} value={(i + 1).toString()} />
                        ))}
                    </Select>
                </Box>
                <Box alignItems="center" flex={1} position="relative">
                    <TouchableOpacity
                        onPress={(): void => triggerShuffle()}
                    >
                        <Box
                            alignItems="center"
                            bg={{
                                linearGradient: {
                                    colors: ['flame.500', 'cherry.500'],
                                    start: [0, 1],
                                    end: [1, 0],
                                },
                            }}
                            borderRadius="full"
                            flexDirection="row"
                                // @ts-ignore
                            gap={2}
                            justifyContent="center"
                            mx="4"
                            my="2"
                            p="2"
                            px={4}
                            width="150"
                        >
                            <Icon as={Ionicons} name="shuffle" size="lg" />
                            <Text fontSize="md" fontWeight="semibold">
                                Shuffle
                            </Text>
                        </Box>
                    </TouchableOpacity>
                </Box>
                <Box
                    alignItems="flex-end"
                    flex={1}
                >
                    <IconButton
                        borderColor="white"
                        borderRadius="full"
                        borderWidth={1}
                        color="flame.500"
                        icon={<Icon as={Ionicons} color="white" name="settings" />}
                        mr={4}
                        onPress={(): void => setShowSettingsModal(true)}
                    />
                </Box>
            </HStack>
            <NestableScrollContainer style={{ paddingHorizontal: 16 }}>
                {workout.tabatas.map((tabataCircuit, index) => (
                    <TabataItem
                        changeExercise={handleSelectExercise}
                        circuitIndex={index}
                        moveTabataDown={moveTabataDown}
                        moveTabataUp={moveTabataUp}
                        removeTabata={workout.tabatas.length > 1 && removeTabata}
                        tabataCircuit={tabataCircuit}
                        updateExercisesOrder={updateExercisesOrder}
                    />
                ))}
                <Button
                    alignSelf="flex-end"
                    borderRadius="full"
                    colorScheme="secondary"
                    endIcon={(
                        <Icon as={Ionicons} color="white" name="add" />
                    )}
                    mb={4}
                    mt={2}
                    variant="outline"
                    onPress={hanldeAddTabata}
                >
                    Add Tabata
                </Button>
            </NestableScrollContainer>
            <TouchableOpacity onPress={handleStartWorkout}>
                <Box
                    alignItems="center"
                    bg={{
                        linearGradient: {
                            colors: ['flame.500', 'cherry.500'],
                            start: [0, 1],
                            end: [1, 0],
                        },
                    }}
                    borderRadius="full"
                    flexDirection="row"
                    // @ts-expect-error
                    gap={2}
                    justifyContent="center"
                    mx="4"
                    my="2"
                    p="4"
                    px={4}
                >
                    <Text bold fontSize="lg">
                        Start
                    </Text>
                    <Animated.View style={{ transform: [{ scale: scaleAnimation }] }}>
                        <Icon as={Ionicons} name="flash" />
                    </Animated.View>
                </Box>
            </TouchableOpacity>
            {/* Settings Modal */}
            {/* TDOD: Move to its own component */}
            <Modal isOpen={showSettingsModal} size="full" onClose={(): void => setShowSettingsModal(false)}>
                <Modal.Content backgroundColor="gray.900">
                    <Modal.CloseButton />
                    <Modal.Header backgroundColor="gray.900" borderBottomWidth={0}>
                        <Text bold fontSize="lg">
                            Settings
                        </Text>
                    </Modal.Header>
                    <Modal.Body backgroundColor="gray.900">
                        <VStack space={2}>
                            <HStack width="100%">
                                <HStack flex={1}>
                                    <Checkbox
                                        bgColor={modalWorkout.equipment.useKettlebell ? 'primary' : 'gray.900'}
                                        isChecked={modalWorkout.equipment.useKettlebell}
                                        key="Kettlebell-checkbox"
                                        mb="2"
                                        size="lg"
                                        value="Kettlebells"
                                        onChange={(): void => handleWorkoutEquipmentChange('useKettlebell', !modalWorkout.equipment.useKettlebell)}
                                    >
                                        <Text pl="2">Kettlebells</Text>
                                    </Checkbox>
                                </HStack>
                                <HStack flex={1}>
                                    <Checkbox
                                        bgColor={modalWorkout.equipment.useDumbells ? 'primary' : 'gray.900'}
                                        isChecked={modalWorkout.equipment.useDumbells}
                                        key="Dumbells-checkbox"
                                        mb="2"
                                        size="lg"
                                        value="Dumbells"
                                        onChange={(): void => handleWorkoutEquipmentChange('useDumbells', !modalWorkout.equipment.useDumbells)}
                                    >
                                        <Text pl="2">Dumbells</Text>
                                    </Checkbox>
                                </HStack>
                            </HStack>
                            <HStack width="100%">
                                <HStack flex={1}>
                                    <Checkbox
                                        bgColor={modalWorkout.equipment.useHangingBar ? 'primary' : 'gray.900'}
                                        isChecked={modalWorkout.equipment.useHangingBar}
                                        key="HangingBar-checkbox"
                                        mb="2"
                                        size="lg"
                                        value="HangingBar"
                                        onChange={(): void => handleWorkoutEquipmentChange('useHangingBar', !modalWorkout.equipment.useHangingBar)}
                                    >
                                        <Text pl="2">Hanging Bar</Text>
                                    </Checkbox>
                                </HStack>
                                <HStack flex={1}>
                                    <Checkbox
                                        bgColor={modalWorkout.equipment.useYogaBall ? 'primary' : 'gray.900'}
                                        isChecked={modalWorkout.equipment.useYogaBall}
                                        key="YogaBall-checkbox"
                                        mb="2"
                                        size="lg"
                                        value="YogaBall"
                                        onChange={(): void => handleWorkoutEquipmentChange('useYogaBall', !modalWorkout.equipment.useYogaBall)}
                                    >
                                        <Text pl="2">Yoga Ball</Text>
                                    </Checkbox>
                                </HStack>
                            </HStack>
                            <HStack width="100%">
                                <HStack flex={1}>
                                    <Checkbox
                                        bgColor={modalWorkout.equipment.useWorkoutBand ? 'primary' : 'gray.900'}
                                        isChecked={modalWorkout.equipment.useWorkoutBand}
                                        key="WorkoutBand-checkbox"
                                        mb="2"
                                        size="lg"
                                        value="WorkoutBand"
                                        onChange={(): void => handleWorkoutEquipmentChange('useWorkoutBand', !modalWorkout.equipment.useWorkoutBand)}
                                    >
                                        <Text pl="2">Workout Band</Text>
                                    </Checkbox>
                                </HStack>
                                <HStack flex={1}>
                                    <Checkbox
                                        bgColor={modalWorkout.equipment.useBoxPlatform ? 'primary' : 'gray.900'}
                                        isChecked={modalWorkout.equipment.useBoxPlatform}
                                        key="BoxPlatform-checkbox"
                                        mb="2"
                                        size="lg"
                                        value="BoxPlatform"
                                        onChange={(): void => handleWorkoutEquipmentChange('useBoxPlatform', !modalWorkout.equipment.useBoxPlatform)}
                                    >
                                        <Text pl="2">Box Platform</Text>
                                    </Checkbox>
                                </HStack>
                            </HStack>
                        </VStack>
                        <FormControl.Label>Number of Tabatas</FormControl.Label>
                        <Input
                            keyboardType="numeric"
                            placeholder="Number of Tabatas"
                            value={modalWorkout?.numberOfTabatas.toString()}
                            onChangeText={(text): void => handleWorkoutSettingChange('numberOfTabatas', parseInt(text, 10) || 0)}
                        />
                        <FormControl.Label>Warmup</FormControl.Label>
                        <Input
                            keyboardType="numeric"
                            placeholder="Warmup Duration (seconds)"
                            value={modalWorkout?.warmupDuration.toString()}
                            onChangeText={(text): void => handleWorkoutSettingChange('warmupDuration', parseInt(text, 10) || 0)}
                        />
                        <FormControl.Label>Exercise Duration</FormControl.Label>
                        <Input
                            keyboardType="numeric"
                            placeholder="Exercise Duration (seconds)"
                            value={modalWorkout?.exerciseDuration.toString()}
                            onChangeText={(text): void => handleWorkoutSettingChange('exerciseDuration', parseInt(text, 10) || 0)}
                        />
                        <FormControl.Label>Rest Duration</FormControl.Label>
                        <Input
                            keyboardType="numeric"
                            placeholder="Rest Duration (seconds)"
                            value={modalWorkout?.restDuration.toString()}
                            onChangeText={(text): void => handleWorkoutSettingChange('restDuration', parseInt(text, 10) || 0)}
                        />
                        <FormControl.Label>Exercises Per Tabata</FormControl.Label>
                        <Input
                            keyboardType="numeric"
                            placeholder="Exercises Per Tabata"
                            value={modalWorkout?.exercisesPerTabata.toString()}
                            onChangeText={(text): void => handleWorkoutSettingChange('exercisesPerTabata', parseInt(text, 10) || 0)}
                        />
                        <FormControl.Label>Intermission Duration</FormControl.Label>
                        <Input
                            keyboardType="numeric"
                            placeholder="Intermission Duration (seconds)"
                            value={modalWorkout?.intermisionDuration.toString()}
                            onChangeText={(text): void => handleWorkoutSettingChange('intermisionDuration', parseInt(text, 10) || 0)}
                        />
                        <FormControl.Label>Coooldown Duration</FormControl.Label>
                        <Input
                            keyboardType="numeric"
                            placeholder="Cooldown Duration (seconds)"
                            value={modalWorkout?.cooldownDuration.toString()}
                            onChangeText={(text): void => handleWorkoutSettingChange('cooldownDuration', parseInt(text, 10) || 0)}
                        />
                    </Modal.Body>
                    <Modal.Footer backgroundColor="gray.900" borderTopWidth={0}>
                        <Button onPress={handleModalDone}>Done</Button>
                        <Button variant="ghost" onPress={handleModalCancel}>Cancel</Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
            {/* Help Dialog */}
            <Modal isOpen={showHelpDialog} size="full" onClose={(): void => setShowHelpDialog(false)}>
                <Modal.Content backgroundColor="gray.900">
                    <Modal.CloseButton />
                    <Modal.Header backgroundColor="gray.900">
                        <Text bold fontSize="lg">
                            Build Workout Help
                        </Text>
                    </Modal.Header>
                    <Modal.Body backgroundColor="gray.900">
                        <Box>
                            <Text mb={2}>
                                &bull; Select exercises for each Tabata circuit by clicking
                                on their titles.
                            </Text>
                            <Text mb={2}>&bull; Click and hold an exercise to drag and drop it to a new position.</Text>
                            <Text mb={2}>&bull; Use the up and down arrows to move a Tabata circuit up or down.</Text>
                            <Text mb={2}>
                                &bull; In shuffle mode, clicking the Shuffle
                                button will shuffle the exercises in each Tabata according to your settings.
                            </Text>
                            <Text mb={2}>&bull; Adjust settings in the Settings modal by clicking the gear icon.</Text>
                        </Box>
                    </Modal.Body>
                    <Modal.Footer backgroundColor="gray.900">
                        <Button onPress={(): void => setShowHelpDialog(false)}>Done</Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </GradientVStack>
    );
};
