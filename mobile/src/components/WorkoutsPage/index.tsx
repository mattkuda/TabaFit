import React, { FC } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
    VStack, Heading, Text, Button, Card, Box, HStack,
} from 'native-base';
import { StackNavigationProp } from '@react-navigation/stack';
import { useQueryWorkouts } from '../../hooks/useQueryWorkouts';
import { TabataWorkout } from '../../types/workouts';
import { TabNavigatorParamList } from '../../types/navigationTypes';

type WorkoutsPageNavigationProp = StackNavigationProp<TabNavigatorParamList, 'WorkoutsPage'>;

interface WorkoutCardProps {
    workout: TabataWorkout;
    navigation: WorkoutsPageNavigationProp;
}

const WorkoutCard: FC<WorkoutCardProps> = ({ workout, navigation }) => {
    const handleQuickStart = (): void => {
        navigation.navigate('TabataTimer', { workout });
    };

    const handleCustomize = (): void => {
        console.log('TODO: Go to shuffle with preloaded stuff');
        console.log('and add the typs (upper vs lower) into Tabata Workout Type');
    };

    return (
        <Card>
            <VStack alignItems="center" space={3}>
                <Box>
                    <Heading>{workout.name}</Heading>
                    <Text>{`Created at: ${workout.createdAt}`}</Text>
                    <Text>{`Number of tabatas: ${workout.tabatas.length}`}</Text>
                </Box>

                <HStack space={3}>
                    <Button onPress={handleQuickStart}>Quick Start</Button>
                    <Button onPress={handleCustomize}>Customize</Button>
                </HStack>
            </VStack>
        </Card>
    );
};

export const WorkoutsPage: FC = () => {
    const navigation = useNavigation<WorkoutsPageNavigationProp>();
    const { data } = useQueryWorkouts();

    return (
        <VStack>
            <Heading>Workouts:</Heading>
            {data?.map((workout) => (
                <WorkoutCard key={workout._id} navigation={navigation} workout={workout} />
            ))}
        </VStack>
    );
};
