import React, { useCallback, useEffect, useState } from 'react';
import {
    VStack, IconButton, Icon, HStack, Text, Input,
    Toast, Modal, Button, Checkbox, Box,
    Select, Image,
    Switch,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { NestableScrollContainer } from 'react-native-draggable-flatlist';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useQueryClient } from 'react-query';
import { Animated, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { WorkoutsStackParamList } from '../../navigation/navigationTypes';
import { useCreateWorkout, useUpdateWorkout } from '../../mutations/workoutMutations';
import {
    buildNewTabataInitialState,
    emptyTabata,
} from '../shuffleUtil';
import { useAuth } from '../../context/AuthContext';
import { BuildWorkoutScreenNavigationProp } from '../../types/navigationTypes';
import {
    Difficulty,
    TabataExercise, TabataWorkout,
} from '../../types/workouts';
import { GradientVStack } from '../common/GradientVStack';
import { TabataItem } from './TabataItem';
import { exerciseIconDictionary, equipmentIconDictionary } from '../../util/util';

type BuildWorkoutScreenRouteProp = RouteProp<WorkoutsStackParamList, 'BuildWorkoutScreen'>;

export const BuildWorkoutScreen: React.FC<BuildWorkoutScreenNavigationProp> = (): JSX.Element => {
    const navigation = useNavigation<BuildWorkoutScreenNavigationProp>();
    const route = useRoute<BuildWorkoutScreenRouteProp>();
    const { authState } = useAuth();
    const { workout: routeWorkout, shouldUpdate } = route.params;
    const [workout, setWorkout] = useState<TabataWorkout>(routeWorkout || buildNewTabataInitialState);
    const createWorkoutMutation = useCreateWorkout();
    const updateWorkoutMutation = useUpdateWorkout();
    const [workoutName, setWorkoutName] = useState(workout?.name || '');
    const queryClient = useQueryClient();
    const [modalWorkout, setModalWorkout] = useState<TabataWorkout>(workout);
    const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
    const [showHelpDialog, setShowHelpDialog] = useState<boolean>(false);
    const [equipmentEnabled, setEquipmentEnabled] = useState<boolean>(!Object.values(workout.equipment)
        .every((setting) => setting === false));

    const hanldeAddTabata = (): void => {
        setWorkout((currentWorkout) => ({
            ...currentWorkout,
            numberOfTabatas: workout.numberOfTabatas + 1,
            tabatas: [...workout.tabatas, emptyTabata],
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const validateWorkout = (): boolean => {
        if (!workoutName.trim()) {
            Toast.show({
                title: 'Workout name required',
                bgColor: 'red.500',
                placement: 'top',
            });
            return false;
        }

        for (let i = 0; i < workout.tabatas.length; i++) {
            if (workout.tabatas[i].some((exercise) => exercise === null)) {
                Toast.show({
                    title: `Incomplete Tabata: Circuit ${i + 1}`,
                    bgColor: 'red.500',
                    placement: 'top',
                });
                return false;
            }
        }

        return true;
    };

    const handleSaveOrUpdateWorkout = useCallback((): void => {
        if (!validateWorkout()) {
            return;
        }

        const workoutData: TabataWorkout = {
            ...workout,
            name: workoutName,
            createdAt: new Date().toISOString(),
            userId: authState.userId,
            isDiscoverable: true,
        };

        const onSuccessCallback = (newWorkoutId: string): void => {
            // Invalidate queries to refresh data
            queryClient.invalidateQueries('my-saved-workouts');
            queryClient.invalidateQueries('my-created-workouts');
            queryClient.invalidateQueries('workouts');
            queryClient.invalidateQueries(['workout', workout._id.toString()]);
            if (shouldUpdate) {
                navigation.navigate('ViewWorkoutScreen', { workoutId: newWorkoutId });
            } else {
                navigation.goBack();
            }
        };

        if (shouldUpdate) {
            updateWorkoutMutation.mutate({
                workoutId: workout._id.toString(),
                workout: workoutData,
            }, {
                onSuccess: (data) => onSuccessCallback(data.newWorkoutId),
            });
        } else {
            createWorkoutMutation.mutate({
                workout: workoutData,
            }, {
                onSuccess: (data) => onSuccessCallback(data.newWorkoutId),
            });
        }
    }, [validateWorkout, workout, workoutName, authState.userId, shouldUpdate, queryClient,
        navigation, updateWorkoutMutation, createWorkoutMutation]);

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
                    <Button
                        variant="ghost"
                        onPress={handleSaveOrUpdateWorkout}
                    >
                        <Text color="white" fontSize="md">{shouldUpdate ? 'Update' : 'Save'}</Text>
                    </Button>
                </HStack>
            ),
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigation, handleSaveOrUpdateWorkout]);

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

    const handleNameChange = (text: string): void => setWorkoutName(text);

    const handleModalDone = (): void => {
        setShowSettingsModal(false);
        setEquipmentEnabled(!Object.values(modalWorkout.equipment)
            .every((setting) => setting === false));
        setWorkout((currentWorkout) => {
            const updatedEquipment = { ...modalWorkout.equipment };
            const updatedDifficulty = modalWorkout.difficulty;
            const updatedNumberOfTabatas = modalWorkout.numberOfTabatas;
            const updatedBodyFocus = { ...modalWorkout.includeSettings };

            const newTabatas = updatedNumberOfTabatas > currentWorkout.tabatas.length
                ? [...currentWorkout.tabatas, ...Array.from(
                    { length: updatedNumberOfTabatas - currentWorkout.tabatas.length },
                    () => emptyTabata,
                )] : currentWorkout.tabatas.slice(0, updatedNumberOfTabatas);

            return {
                ...currentWorkout,
                equipment: updatedEquipment,
                difficulty: updatedDifficulty,
                numberOfTabatas: newTabatas.length,
                includeSettings: updatedBodyFocus,
                tabatas: newTabatas,
            };
        });
    };

    const handleModalCancel = (): void => {
        setShowSettingsModal(false);
        setModalWorkout(workout);
    };

    const handleDurationChange = (itemValue): void => {
        setModalWorkout((prevWorkout) => {
            const newTabatas = itemValue > prevWorkout.tabatas.length
                ? [...prevWorkout.tabatas, ...Array.from(
                    { length: itemValue - prevWorkout.tabatas.length },
                    () => emptyTabata,
                )]
                : prevWorkout.tabatas.slice(0, itemValue);

            return {
                ...prevWorkout,
                tabatas: newTabatas,
                numberOfTabatas: newTabatas.length, // Update numberOfTabatas to reflect new length
            };
        });
    };

    // const handleNumberTabatasChange = (itemValue: number): void => {
    //     if (itemValue < 1) return;

    //     setWorkout((prevWorkout) => {
    //         const newTabatas = itemValue > prevWorkout.tabatas.length
    //             ? [...prevWorkout.tabatas, ...Array.from(
    //                 { length: itemValue - prevWorkout.tabatas.length },
    //                 () => emptyTabata,
    //             )]
    //             : prevWorkout.tabatas.slice(0, itemValue);

    //         return {
    //             ...prevWorkout,
    //             tabatas: newTabatas,
    //             numberOfTabatas: newTabatas.length, // Update numberOfTabatas to reflect new length
    //         };
    //     });
    // };

    const handleWorkoutSettingChange = (name: string, value: boolean): void => {
        setModalWorkout((prevWorkout) => {
            const updatedSettings = {
                ...prevWorkout.includeSettings,
                [name]: value,
            };

            // Ensure that at least one setting remains true
            if (Object.values(updatedSettings).every((setting) => !setting)) {
                updatedSettings[name] = true;
            }
            return {
                ...prevWorkout,
                includeSettings: updatedSettings,
            };
        });
    };

    const handleDifficultyChange = (itemValue): void => {
        handleWorkoutSettingChange('difficulty', itemValue);
    };

    const toggleEquipment = (): void => {
        setEquipmentEnabled(!equipmentEnabled);
        setModalWorkout((prev) => ({
            ...prev,
            equipment: {
                useKettlebell: false,
                useDumbbells: false,
                useHangingBar: false,
                useYogaBall: false,
                useWorkoutBand: false,
                useBoxPlatform: false,
            },
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
            p={4}
            space={2}
            width="100%"
        >
            <HStack alignItems="center" background="transparent" space={4} width="100%">
                <Input
                    flex={1}
                    fontSize="lg"
                    mb={0}
                    placeholder="Enter Workout Name"
                    returnKeyType="done"
                    value={workoutName}
                    onChangeText={handleNameChange}
                />
                <IconButton
                    borderColor="white"
                    borderRadius="full"
                    borderWidth={1}
                    color="flame.500"
                    h={42}
                    icon={<Icon as={Ionicons} color="white" name="settings" />}
                    w={42}
                    onPress={(): void => setShowSettingsModal(true)}
                />
            </HStack>
            <NestableScrollContainer>
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
            {/* Settings Modal */}
            <Modal
                borderColor="gray.600"
                isOpen={showSettingsModal}
                size="full"
                onClose={handleModalCancel}
            >
                <BlurView
                    intensity={20}
                    style={{
                        width: '100%', flex: 1, justifyContent: 'center', alignItems: 'center',
                    }}
                    tint="dark"
                >
                    <Modal.Content
                        backgroundColor="gray.900"
                        borderColor="gray.600"
                        borderWidth={2}
                        style={{ margin: 'auto' }}
                        width="85%"
                    >
                        <Modal.CloseButton />
                        <Modal.Body
                            backgroundColor="gray.900"
                            // @ts-expect-error
                            gap={8}
                            px={8}
                        >
                            <Box
                                flexDirection="row"
                                justifyContent="center"
                                width="100%"
                            >
                                <Text bold fontSize="xl">
                                    Choose Your Settings
                                </Text>
                            </Box>
                            {/* Number of Tabatas Row */}
                            <Box
                                flexDirection="row"
                                justifyContent="center"
                                width="100%"
                            >
                                <HStack alignItems="center" background="transparent" justifyContent="space-between" width="100%">
                                    <HStack alignItems="center" justifyContent="flex-start">
                                        <Icon as={Ionicons} mr={2} name="body-outline" size="md" />
                                        <Text
                                            fontSize="xl"
                                            numberOfLines={2}
                                            style={{
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            Duration:
                                        </Text>
                                    </HStack>
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
                                        // @ts-expect-error
                                        leftElement={<Text fontSize="xl">{`${modalWorkout.numberOfTabatas.toString()} ${modalWorkout.numberOfTabatas > 1 ? 'Tabatas' : 'Tabata'}`}</Text>}
                                        size="xl"
                                        onValueChange={(itemValue): void => handleDurationChange(
                                            parseInt(itemValue, 10) || 0,
                                        )}
                                    >
                                        {[...Array(24).keys()].map((val, i) => (
                                            <Select.Item key={val} label={`${(i + 1).toString()} ${i > 0 ? 'Tabatas' : 'Tabata'}`} value={(i + 1).toString()} />
                                        ))}
                                    </Select>
                                </HStack>
                            </Box>
                            {/* Difficulty Row */}
                            <Box
                                flexDirection="row"
                                justifyContent="center"
                                width="100%"
                            >
                                <HStack alignItems="center" background="transparent" justifyContent="space-between" width="100%">
                                    <HStack alignItems="center" justifyContent="flex-start">
                                        <Icon as={Ionicons} mr={2} name="barbell-outline" size="md" />
                                        <Text
                                            fontSize="xl"
                                            numberOfLines={2}
                                            style={{
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            Difficulty:
                                        </Text>
                                    </HStack>
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
                                        // @ts-expect-error
                                        leftElement={<Text fontSize="xl" pl={2}>{modalWorkout.difficulty}</Text>}
                                        selectedValue={modalWorkout.difficulty}
                                        size="xl"
                                        onValueChange={(itemValue): void => handleDifficultyChange(itemValue)}
                                    >
                                        {[Difficulty.Basic, Difficulty.Intermediate, Difficulty.Advanced].map((val) => (
                                            <Select.Item key={val} label={val} value={val} />
                                        ))}
                                    </Select>
                                </HStack>
                            </Box>
                            {/* Focus Row */}
                            <Box
                                flexDirection="row"
                                justifyContent="center"
                                width="100%"
                            >
                                <HStack alignItems="center" background="transparent" justifyContent="space-between" width="100%">
                                    <HStack alignItems="center" justifyContent="flex-start" space={4}>
                                        <Text
                                            fontSize="xl"
                                            numberOfLines={2}
                                            style={{
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            Focus:
                                        </Text>
                                        <Box>
                                            <TouchableOpacity onPress={(): void => handleWorkoutSettingChange('includeUpper', !modalWorkout.includeSettings?.includeUpper)}>
                                                <Box
                                                    bg={modalWorkout.includeSettings?.includeUpper ? {
                                                        linearGradient: {
                                                            colors: ['flame.500', 'cherry.500'],
                                                            start: [0, 1],
                                                            end: [1, 0],
                                                        },
                                                    } : 'gray.900'}
                                                    bgColor={modalWorkout.includeSettings?.includeUpper ? 'flame.500' : 'gray.900'}
                                                    borderColor="gray.100"
                                                    borderRadius="md"
                                                    borderWidth={1}
                                                    p={2}
                                                >
                                                    <Image
                                                        alt="Upper Body icon"
                                                        source={exerciseIconDictionary['Upper Body']}
                                                        style={{
                                                            height: 24,
                                                            width: 24,
                                                            tintColor: 'white',
                                                        }}
                                                    />
                                                </Box>
                                            </TouchableOpacity>
                                        </Box>
                                        <Box>
                                            <TouchableOpacity onPress={(): void => handleWorkoutSettingChange('includeLower', !modalWorkout.includeSettings?.includeLower)}>
                                                <Box
                                                    bg={modalWorkout.includeSettings?.includeLower ? {
                                                        linearGradient: {
                                                            colors: ['flame.500', 'cherry.500'],
                                                            start: [0, 1],
                                                            end: [1, 0],
                                                        },
                                                    } : 'gray.900'}
                                                    borderColor="gray.100"
                                                    borderRadius="md"
                                                    borderWidth={1}
                                                    p={2}
                                                >
                                                    <Image
                                                        alt="Lower Body icon"
                                                        source={exerciseIconDictionary['Lower Body']}
                                                        style={{
                                                            height: 24,
                                                            width: 24,
                                                            tintColor: 'white',
                                                        }}
                                                    />
                                                </Box>
                                            </TouchableOpacity>
                                        </Box>
                                        <Box>
                                            <TouchableOpacity onPress={(): void => handleWorkoutSettingChange('includeAbs', !modalWorkout.includeSettings?.includeAbs)}>
                                                <Box
                                                    bg={modalWorkout.includeSettings?.includeAbs ? {
                                                        linearGradient: {
                                                            colors: ['flame.500', 'cherry.500'],
                                                            start: [0, 1],
                                                            end: [1, 0],
                                                        },
                                                    } : 'gray.900'}
                                                    borderColor="gray.100"
                                                    borderRadius="md"
                                                    borderWidth={1}
                                                    p={2}
                                                >
                                                    <Image
                                                        alt="Abs icon"
                                                        source={exerciseIconDictionary.Abs}
                                                        style={{
                                                            height: 24,
                                                            width: 24,
                                                            tintColor: 'white',
                                                        }}
                                                    />
                                                </Box>
                                            </TouchableOpacity>
                                        </Box>
                                        <Box>
                                            <TouchableOpacity onPress={(): void => handleWorkoutSettingChange('includeCardio', !modalWorkout.includeSettings?.includeCardio)}>
                                                <Box
                                                    bg={modalWorkout.includeSettings?.includeCardio ? {
                                                        linearGradient: {
                                                            colors: ['flame.500', 'cherry.500'],
                                                            start: [0, 1],
                                                            end: [1, 0],
                                                        },
                                                    } : 'gray.900'}
                                                    borderColor="gray.100"
                                                    borderRadius="md"
                                                    borderWidth={1}
                                                    p={2}
                                                >
                                                    <Image
                                                        alt="Cardio icon"
                                                        source={exerciseIconDictionary.Cardio}
                                                        style={{
                                                            height: 24,
                                                            width: 24,
                                                            tintColor: 'white',
                                                        }}
                                                    />
                                                </Box>
                                            </TouchableOpacity>
                                        </Box>
                                    </HStack>
                                </HStack>
                            </Box>
                            {/* Equipment Area */}
                            {false && (
                                <VStack space={4}>
                                    <Box
                                        flexDirection="row"
                                        justifyContent="center"
                                        width="100%"
                                    >
                                        <HStack alignItems="center" background="transparent" justifyContent="space-between" width="100%">
                                            <HStack alignItems="center" justifyContent="flex-start">
                                                <Image
                                                    alt="KB icon"
                                                    mr={2}
                                                    source={equipmentIconDictionary.Kettlebell}
                                                    style={{
                                                        height: 24,
                                                        width: 24,
                                                        tintColor: 'white',
                                                    }}
                                                />
                                                <Text
                                                    fontSize="xl"
                                                    numberOfLines={2}
                                                    style={{
                                                        fontWeight: 'bold',
                                                    }}
                                                >
                                                    Equipment:
                                                </Text>
                                            </HStack>
                                            <Switch
                                                isChecked={equipmentEnabled}
                                                offThumbColor="gray.200"
                                                offTrackColor="gray.700"
                                                size="md"
                                                onThumbColor="gray.200"
                                                onToggle={toggleEquipment}
                                                onTrackColor="flame.500"
                                            />
                                        </HStack>
                                    </Box>
                                    {/* Equipment Checkboxes Row */}
                                    {equipmentEnabled && (
                                        <VStack maxWidth={335} minWidth={335} space={2}>
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
                                                        <Text>Kettlebells</Text>
                                                    </Checkbox>
                                                </HStack>
                                                <HStack flex={1}>
                                                    <Checkbox
                                                        bgColor={modalWorkout.equipment.useDumbbells ? 'primary' : 'gray.900'}
                                                        isChecked={modalWorkout.equipment.useDumbbells}
                                                        key="Dumbbells-checkbox"
                                                        mb="2"
                                                        size="lg"
                                                        value="Dumbbells"
                                                        onChange={(): void => handleWorkoutEquipmentChange('useDumbbells', !modalWorkout.equipment.useDumbbells)}
                                                    >
                                                        <Text>Dumbbells</Text>
                                                    </Checkbox>
                                                </HStack>
                                            </HStack>
                                            <HStack width="100%">
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
                                                        <Text>Box Platform</Text>
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
                                                        <Text>Yoga Ball</Text>
                                                    </Checkbox>
                                                </HStack>
                                            </HStack>
                                        </VStack>
                                    )}
                                </VStack>
                            )}
                            <Box
                                flexDirection="row"
                                justifyContent="center"
                                width="100%"
                            >
                                <TouchableOpacity onPress={handleModalDone}>
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
                                        p="2"
                                        px={4}
                                        width="120"
                                    >
                                        <Icon as={Ionicons} name="checkmark" size="lg" />
                                        <Text fontSize="md" fontWeight="semibold">
                                            Done
                                        </Text>
                                    </Box>
                                </TouchableOpacity>
                            </Box>
                        </Modal.Body>
                    </Modal.Content>
                </BlurView>
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
