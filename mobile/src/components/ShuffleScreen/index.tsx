import React, { useState, useEffect, useCallback } from 'react';
import {
    Button, Checkbox, VStack, HStack, Text, IconButton, Icon, ScrollView,
    Modal,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useSetRecoilState } from 'recoil';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { TabataTimerScreenNavigationProp } from '../../types/navigationTypes';
import { showFooterState } from '../../atoms/showFooterAtom';
import { TabataEquipmentType, TabataWorkout } from '../../types/workouts';
import { shuffleWorkout } from './shuffleWorkouts';
import { ShuffleScreenRouteProp } from '../../navigation/navigationTypes';

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
    const routeWorkout = route.params?.workout;
    const [includeUpper, setIncludeUpper] = useState<boolean>(true);
    const [includeLower, setIncludeLower] = useState<boolean>(true);
    const [includeAbs, setIncludeAbs] = useState<boolean>(true);
    const [includeCardio, setIncludeCardio] = useState<boolean>(true);
    const [numTabatas, setNumTabatas] = useState<number>(6);
    const [shuffledWorkout, setShuffledWorkout] = useState<TabataWorkout>(routeWorkout);
    const setShowFooter = useSetRecoilState(showFooterState);
    const navigation = useNavigation<TabataTimerScreenNavigationProp>();
    const { authState } = useAuth();
    const userId = authState?.userId;
    const [showEquipmentModal, setShowEquipmentModal] = useState(false);
    const [selectedEquipment, setSelectedEquipment] = useState<TabataEquipmentType[]>([]);
    const [selectedEquipmentTemp, setSelectedEquipmentTemp] = useState<TabataEquipmentType[]>([]);

    // Function to toggle equipment selection
    const toggleEquipment = (equipment: TabataEquipmentType): void => {
        setSelectedEquipmentTemp((prev) => {
            if (prev.includes(equipment)) {
                return prev.filter((item) => item !== equipment);
            }
            return [...prev, equipment];
        });
    };

    const handleEquipmentDone = (): void => {
        setShowEquipmentModal(false);
        setSelectedEquipment(selectedEquipmentTemp);
    };

    const handleEquipmentCancel = (): void => {
        setShowEquipmentModal(false);
        setSelectedEquipmentTemp(selectedEquipment);
    };

    useFocusEffect(
        useCallback(() => {
            setShowFooter(false);

            return () => setShowFooter(true);
        }, [setShowFooter]),
    );

    // Function to determine if a checkbox should be disabled
    const shouldDisableCheckbox = (checkboxValue: boolean): boolean => {
        // Count how many checkboxes are checked
        const checkedCount = [includeUpper, includeLower, includeAbs, includeCardio]
            .filter((val) => val).length;

        // If only one checkbox is checked and it's the current one, disable it
        return checkedCount === 1 && checkboxValue;
    };

    const triggerShuffle = (): void => {
        const workout = shuffleWorkout(
            numTabatas,
            includeUpper,
            includeLower,
            includeAbs,
            includeCardio,
            userId,
        );

        setShuffledWorkout(workout);
    };

    // Call the shuffleWorkout function to generate the workout
    useEffect(() => {
        if (!routeWorkout) {
            triggerShuffle();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Call the shuffleWorkout function to generate the workout
    useEffect(() => {
        triggerShuffle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [numTabatas, includeUpper, includeLower, includeAbs, includeCardio]);

    useFocusEffect(
        React.useCallback(() => {
            if (!route.params?.workout) {
                const workout = shuffleWorkout(
                    numTabatas,
                    includeUpper,
                    includeLower,
                    includeAbs,
                    includeCardio,
                    userId,
                );

                setShuffledWorkout(workout);
            } else {
                setShuffledWorkout(route.params.workout);
            }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [route.params?.workout]),
    );

    const handleStartWorkout = (): void => {
        // Navigate to the WorkoutTimerPage with the shuffledWorkout
        if (shuffledWorkout) {
            navigation.navigate('TabataTimer', { workout: shuffledWorkout });
        }
    };

    const isOnlyOneChecked = [
        includeUpper,
        includeLower,
        includeAbs,
        includeCardio,
    ].filter((val) => val === true).length === 1;

    return (
        <VStack flex={1} px={4} space={4}>
            <HStack alignItems="center" justifyContent="space-between" pt={4}>
                <Button onPress={(): void => navigation.goBack()}>Go Back</Button>
                <IconButton
                    icon={<Icon as={Ionicons} name="shuffle" />}
                    onPress={(): void => triggerShuffle()}
                />
                <Text fontSize="md">Total Time: 45:00</Text>
                <Text fontSize="md">{isOnlyOneChecked.toString()}</Text>
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
                    onPress={(): void => setNumTabatas((prev) => Math.max(prev - 1, 1))}
                />
                <Text mx={2}>
                    {numTabatas}
                    {' '}
                    Tabatas
                </Text>
                <IconButton
                    icon={<Icon as={Ionicons} name="add" />}
                    onPress={(): void => setNumTabatas((prev) => prev + 1)}
                />
            </HStack>
            <HStack alignItems="center" justifyContent="space-between" space={2}>
                <Button flex={1} onPress={(): void => setShowEquipmentModal(true)}>Equipment</Button>
                <Button flex={1} onPress={(): void => console.log('More settings')}>More</Button>
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
            <Modal isOpen={showEquipmentModal} onClose={(): void => setShowEquipmentModal(false)}>
                <Modal.Content maxWidth="400px">
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
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onPress={handleEquipmentDone}>Done</Button>
                        <Button variant="ghost" onPress={handleEquipmentCancel}>Cancel</Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </VStack>
    );
};
