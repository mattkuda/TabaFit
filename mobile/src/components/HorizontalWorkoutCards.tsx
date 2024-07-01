import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import {
    Box, HStack, Icon, Skeleton, Text, VStack,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { TabataWorkoutWithUserInfo } from '../types/workouts';
import { getFormattedTimeForTabataWorkout } from './TabataTimerScreen/util';
import { PictureWithName } from './PictureWithName';
import { getWorkoutDifficultyGradient } from '../util/util';

interface SlideWorkoutCardProps {
    workout: TabataWorkoutWithUserInfo;
    onPress: () => void;
}

const SlideWorkoutCard: React.FC<SlideWorkoutCardProps> = ({ workout, onPress }): JSX.Element => (
    <TouchableOpacity style={{ width: 200, marginHorizontal: 8 }} onPress={onPress}>
        <Box
            // bg={{
            //     linearGradient: {
            //         colors: ['workoutDisplayGray', getWorkoutDifficultyGradient(workout.tabatas.length)[0]],
            //         start: [0.5, 0.6],
            //         end: [1.35, 1.05],
            //     },
            // }}
            backgroundColor="workoutDisplayGray"
            borderColor={getWorkoutDifficultyGradient(workout.tabatas.length)[0]}
            borderRadius="md"
            borderWidth={1}
            height={150}
            justifyContent="space-between"
            p="4"
            style={{
                width: '100%',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
            }}
        >
            <Text
                ellipsizeMode="tail"
                fontSize="md"
                numberOfLines={2}
                style={{
                    fontWeight: 'bold',
                    marginBottom: 4,
                    lineHeight: 16,
                    height: 32,
                }}
            >
                {workout.name}
            </Text>
            <HStack flex={1} justifyContent="space-between" mt={2}>
                <VStack alignItems="center" flex={1} space={0}>
                    <Icon as={Ionicons} name="body-outline" size="md" />
                    <Text fontSize="sm">
                        {`${workout.tabatas.length} ${workout.tabatas.length === 1 ? 'Tabata' : 'Tabatas'}`}
                    </Text>
                </VStack>
                <VStack alignItems="center" flex={1} space={0}>
                    <Icon as={Ionicons} name="time-outline" size="md" />
                    <Text fontSize="sm">{getFormattedTimeForTabataWorkout(workout)}</Text>
                </VStack>
            </HStack>
            <Box alignItems="center" flexDirection="row" justifyContent="flex-end">
                <PictureWithName user={workout.user} />
            </Box>
        </Box>
    </TouchableOpacity>
);

const NoResultsCard: React.FC = (): JSX.Element => (
    <Box
        alignItems="center"
        bg="transparent"
        borderRadius="lg"
        height={150}
        justifyContent="center"
        p="4"
        style={{
            marginHorizontal: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        }}
        w="100%"
    >
        <VStack alignItems="center">
            <Icon as={Ionicons} color="gray.400" name="alert-circle-outline" size="lg" />
            <Text color="gray.400" fontSize="md" mt="2">
                Hmm, nothing here yet
            </Text>
        </VStack>
    </Box>
);

interface HorizontalWorkoutCardsProps {
    workouts: TabataWorkoutWithUserInfo[];
    onPressWorkout: (workout: TabataWorkoutWithUserInfo) => void;
    isLoading: boolean;
}

export const HorizontalWorkoutCards: React.FC<HorizontalWorkoutCardsProps> = ({
    workouts,
    onPressWorkout,
    isLoading,
}): JSX.Element => {
    if (isLoading) {
        return (
            <ScrollView
                horizontal
                contentContainerStyle={{ paddingLeft: 0, paddingRight: 8 }}
                showsHorizontalScrollIndicator={false}
            >
                <Skeleton endColor="gray.400" h="150" rounded="md" startColor="gray.200" w="200" />
                <Skeleton endColor="gray.400" h="150" ml="8" rounded="md" startColor="gray.200" w="200" />
            </ScrollView>
        );
    }

    if (workouts.length === 0) {
        return (
            <Box justifyContent="center" mx={4}>
                <NoResultsCard />
            </Box>
        );
    }

    return (
        <ScrollView
            horizontal
            contentContainerStyle={{ paddingLeft: 0, paddingRight: 8 }}
            showsHorizontalScrollIndicator={false}
        >
            {workouts.map((workout, index) => (
                <SlideWorkoutCard
                    key={workout._id.toString() + index.toString()}
                    workout={workout}
                    onPress={(): void => onPressWorkout(workout)}
                />
            ))}
        </ScrollView>
    );
};
