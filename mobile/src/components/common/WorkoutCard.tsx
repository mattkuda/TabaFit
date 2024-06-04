import React, { FC } from 'react';
import { format } from 'date-fns';
import {
    Box, VStack, Text, HStack, Icon, Menu, Pressable, Button,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native';
import { TabataWorkoutWithUserInfo } from '../../types/workouts';
import { TabNavigatorParamList } from '../../types/navigationTypes';
import { getFormattedTimeForTabataWorkout } from '../TabataTimerScreen/util';
import { ProfilePicture } from '../ProfilePicture';

interface WorkoutCardProps {
    workout: TabataWorkoutWithUserInfo;
    isInMyWorkouts: boolean;
    isTabaFitWorkout?: boolean;
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
    workout, isTabaFitWorkout, isInMyWorkouts, onDelete, onEdit, onSave, onUnsave,
}) => {
    const navigation = useNavigation<StackNavigationProp<TabNavigatorParamList>>();
    const formattedDate = format(new Date(workout.createdAt), 'MMMM do, yyyy');

    const handleQuickStart = (): void => {
        navigation.navigate('TabataTimerScreen', { workout, isInMyWorkouts });
    };

    const handleClickCard = (): void => {
        navigation.navigate('ViewWorkoutScreen', { workoutId: workout._id.toString() });
    };

    const handleClickTabaFitWorkout = (): void => {
        navigation.navigate('ViewWorkoutScreen', { workout });
    };

    return (
        <TouchableOpacity
            style={{
                width: '100%', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5,
            }}
            onPress={isTabaFitWorkout ? handleClickTabaFitWorkout : handleClickCard}
        >
            <Box
                bg={{
                    linearGradient: {
                        colors: ['gray.500', 'gray.600'],
                        start: [0, 1],
                        end: [1, 0],
                    },
                }}
                borderColor="flame"
                justifyContent="space-between"
                my={2}
                p="4"
                rounded="md"
            >
                <VStack space={0}>
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
                        {/* <Menu
                            shadow={2}
                            // eslint-disable-next-line react/no-unstable-nested-components
                            trigger={(triggerProps): JSX.Element => <MenuTrigger triggerProps={triggerProps} />}
                            w="190"
                        >
                            <Menu.Item>Arial</Menu.Item>
                            <Menu.Item>Nunito Sans</Menu.Item>
                            <Menu.Item>Roboto</Menu.Item>
                            <Menu.Item>Poppins</Menu.Item>
                            <Menu.Item>SF Pasdfro</Menu.Item>
                            <Menu.Item>Helvetica</Menu.Item>
                            <Menu.Item isDisabled>Sofia</Menu.Item>
                            <Menu.Item>Cookie</Menu.Item>
                        </Menu> */}
                    </HStack>
                    <Box alignItems="center" flexDirection="row" justifyContent="space-between">
                        <Box alignItems="center" flexDirection="row">
                            <ProfilePicture
                                borderWidth={1}
                                size="xs"
                                user={workout?.user}
                            />
                            <Text style={{ marginLeft: 8 }}>
                                {`${workout?.user?.firstName} ${workout?.user?.lastName}`}
                            </Text>
                        </Box>
                        {formattedDate}
                    </Box>
                </VStack>
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
                <HStack justifyContent="space-between" pt={4} space={4}>
                    <Button
                        colorScheme="secondary"
                        endIcon={(
                            <Icon
                                as={Ionicons}
                                color="white"
                                name="information-circle"
                            />
                        )}
                        size="md"
                        variant="ghost"
                        onPress={handleClickCard}
                    >
                        Details
                    </Button>
                    <TouchableOpacity onPress={handleQuickStart}>
                        {/* Build Workout Row */}
                        <Box
                            alignItems="center"
                            bg={{
                                linearGradient: {
                                    colors: ['flame.500', 'cherry.500'],
                                    start: [0, 1],
                                    end: [1, 0],
                                },
                            }}
                            borderRadius="full"
                            flexDirection="row"
                            justifyContent="center"
                            p="3"
                            width={150}
                            px={4}
                            // @ts-expect-error
                            gap={2}
                        >
                            <Text>
                                Quick Start
                            </Text>
                            <Icon as={Ionicons} name="flash" />
                        </Box>
                    </TouchableOpacity>
                </HStack>
            </Box>
        </TouchableOpacity>
    );
};
