import { Ionicons } from '@expo/vector-icons';
import {
    VStack, HStack, IconButton, Icon, Pressable, Text, Image,
} from 'native-base';
import { NestableDraggableFlatList, ScaleDecorator } from 'react-native-draggable-flatlist';
import { TabataCircuit, TabataExercise } from '../../types/workouts';
import { exerciseIconDictionary } from '../../util/util';

type TabataItemProps = {
    tabataCircuit: TabataCircuit;
    circuitIndex: number;
    changeExercise: (tabataIndex: number, exerciseIndex: number) => void;
    moveTabataUp: (index: number) => void;
    moveTabataDown: (index: number) => void;
    removeTabata?: (index: number) => void;
    updateExercisesOrder: (tabataIndex: number, newExercisesOrder: TabataExercise[]) => void;
};

export const TabataItem = ({
    tabataCircuit,
    circuitIndex,
    changeExercise,
    moveTabataUp,
    moveTabataDown,
    removeTabata,
    updateExercisesOrder,
}: TabataItemProps): JSX.Element => (
    <VStack
        // bg={{
        //     linearGradient: {
        //         colors: ['gray.500', 'gray.600'],
        //         start: [0, 1],
        //         end: [1, 0],
        //     },
        // }}
        bg="workoutDisplayGray"
        borderRadius="md"
        mb={2}
        mt={2}
    >
        <HStack alignItems="center" justifyContent="space-between">
            <IconButton
                icon={<Icon as={Ionicons} color="white" name="arrow-up" size="6" />}
                onPress={(): void => moveTabataUp(circuitIndex)}
            />
            <Text bold fontSize="lg">
                Tabata
                {' '}
                {circuitIndex + 1}
            </Text>
            <IconButton
                icon={<Icon as={Ionicons} color="white" name="arrow-down" size="6" />}
                onPress={(): void => moveTabataDown(circuitIndex)}
            />
            <IconButton
                disabled={!removeTabata}
                icon={<Icon as={Ionicons} color="gray.400" name="remove-circle-outline" size="6" />}
                opacity={removeTabata ? 1 : 0}
                onPress={(): void => removeTabata(circuitIndex)}
            />
        </HStack>
        <NestableDraggableFlatList<TabataExercise>
            data={tabataCircuit}
            keyExtractor={(item, index): string => `exercise-${circuitIndex}-${index}`}
            renderItem={({ item, drag, getIndex }): JSX.Element => {
                const index = getIndex();

                return (
                    <ScaleDecorator>
                        <HStack alignItems="center" justifyContent="space-between">
                            <Pressable flex={1} p={2} onPress={(): void => changeExercise(circuitIndex, index)}>
                                <HStack pl={2} space="2">
                                    {item ? (
                                        <>
                                            <Image
                                                alt={`${item?.types[0]} icon`}
                                                key={item?.name}
                                                paddingX="2"
                                                source={exerciseIconDictionary[item?.types[0]]}
                                                style={{
                                                    height: 24, width: 24, tintColor: 'white', paddingHorizontal: 2,
                                                }}
                                            />
                                            <Text fontSize="md">
                                                {item?.name}
                                            </Text>
                                        </>
                                    ) : <Text italic color="gray.200" fontSize="md">Select an exercise</Text>}
                                </HStack>
                            </Pressable>
                            <IconButton icon={<Icon as={Ionicons} color="white" name="menu" />} onLongPress={drag} />
                        </HStack>
                    </ScaleDecorator>
                );
            }}
            onDragEnd={({ data }): void => updateExercisesOrder(circuitIndex, data)}
        />
    </VStack>
);
