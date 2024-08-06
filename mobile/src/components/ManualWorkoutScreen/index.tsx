/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
    Text, Button, Input, TextArea,
    HStack,
    Icon,
    Select,
    Box,
} from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from 'react-query';
import { Ionicons } from '@expo/vector-icons';
import { ShareWorkoutScreenNavigationProp } from '../../types/navigationTypes';
import { useAuth } from '../../context/AuthContext';
import { useMutateShareWorkout } from '../../mutations/useMutateSharePost';
import { GradientVStack } from '../common/GradientVStack';
import { getTimeOfDay } from '../../util/util';

export const ManualWorkoutScreen = (): JSX.Element => {
    const [workoutTitle, setWorkoutTitle] = useState(`${getTimeOfDay(new Date())} Tabata`);
    const [workoutDescription, setWorkoutDescription] = useState('');
    const [numberOfTabatas, setNumberOfTabatas] = useState(1); // Added state for number of tabatas
    const shareWorkoutMutation = useMutateShareWorkout();
    const { authState } = useAuth();
    const userId = authState?.userId;
    const navigation = useNavigation<ShareWorkoutScreenNavigationProp>();
    const queryClient = useQueryClient();

    const handleReturnHome = (): void => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'WorkoutsScreen' }],
        });
        navigation.navigate('HomePage');
    };

    const handleShareWorkout = (): void => {
        shareWorkoutMutation.mutate(
            {
                userId,
                title: workoutTitle,
                description: workoutDescription,
                manualTabatas: numberOfTabatas,
                workout: undefined,
            },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries('following-posts');
                    handleReturnHome();
                },
            },
        );
    };

    useEffect(() => {
        navigation.setOptions({
            headerRight: (): JSX.Element => (
                <Button
                    rightIcon={<Icon as={Ionicons} color="flame.500" name="add" size="lg" />}
                    size="lg"
                    variant="ghost"
                    onPress={handleShareWorkout}
                >
                    Share
                </Button>
            ),
        });
    }, [handleShareWorkout, navigation]);

    const handleDurationChange = (itemValue: number): void => {
        setNumberOfTabatas(itemValue);
    };

    return (
        <GradientVStack flex={1} p={4} space={4}>
            <Input
                backgroundColor="gray.900"
                fontSize="md"
                placeholder="Enter Post Name"
                value={workoutTitle}
                onChangeText={setWorkoutTitle}
            />

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
                        leftElement={<Text fontSize="xl">{`${numberOfTabatas.toString()} ${numberOfTabatas > 1 ? 'Tabatas' : 'Tabata'}`}</Text>}
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
            <TextArea
                autoCompleteType={undefined}
                backgroundColor="gray.900"
                fontSize="md"
                h={40}
                placeholder="Describe your workout"
                value={workoutDescription}
                onChangeText={setWorkoutDescription}
            />
        </GradientVStack>
    );
};
