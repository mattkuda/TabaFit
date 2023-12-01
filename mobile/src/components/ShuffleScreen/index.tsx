import React, { useState, useEffect, useCallback } from 'react';
import {
    Button, Checkbox, VStack, HStack, Text, IconButton, Icon, ScrollView,
    Modal,
    Input,
    Divider, FormControl,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useSetRecoilState } from 'recoil';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { TabataTimerScreenNavigationProp } from '../../types/navigationTypes';
import { showFooterState } from '../../atoms/showFooterAtom';
import { TabataEquipmentType, TabataWorkout } from '../../types/workouts';
import { defaultTabataWorkout, shuffleExercises } from './util';
import { ShuffleScreenRouteProp } from '../../navigation/navigationTypes';
import { calculateTotalWorkoutTime, formatTime } from '../TabataTimerScreen/util';

type CheckboxItemProps = {
    label: string;
    value: boolean;
    setValue: React.Dispatch<React.SetStateAction<boolean>>;
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

export const ShuffleScreen: React.FC = () => {
    const route = useRoute<ShuffleScreenRouteProp>();
    const routeWorkout = route.params?.workout ?? defaultTabataWorkout;
    const [shuffledWorkout, setShuffledWorkout] = useState<TabataWorkout>(routeWorkout);
    const [includeUpper, setIncludeUpper] = useState<boolean>(true);
    const [includeLower, setIncludeLower] = useState<boolean>(true);
    const [includeAbs, setIncludeAbs] = useState<boolean>(true);
    const [includeCardio, setIncludeCardio] = useState<boolean>(true);
    const [modalWorkout, setModalWorkout] = useState<TabataWorkout>(routeWorkout);
    const setShowFooter = useSetRecoilState(showFooterState);
    const navigation = useNavigation<TabataTimerScreenNavigationProp>();
    const { authState } = useAuth();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const userId = authState?.userId;
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [selectedEquipment, setSelectedEquipment] = useState<TabataEquipmentType[]>([]);
    const [selectedEquipmentTemp, setSelectedEquipmentTemp] = useState<TabataEquipmentType[]>([]);

    const toggleEquipment = (equipment: TabataEquipmentType): void => {
        setSelectedEquipmentTemp((prev) => {
            if (prev.includes(equipment)) {
                return prev.filter((item) => item !== equipment);
            }
            return [...prev, equipment];
        });
    };

    useFocusEffect(
        useCallback(() => {
            setShowFooter(false);

            return () => setShowFooter(true);
        }, [setShowFooter]),
    );

    const shouldDisableCheckbox = (checkboxValue: boolean): boolean => {
        const checkedCount = [includeUpper, includeLower, includeAbs, includeCardio]
            .filter((val) => val).length;

        return checkedCount === 1 && checkboxValue;
    };

    const triggerShuffle = (): void => {
        const tabatas = shuffleExercises(
            shuffledWorkout.numberOfTabatas,
            selectedEquipment,
            includeUpper,
            includeLower,
            includeAbs,
            includeCardio,
        );

        setShuffledWorkout((prev) => ({
            ...prev,
            tabatas,
        }));
    };

    const handleModalDone = (): void => {
        setShowSettingsModal(false);
        setSelectedEquipment(selectedEquipmentTemp);
        setShuffledWorkout(modalWorkout);
        triggerShuffle();
    };

    const handleModalCancel = (): void => {
        setShowSettingsModal(false);
        setSelectedEquipmentTemp(selectedEquipment);
        setModalWorkout(shuffledWorkout);
    };

    useEffect(() => {
        if (!routeWorkout) {
            triggerShuffle();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        triggerShuffle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shuffledWorkout.numberOfTabatas, includeUpper, includeLower, includeAbs, includeCardio]);

    const handleWorkoutSettingChange = (name, value): void => {
        setModalWorkout((prevWorkout) => ({
            ...prevWorkout,
            [name]: value,
        }));
    };

    useFocusEffect(
        React.useCallback(() => {
            if (!route.params?.workout) {
                const tabatas = shuffleExercises(
                    shuffledWorkout.numberOfTabatas,
                    selectedEquipment,
                    includeUpper,
                    includeLower,
                    includeAbs,
                    includeCardio,
                );

                setShuffledWorkout((prev) => ({
                    ...prev,
                    tabatas,
                }));
            } else {
                setShuffledWorkout(route.params.workout);
            }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [route.params?.workout]),
    );

    const handleStartWorkout = (): void => {
        if (shuffledWorkout) {
            navigation.navigate('TabataTimer', { workout: shuffledWorkout });
        }
    };

    const totalWorkoutTime = formatTime(calculateTotalWorkoutTime(
        shuffledWorkout.warmupDuration,
        shuffledWorkout.exerciseDuration,
        shuffledWorkout.restDuration,
        shuffledWorkout.numberOfTabatas,
        shuffledWorkout.exercisesPerTabata,
        shuffledWorkout.intermisionDuration,
        shuffledWorkout.cooldownDuration,
    ));

    return (
        <VStack flex={1} px={4} space={4}>
            <HStack alignItems="center" justifyContent="space-between" pt={4}>
                <Button onPress={(): void => navigation.goBack()}>Go Back</Button>
                <IconButton
                    icon={<Icon as={Ionicons} name="shuffle" />}
                    onPress={(): void => triggerShuffle()}
                />
                <Text fontSize="md">{`Total Time: ${totalWorkoutTime}`}</Text>
            </HStack>
            <HStack alignItems="center" justifyContent="space-between">
                <CheckboxItem disabled={shouldDisableCheckbox(includeUpper)} label="Upper" setValue={setIncludeUpper} value={includeUpper} />
                <CheckboxItem disabled={shouldDisableCheckbox(includeLower)} label="Lower" setValue={setIncludeLower} value={includeLower} />
                <CheckboxItem disabled={shouldDisableCheckbox(includeAbs)} label="Abs" setValue={setIncludeAbs} value={includeAbs} />
                <CheckboxItem disabled={shouldDisableCheckbox(includeCardio)} label="Cardio" setValue={setIncludeCardio} value={includeCardio} />
            </HStack>
            <HStack alignItems="center" justifyContent="center">
                <IconButton
                    icon={<Icon as={Ionicons} name="remove" />}
                    onPress={(): void => setShuffledWorkout((prev) => ({
                        ...prev,
                        numberOfTabatas: Math.max(prev.numberOfTabatas - 1, 1),
                    }))}
                />
                <Text mx={2}>
                    {`${shuffledWorkout.numberOfTabatas} Tabatas`}
                </Text>
                <IconButton
                    icon={<Icon as={Ionicons} name="add" />}
                    onPress={(): void => setShuffledWorkout((prev) => ({
                        ...prev,
                        numberOfTabatas: prev.numberOfTabatas + 1,
                    }))}
                />
            </HStack>
            <HStack alignItems="center" justifyContent="space-between" space={2}>
                <Button flex={1} onPress={(): void => setShowSettingsModal(true)}>Settings</Button>
            </HStack>
            <ScrollView>
                {shuffledWorkout?.tabatas.map((circuit, index) => (
                    <VStack borderColor="coolGray.200" borderRadius="md" borderWidth={1} mt={2} p={4} space={2}>
                        <Text bold fontSize="md">
                            Tabata
                            {' '}
                            {index + 1}
                        </Text>
                        {circuit.slice(0, 4).map((exercise) => (
                            <Text>{exercise.name}</Text>
                        ))}
                    </VStack>
                ))}
            </ScrollView>
            {/* Pinned START button */}
            <Button bottom={0} position="absolute" width="100%" onPress={(): void => handleStartWorkout()}>
                Start
            </Button>
            <Modal isOpen={showSettingsModal} size="full" onClose={(): void => setShowSettingsModal(false)}>
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header>Select Equipment</Modal.Header>
                    <Modal.Body>
                        {/* List of checkboxes for equipment */}
                        {['Kettlebell', 'Box Platform', 'Yoga Ball', 'Workout Band', 'Dumbells', 'Hanging Bar'].map((equipment, index) => (
                            <Checkbox
                                isChecked={selectedEquipmentTemp.includes(equipment as TabataEquipmentType)}
                                // eslint-disable-next-line react/no-array-index-key
                                key={index} // Use index as key
                                value={index.toString()} // Use index as value
                                onChange={(): void => toggleEquipment(equipment as TabataEquipmentType)}
                            >
                                {equipment}
                            </Checkbox>
                        ))}
                        <Divider my="2" />
                        {/* Input fields for each setting (Example for warmupDuration) */}
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
                        <FormControl.Label>Number of Tabatas</FormControl.Label>
                        <Input
                            keyboardType="numeric"
                            placeholder="Number of Tabatas"
                            value={modalWorkout?.numberOfTabatas.toString()}
                            onChangeText={(text): void => handleWorkoutSettingChange('numberOfTabatas', parseInt(text, 10) || 0)}
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
                    <Modal.Footer>
                        <Button onPress={handleModalDone}>Done</Button>
                        <Button variant="ghost" onPress={handleModalCancel}>Cancel</Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </VStack>
    );
};
