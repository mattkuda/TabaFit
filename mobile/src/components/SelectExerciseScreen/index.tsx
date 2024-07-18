import React, { useState } from 'react';
import {
    FlatList, Pressable, Text, Input, Icon, HStack, Image,
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
import { GradientVStack } from '../common/GradientVStack';

type SelectExerciseScreenNavigationProp = StackNavigationProp<OldWorkoutsStackParamList, 'SelectExerciseScreen'>;
type OldSelectExerciseScreenRouteProp = RouteProp<OldWorkoutsStackParamList, 'SelectExerciseScreen'>;

const exercises = [
    ...Object.values(lowerBodyExercises),
    ...Object.values(upperBodyExercises),
    ...Object.values(absExercises),
    ...Object.values(cardioExercises)]
    .sort(
        (a, b) => a.name.localeCompare(b.name),
    );

export const SelectExerciseScreen = (): JSX.Element => {
    const navigation = useNavigation<SelectExerciseScreenNavigationProp>();
    const route = useRoute<OldSelectExerciseScreenRouteProp>();

    const handleSelectExercise = (exercise: TabataExercise): void => {
        const { onSelectWorkout } = route.params;

        onSelectWorkout(exercise);
        navigation.goBack();
    };
    const [search, setSearch] = useState<string>('');

    return (
        <GradientVStack
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
                    <Pressable borderColor="gray7" p="4" px="4" onPress={(): void => handleSelectExercise(item)}>
                        <HStack alignItems="center" space="2">
                            {/* <Text fontSize="md" pr="2">{exerciseIconDictionary[item?.types[0]]}</Text> */}
                            <Image
                                alt={`${item?.types[0]} icon`}
                                paddingX="2"
                                source={exerciseIconDictionary[item?.types[0]]}
                                style={{
                                    height: 24, width: 24, tintColor: 'white', paddingHorizontal: 2,
                                }}
                            />
                            <Text flex={1} fontSize="md">{item.name}</Text>
                            {/* TODO: Make these open a modal with more information about the exercise */}
                            <Icon as={Ionicons} color="gray.400" name="information-circle" size="lg" />
                        </HStack>
                    </Pressable>
                )}
            />
        </GradientVStack>
    );
};
