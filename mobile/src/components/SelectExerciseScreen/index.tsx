import React, { useState } from 'react';
import {
    VStack, FlatList, Pressable, Text, Input, Icon, HStack,
} from 'native-base';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import {
    lowerBodyExercises,
    upperBodyExercises,
    absExercises,
    cardioExercises,
} from '../../util/constants';
import { OldWorkoutsStackParamList } from '../../navigation/navigationTypes';
import { TabataExercise } from '../../types/workouts';
import { exerciseIconDictionary } from '../../util/util';

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
        <VStack
            backgroundColor="gray9"
            flex={1}
            space={0}
            width="100%"
        >
            <Input
                fontSize="md"
                InputLeftElement={<Icon as={Ionicons} ml={4} name="search-outline" size="sm" />}
                m="4"
                placeholder="Search for an exercise"
                value={search}
                onChangeText={setSearch}

            />
            <FlatList
                data={exercises.filter((e) => e.name.toLowerCase().includes(search.toLowerCase()))}
                keyExtractor={(item): string => item._id}
                ListEmptyComponent={<Text alignSelf="center" fontSize="md">No exercises found</Text>}
                renderItem={({ item }): JSX.Element => (
                    <Pressable borderColor="gray7" p="2" onPress={(): void => handleSelectExercise(item)}>
                        <HStack>
                            <Text fontSize="md" pr="2">{exerciseIconDictionary[item?.types[0]]}</Text>
                            <Text fontSize="md">{item.name}</Text>
                        </HStack>
                    </Pressable>
                )}
            />
        </VStack>
    );
};
