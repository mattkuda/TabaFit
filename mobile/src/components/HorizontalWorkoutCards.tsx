import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import {
    Box, HStack, Icon, Skeleton, Text, VStack,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { TabataWorkoutWithUserInfo } from '../types/workouts';
import { getFormattedTimeForTabataWorkout } from './TabataTimerScreen/util';
import { ProfilePicture } from './ProfilePicture';

interface SlideWorkoutCardProps {
    workout: TabataWorkoutWithUserInfo;
    onPress: () => void;
}

const SlideWorkoutCard: React.FC<SlideWorkoutCardProps> = ({ workout, onPress }): JSX.Element => (
    <TouchableOpacity style={{ width: 200, marginHorizontal: 8 }} onPress={onPress}>
        <Box
            bg={{
                linearGradient: {
                    colors: ['gray.500', 'gray.600'],
                    start: [0, 1],
                    end: [1, 0],
                },
            }}
            borderColor="flame"
            height={150}
            justifyContent="space-between"
            p="4"
            rounded="md"
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
                        {`${workout.numberOfTabatas} ${workout.numberOfTabatas === 1 ? 'Tabata' : 'Tabatas'}`}
                    </Text>
                </VStack>
                <VStack alignItems="center" flex={1} space={0}>
                    <Icon as={Ionicons} name="time-outline" size="md" />
                    <Text fontSize="sm">{getFormattedTimeForTabataWorkout(workout)}</Text>
                </VStack>
            </HStack>
            <Box alignItems="center" flexDirection="row" justifyContent="flex-end">
                <ProfilePicture
                    size="xs"
                    user={workout?.user}
                />
                <Text style={{ marginLeft: 8 }}>
                    {`${workout?.user?.firstName} ${workout?.user?.lastName}`}
                </Text>
            </Box>
        </Box>
    </TouchableOpacity>
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

    return (
        <ScrollView
            horizontal
            contentContainerStyle={{ paddingLeft: 0, paddingRight: 8 }}
            showsHorizontalScrollIndicator={false}
        >
            {workouts.map((workout) => (
                <SlideWorkoutCard
                    key={workout._id.toString()}
                    workout={workout}
                    onPress={(): void => onPressWorkout(workout)}
                />
            ))}
        </ScrollView>
    );
};
