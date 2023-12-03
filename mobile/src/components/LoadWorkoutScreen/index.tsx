import React, { FC } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
    VStack, Heading, Text, Button, Card, Box, HStack,
} from 'native-base';
import { StackNavigationProp } from '@react-navigation/stack';
import { format } from 'date-fns';
import { TabataWorkout } from '../../types/workouts';
import { TabNavigatorParamList } from '../../types/navigationTypes';
import { useQueryMySavedWorkouts } from '../../hooks/useQueryMySavedWorkouts';

type LoadWorkoutScreenNavigationProp = StackNavigationProp<TabNavigatorParamList, 'LoadWorkoutScreen'>;

interface WorkoutCardProps {
    workout: TabataWorkout;
    navigation: LoadWorkoutScreenNavigationProp;
}

const WorkoutCard: FC<WorkoutCardProps> = ({ workout, navigation }) => {
    const formattedDate = format(new Date(workout.createdAt), 'MMMM do, yyyy, HH:mm:ss.SSS');

    const handleQuickStart = (): void => {
        navigation.navigate('TabataTimer', { workout });
    };

    const handleCustomize = (): void => {
        console.log('TODO: Go to shuffle with preloaded stuff');
        console.log('and add the typs (upper vs lower) into Tabata Workout Type');
        navigation.navigate('ShuffleScreen', { workout });
    };

    return (
        <Card>
            <VStack alignItems="center" space={3}>
                <Box>
                    <Heading>{workout.name}</Heading>
                    <Text>{`Number of tabatas: ${workout.tabatas.length}`}</Text>
                    <Text>{`Created on ${formattedDate}`}</Text>
                </Box>

                <HStack space={3}>
                    <Button onPress={handleQuickStart}>Quick Start</Button>
                    <Button onPress={handleCustomize}>Customize</Button>
                </HStack>
            </VStack>
        </Card>
    );
};

export const LoadWorkoutScreen: FC = () => {
    const navigation = useNavigation<LoadWorkoutScreenNavigationProp>();
    const { data } = useQueryMySavedWorkouts();

    return (
        <VStack>
            <Heading>My Saved Workouts:</Heading>
            {data?.map((workout) => (
                <WorkoutCard key={workout._id} navigation={navigation} workout={workout} />
            ))}
        </VStack>
    );
};
