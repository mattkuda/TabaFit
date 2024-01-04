import React, { FC } from 'react';
import { format } from 'date-fns';
import {
    Box, VStack, Heading, Text, Button, HStack, IconButton, Card, Icon,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native';
import { TabataWorkoutWithUserInfo } from '../../types/workouts';
import { TabNavigatorParamList } from '../../types/navigationTypes';

interface WorkoutCardProps {
    workout: TabataWorkoutWithUserInfo;
    isInMyWorkouts: boolean;
    onDelete?: (workout: TabataWorkoutWithUserInfo) => void;
    onEdit?: () => void;
    onSave?: () => void;
    onUnsave?: () => void;
}

export const WorkoutCard: FC<WorkoutCardProps> = ({
    workout, isInMyWorkouts, onDelete, onEdit, onSave, onUnsave,
}) => {
    const navigation = useNavigation<StackNavigationProp<TabNavigatorParamList>>();
    const formattedDate = format(new Date(workout.createdAt), 'MMMM do, yyyy');

    const handleQuickStart = (): void => {
        navigation.navigate('TabataTimerScreen', { workout });
    };

    const handleClickCard = (): void => {
        navigation.navigate('ViewWorkoutScreen', { workoutId: workout._id.toString() });
    };

    return (
        <TouchableOpacity style={{ width: '100%' }} onPress={handleClickCard}>
            <Card>
                <Box bg="lightBlue.100" p="12" rounded="xl">
                    <VStack alignItems="center" space={3}>
                        <Heading>{workout.name}</Heading>
                        <Text>{`Number of tabatas: ${workout.tabatas.length}`}</Text>
                        <Text>{`Created by ${workout.user.username}`}</Text>
                        <Text>{`Created on ${formattedDate}`}</Text>
                        <HStack space={3}>
                            {isInMyWorkouts && (
                                <>
                                    <IconButton
                                        colorScheme="danger"
                                        icon={<Icon as={Ionicons} name="trash-bin" />}
                                        size="sm"
                                        onPress={(): void => onDelete(workout)}
                                    />
                                    {onEdit && (
                                        <IconButton
                                            icon={<Icon as={Ionicons} name="pencil" />}
                                            size="sm"
                                            onPress={onEdit}
                                        />
                                    )}
                                </>
                            )}
                            {!isInMyWorkouts && (
                            <Button onPress={onSave || onUnsave}>
                                {onSave ? 'Save' : 'Unsave'}
                            </Button>
                            )}
                        </HStack>
                        <Button onPress={handleQuickStart}>Quick Start</Button>
                    </VStack>
                </Box>
            </Card>
        </TouchableOpacity>
    );
};
