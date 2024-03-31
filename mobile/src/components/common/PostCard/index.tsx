import React from 'react';
import {
    HStack, VStack, Text, Avatar, Icon, Box,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import { HomeScreenNavigationProp } from '../../../types/navigationTypes';
import { PostModel } from '../../../types/posts';
import { formatName } from '../../../util/util';
import { getFormattedTimeForTabataWorkout } from '../../TabataTimerScreen/util';
import { LikeCommentButtons } from '../LikeCommentButtons';

type PostCardProps = {
    post: PostModel;
};

const arePropsEqual = (
    prevProps: PostCardProps,
    nextProps: PostCardProps,
): boolean => prevProps.post._id === nextProps.post._id;

export const PostCard: React.FC<PostCardProps> = React.memo(({ post }) => {
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const formattedTotalWorkoutTime = getFormattedTimeForTabataWorkout(post.workout);

    const handlePress = (): void => {
        navigation.navigate('PostScreen', { postId: post._id.toString() });
    };

    const handlePressUser = (): void => {
        navigation.navigate('Profile', { userId: post.userId });
    };

    // TODO: Auto focus input when naving via comment click?

    const handleWorkoutNamePress = (): void => {
        if (post.workout && post.workout._id) {
            navigation.navigate('ViewWorkoutScreen', { workout: post.workout });
        }
    };

    const userFound = post?.user?.username;

    return (
        <TouchableOpacity
            style={{
                width: '100%', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5,
            }}
            onPress={handlePress}
        >
            <VStack
                backgroundColor="gray9"
                borderColor="gray7"
                borderRadius="md"
                borderWidth={1}
                mt={4}
                p={4}
                space={2}
                width="100%"
            >
                <HStack justifyContent="space-between" space={2}>
                    <Avatar size="48px" source={{ uri: post.user.profilePictureUrl }} />
                    <VStack flex={1}>
                        <Text fontSize="sm" onPress={userFound && handlePressUser}>
                            {userFound ? `${formatName(post.user.firstName, post.user.lastName)} @${post.user.username}` : 'Unknown User'}
                        </Text>
                        <Text color="white" fontSize="xs">
                            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                        </Text>
                    </VStack>
                </HStack>
                <Text bold fontSize="md" mt={2}>
                    {post.title}
                </Text>
                {post.description?.length > 0 && (
                    <Text mt={2}>
                        {post.description}
                    </Text>
                )}
                <TouchableOpacity onPress={handleWorkoutNamePress}>
                    <Box
                        backgroundColor="gray7"
                        borderRadius="md"
                        mt={2}
                        p={2}
                    >
                        <HStack
                            backgroundColor="gray7"
                            justifyContent="space-between"
                            pl={2}
                            space={4}
                        >
                            <HStack
                                alignItems="center"
                                backgroundColor="gray7"
                                space={2}
                            >
                                <Icon as={Ionicons} name="barbell-outline" size="sm" />
                                <Text bold fontSize="md" onPress={handleWorkoutNamePress}>
                                    {post.workout.name}
                                </Text>
                            </HStack>
                        </HStack>
                        <HStack justifyContent="space-between" mt={2}>
                            <VStack alignItems="center" flex={1} space={0}>
                                <Icon as={Ionicons} name="body-outline" size="sm" />
                                <Text fontSize="sm">
                                    {post.workout.numberOfTabatas}
                                    {' '}
                                    Tabatas
                                </Text>
                            </VStack>
                            <VStack alignItems="center" flex={1} space={0}>
                                <Icon as={Ionicons} name="time-outline" size="sm" />
                                <Text fontSize="sm">{formattedTotalWorkoutTime}</Text>
                            </VStack>
                            <VStack alignItems="center" flex={1} space={0}>
                                <Icon as={Ionicons} name="flame-outline" size="sm" />
                                <Text fontSize="sm">123 Cals</Text>
                            </VStack>
                        </HStack>
                    </Box>
                </TouchableOpacity>
                <LikeCommentButtons post={post} />
            </VStack>
        </TouchableOpacity>
    );
}, arePropsEqual);
