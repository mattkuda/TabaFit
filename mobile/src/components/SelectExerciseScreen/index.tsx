import React, { useMemo, useState } from 'react';
import {
    FlatList, Pressable, Text, Input, Icon, HStack, Image, Modal,
    Box,
} from 'native-base';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import {
    exerciseDict,
} from '../../util/constants';
import { OldWorkoutsStackParamList } from '../../navigation/navigationTypes';
import { TabataExercise } from '../../types/workouts';
import { exerciseIconDictionary } from '../../util/util';
import { GradientVStack } from '../common/GradientVStack';
import { videoAssets } from '../../utils/videoAssets';

type SelectExerciseScreenNavigationProp = StackNavigationProp<OldWorkoutsStackParamList, 'SelectExerciseScreen'>;
type OldSelectExerciseScreenRouteProp = RouteProp<OldWorkoutsStackParamList, 'SelectExerciseScreen'>;

const ExerciseInfoModal: React.FC<{
    exercise: TabataExercise | null, isOpen: boolean, onClose: () => void
}> = ({ exercise, isOpen, onClose }) => (
    <Modal
        borderColor="gray.600"
        isOpen={isOpen}
        onClose={onClose}
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
                gap={4}
                px={8}
            >
                <Box
                    flexDirection="row"
                    justifyContent="center"
                    width="100%"
                >
                    <Text bold fontSize="xl">
                        {exercise?.name}
                    </Text>
                </Box>
                {exercise && videoAssets[exercise._id] && (
                    <Video
                        isLooping
                        isMuted
                        shouldPlay
                        resizeMode={ResizeMode.CONTAIN}
                        source={videoAssets[exercise._id]}
                        style={{ width: '100%', height: 200 }}
                    />
                )}
                <Text>
                    {exercise?.description}
                </Text>
                <Text>
                    Type:
                    {' '}
                    {exercise?.types.join(', ')}
                </Text>
                <Text>
                    Difficulty:
                    {' '}
                    {exercise?.difficulty}
                </Text>
                <Text>
                    Equipment:
                    {' '}
                    {exercise?.equipment.length > 0 ? exercise?.equipment.join(', ') : 'None'}
                </Text>
            </Modal.Body>
        </Modal.Content>
    </Modal>
);

const ExerciseItem: React.FC<{
    item: TabataExercise, onSelect: (exercise: TabataExercise) => void,
    onInfo: (exercise: TabataExercise) => void
}> = ({ item, onSelect, onInfo }) => (
    <Pressable borderColor="gray7" p="4" px="4" onPress={(): void => onSelect(item)}>
        <HStack alignItems="center" space="2">
            <Image
                alt={`${item?.types[0]} icon`}
                paddingX="2"
                source={exerciseIconDictionary[item?.types[0]]}
                style={{
                    height: 24, width: 24, tintColor: 'white', paddingHorizontal: 2,
                }}
            />
            <Text flex={1} fontSize="md">{item.name}</Text>
            <Icon
                as={Ionicons}
                color="gray.400"
                name="information-circle"
                size="lg"
                onPress={(): void => onInfo(item)}
            />
        </HStack>
    </Pressable>
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
    const [selectedExercise, setSelectedExercise] = useState<TabataExercise | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const sortedExercises = useMemo(
        () => Object.values(exerciseDict).sort((a, b) => a.name.localeCompare(b.name)),
        [],
    );

    const handleInfo = (exercise: TabataExercise): void => {
        setSelectedExercise(exercise);
        setIsModalOpen(true);
    };

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
                returnKeyType="done"
                value={search}
                onChangeText={setSearch}
            />
            <FlatList
                data={sortedExercises.filter((e) => e.name.toLowerCase().includes(search.toLowerCase()))}
                keyExtractor={(item): string => item._id}
                ListEmptyComponent={<Text alignSelf="center" fontSize="md">No exercises found</Text>}
                renderItem={({ item }): JSX.Element => (
                    <ExerciseItem item={item} onInfo={handleInfo} onSelect={handleSelectExercise} />
                )}
            />
            <ExerciseInfoModal
                exercise={selectedExercise}
                isOpen={isModalOpen}
                onClose={(): void => setIsModalOpen(false)}
            />
        </GradientVStack>
    );
};
