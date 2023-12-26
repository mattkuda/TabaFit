import React, { useState } from 'react';
import {
    VStack, FlatList, Pressable, Text, Input,
} from 'native-base';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
    lowerBodyExercises,
    upperBodyExercises,
    absExercises,
    cardioExercises,
} from '../../util/constants';
import { OldWorkoutsStackParamList } from '../../navigation/navigationTypes';
import { TabataExercise } from '../../types/workouts';

type SelectExerciseScreenNavigationProp = StackNavigationProp<OldWorkoutsStackParamList, 'SelectExerciseScreen'>;
type OldSelectExerciseScreenRouteProp = RouteProp<OldWorkoutsStackParamList, 'SelectExerciseScreen'>;

export const SelectExerciseScreen = (): JSX.Element => {
    const exercises = [...lowerBodyExercises, ...upperBodyExercises, ...absExercises, ...cardioExercises].sort(
        (a, b) => a.name.localeCompare(b.name),
    );
    const navigation = useNavigation<SelectExerciseScreenNavigationProp>();
    const route = useRoute<OldSelectExerciseScreenRouteProp>();

    const handleSelectExercise = (exercise: TabataExercise): void => {
        const { onSelectWorkout } = route.params;

        onSelectWorkout(exercise);
        navigation.goBack();
    };
    const [search, setSearch] = useState<string>('');

    return (
        <VStack>
            <Input
                placeholder="Enter workout name"
                value={search}
                onChangeText={setSearch}
            />
            <FlatList
                data={exercises.filter((e) => e.name.startsWith(search))}
                keyExtractor={(item): string => item._id}
                renderItem={({ item }): JSX.Element => (
                    <Pressable onPress={(): void => handleSelectExercise(item)}>
                        <Text>{item.name}</Text>
                    </Pressable>
                )}
            />
        </VStack>
    );
};
