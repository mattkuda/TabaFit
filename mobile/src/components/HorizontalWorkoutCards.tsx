import React from 'react';
import { ScrollView, TouchableOpacity, Text } from 'react-native';
import { Avatar, Box, Skeleton } from 'native-base';
import { TabataWorkoutWithUserInfo } from '../types/workouts';
import { useAuth } from '../context/AuthContext';
import { formatTabatasCount } from '../util/util';

interface SlideWorkoutCardProps {
    workout: TabataWorkoutWithUserInfo;
    onPress: () => void;
}

const SlideWorkoutCard: React.FC<SlideWorkoutCardProps> = ({ workout, onPress }): JSX.Element => {
    const { authState: { userId } } = useAuth();

    return (
        <TouchableOpacity style={{ width: 150, marginHorizontal: 8 }} onPress={onPress}>
            <Box bg="lightBlue.100" height={150} justifyContent="space-between" p="4" rounded="md">
                <Text
                    ellipsizeMode="tail"
                    numberOfLines={1}
                    style={{ fontWeight: 'bold', marginBottom: 4 }}
                >
                    {workout.name}
                </Text>
                <Text>{formatTabatasCount(workout.numberOfTabatas)}</Text>
                <Box alignItems="center" flexDirection="row" justifyContent="flex-end">
                    {userId !== workout?.userId && (
                        <>
                            <Avatar size="sm" source={{ uri: workout?.user?.profilePictureUrl }} />
                            <Text style={{ marginLeft: 8 }}>
                                {`${workout?.user?.firstName} ${workout?.user?.lastName}`}
                            </Text>
                        </>
                    )}
                </Box>
            </Box>
        </TouchableOpacity>
    );
};

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
                <Skeleton endColor="coolGray.400" h="150" rounded="md" startColor="coolGray.200" w="150" />
                <Skeleton endColor="coolGray.400" h="150" ml="8" rounded="md" startColor="coolGray.200" w="150" />
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
