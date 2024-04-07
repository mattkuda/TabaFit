import React, { FC } from 'react';
import { format } from 'date-fns';
import {
    Box, VStack, Text, HStack, Icon, Avatar, Menu, Pressable, Button,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native';
import { TabataWorkoutWithUserInfo } from '../../types/workouts';
import { TabNavigatorParamList } from '../../types/navigationTypes';
import { getFormattedTimeForTabataWorkout } from '../TabataTimerScreen/util';

interface WorkoutCardProps {
    workout: TabataWorkoutWithUserInfo;
    isInMyWorkouts: boolean;
    onDelete?: (workout: TabataWorkoutWithUserInfo) => void;
    onEdit?: () => void;
    onSave?: () => void;
    onUnsave?: () => void;
}

const MenuTrigger = ({ triggerProps }): JSX.Element => (
    <Pressable accessibilityLabel="More options menu" {...triggerProps}>
        <Icon as={Ionicons} name="ellipsis-vertical-outline" size="md" />
    </Pressable>
);

export const WorkoutCard: FC<WorkoutCardProps> = ({
    workout, isInMyWorkouts, onDelete, onEdit, onSave, onUnsave,
}) => {
    const navigation = useNavigation<StackNavigationProp<TabNavigatorParamList>>();
    const formattedDate = format(new Date(workout.createdAt), 'MMMM do, yyyy');

    const handleQuickStart = (): void => {
        navigation.navigate('TabataTimerScreen', { workout, isInMyWorkouts });
    };

    const handleClickCard = (): void => {
        navigation.navigate('ViewWorkoutScreen', { workoutId: workout._id.toString() });
    };

    return (

        <TouchableOpacity style={{ width: '100%' }} onPress={handleClickCard}>
            <Box
                bg={{
                    linearGradient: {
                        colors: ['blue.600', 'orange.600'],
                        start: [0, 1],
                        end: [1, 0],
                    },
                }}
                gap={2}
                justifyContent="space-between"
                p="4"
                rounded="md"
            >
                <HStack justifyContent="space-between">
                    <Text
                        ellipsizeMode="tail"
                        fontSize="md"
                        numberOfLines={2}
                        style={{
                            fontWeight: 'bold',
                            lineHeight: 16,
                            height: 32,
                        }}
                    >
                        {workout.name}
                    </Text>
                    <Menu
                        shadow={2}
                        // eslint-disable-next-line react/no-unstable-nested-components
                        trigger={(triggerProps): JSX.Element => <MenuTrigger triggerProps={triggerProps} />}
                        w="190"
                    >
                        <Menu.Item>Arial</Menu.Item>
                        <Menu.Item>Nunito Sans</Menu.Item>
                        <Menu.Item>Roboto</Menu.Item>
                        <Menu.Item>Poppins</Menu.Item>
                        <Menu.Item>SF Pro</Menu.Item>
                        <Menu.Item>Helvetica</Menu.Item>
                        <Menu.Item isDisabled>Sofia</Menu.Item>
                        <Menu.Item>Cookie</Menu.Item>
                    </Menu>
                </HStack>
                <Box alignItems="center" flexDirection="row" justifyContent="flex-start">
                    <Avatar size="xs" source={{ uri: workout?.user?.profilePictureUrl }} />
                    <Text style={{ marginLeft: 8 }}>
                        {`${workout?.user?.firstName} ${workout?.user?.lastName}`}
                    </Text>
                </Box>
                <HStack justifyContent="space-between" mt={2}>
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
                <HStack justifyContent="space-between" space={4}>
                    <Button
                        endIcon={(
                            <Icon as={Ionicons} name="play" size="md" />
                            )}
                        flex={1}
                        size="md"
                        onPress={handleQuickStart}
                    >
                        Quick Start
                    </Button>
                    <Button
                        colorScheme="secondary"
                        endIcon={(
                            <Icon as={Ionicons} name="chevron-forward" size="md" />
                        )}
                        flex={1}
                        size="md"
                        variant="outline"
                        onPress={handleClickCard}
                    >
                        Details
                    </Button>
                </HStack>
            </Box>
        </TouchableOpacity>
    );
};
