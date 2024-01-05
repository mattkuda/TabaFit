import React, { useState } from 'react';
import {
    HStack, VStack, Text, Avatar, Icon, IconButton,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { HomeScreenNavigationProp } from '../../../types/navigationTypes';
import { PostModel } from '../../../types/posts';
import { useMutateLike, useMutateUnlike } from '../../../mutations/useMutateLike';

type PostCardProps = {
    post: PostModel;
};

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
    const { authState } = useAuth();
    const userId = authState?.userId;
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const likeMutation = useMutateLike();
    const unlikeMutation = useMutateUnlike();

    const [liked, setLiked] = useState(post.likes.map((id) => id.toString()).includes(userId));
    const [likeCount, setLikeCount] = useState(post.likes.length);

    const handleLikePress = (): void => {
        if (liked) {
            unlikeMutation.mutate({ postId: post._id.toString(), userId }, {
                onSuccess: () => {
                    setLiked(false);
                    setLikeCount((prev) => prev - 1);
                },
            });
        } else {
            likeMutation.mutate({ postId: post._id.toString(), userId }, {
                onSuccess: () => {
                    setLiked(true);
                    setLikeCount((prev) => prev + 1);
                },
            });
        }
    };

    const handlePress = (): void => {
        navigation.navigate('PostScreen', { postId: post._id });
    };

    const handlePressUser = (): void => {
        navigation.navigate('Profile', { userId: post.userId });
    };

    const handleCommentPress = (): void => {
        console.log('Comment button pressed');
        // TODO: Auto focus input when naving with prop?
        handlePress();
    };

    const handleWorkoutNamePress = (): void => {
        if (post.workout && post.workout._id) {
            navigation.navigate('ViewWorkoutScreen', { workout: post.workout });
            // navigation.navigate('WorkoutsStack', { screen: 'EditWorkoutScreen', params: { workout: post.workout } });
        }
    };

    return (
        <TouchableOpacity style={{ width: '100%' }} onPress={handlePress}>
            <VStack borderColor="coolGray.200" borderRadius="md" borderWidth={1} mt={4} p={4} space={2} width="100%">
                <HStack justifyContent="space-between" space={2}>
                    <Avatar size="48px" source={{ uri: post.user.profilePictureUrl }} />
                    <VStack flex={1}>
                        <Text fontSize="sm" onPress={handlePressUser}>
                            {`${post.user.firstName} ${post.user.lastName} @${post.user.username}`}
                        </Text>
                        <Text color="coolGray.600" fontSize="xs">
                            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                        </Text>
                    </VStack>
                </HStack>
                <Text bold fontSize="md" mt={2}>
                    {post.title}
                </Text>
                <Text mt={2} onPress={handleWorkoutNamePress}>
                    {post.workout.name}
                    {' '}
                    (
                    {post.workout.numberOfTabatas}
                    {' '}
                    tabatas
                    )
                </Text>
                {post.description?.length > 0 && (
                    <Text mt={2}>
                        {post.description}
                    </Text>
                )}
                <HStack justifyContent="space-between" mt={2} space={4}>
                    <IconButton
                        borderRadius="full"
                        icon={(
                            <Icon
                                as={Ionicons}
                                color={liked ? 'red.500' : 'coolGray.500'}
                                name={liked ? 'heart' : 'heart-outline'}
                                size="sm"
                            />
                        )}
                        onPress={handleLikePress}
                    />
                    <IconButton
                        borderRadius="full"
                        icon={<Icon as={Ionicons} name="chatbubble-outline" size="sm" />}
                        onPress={handleCommentPress}
                    />
                </HStack>
                <HStack color="coolGray.500" fontSize="xs" justifyContent="space-between" mt={2}>
                    <Text>
                        {likeCount}
                        {' '}
                        Likes
                    </Text>
                    <Text>
                        {post.comments.length}
                        {' '}
                        Comments
                    </Text>
                </HStack>
            </VStack>
        </TouchableOpacity>
    );
};
