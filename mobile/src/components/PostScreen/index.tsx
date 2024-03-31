import React, { useRef, useState } from 'react';
import {
    ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
    VStack, HStack, Avatar, Text, Input,
} from 'native-base';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import { useMutateAddComment, useMutateDeleteComment } from '../../mutations/commentMutations';
import { PostScreenRouteProp } from '../../navigation/navigationTypes';
import { useQueryPost } from '../../hooks/useQueryPost';
import { PostScreenNavigationProp } from '../../types/navigationTypes';
import { formatName, formatTabatasCount } from '../../util/util';
import { CommentCard } from './CommentCard';
import { getFormattedTimeForTabataWorkout } from '../TabataTimerScreen/util';
import { LikeCommentButtons } from '../common/LikeCommentButtons';

export const PostScreen = (): JSX.Element => {
    const route = useRoute<PostScreenRouteProp>();
    const { postId } = route.params;
    const {
        data: post, isLoading, isError, refetch,
    } = useQueryPost(postId);
    const addCommentMutation = useMutateAddComment();
    const deleteCommentMutation = useMutateDeleteComment();
    const [commentBody, setCommentBody] = useState('');
    const { authState } = useAuth();
    const userId = authState?.userId;
    const navigation = useNavigation<PostScreenNavigationProp>();
    const formattedTotalWorkoutTime = post?.workout ? getFormattedTimeForTabataWorkout(post.workout) : '0';
    const commentInputRef = useRef<HTMLInputElement>(null);

    const handleAddComment = (): void => {
        addCommentMutation.mutate({ postId, userId, body: commentBody }, {
            onSuccess: () => {
                refetch();
            },
        });
        setCommentBody('');
    };

    const handleDeleteComment = (commentId: string): void => {
        deleteCommentMutation.mutate({ postId, commentId }, {
            onSuccess: () => {
                refetch();
            },
        });
    };

    const handleWorkoutNamePress = (): void => {
        if (post?.workout && post.workout._id) {
            navigation.navigate('ViewWorkoutScreen', { workout: post.workout });
        }
    };

    const handlePressUser = (): void => {
        navigation.navigate('Profile', { userId: post.userId });
    };

    if (isLoading) return <Text>Loading...</Text>;
    if (isError || !post) return <Text>Error loading post</Text>;
    const userFound = post?.user?.username;

    return (
        <VStack backgroundColor="gray9" borderColor="coolGray.200" flex={1} p={4} space={2}>
            <ScrollView>
                <HStack justifyContent="space-between" space={2}>
                    <Avatar borderColor="flame" size="48px" source={{ uri: post.user.profilePictureUrl }} />
                    <VStack flex={1}>
                        <Text fontSize="md" onPress={userFound && handlePressUser}>
                            {userFound ? `${formatName(post.user.firstName, post.user.lastName)} @${post.user.username}` : 'Unknown User'}
                        </Text>
                        <Text color="coolGray.600" fontSize="xs">
                            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                        </Text>
                    </VStack>
                </HStack>
                <Text mt={2} onPress={handleWorkoutNamePress}>
                    {post.workout.name}
                    {' '}
                    {formatTabatasCount(post.workout.numberOfTabatas)}
                </Text>
                <Text mt={2}>
                    Total Workout Time:
                    {' '}
                    {formattedTotalWorkoutTime}
                </Text>
                <Text mt={2}>{post.description}</Text>
                <LikeCommentButtons post={post} />
                <Input
                    borderColor="gray5"
                    InputRightElement={(
                        <Text
                            color="flame"
                            fontSize="sm"
                            fontWeight="bold"
                            mr={2}
                            onPress={handleAddComment}
                        >
                            Send
                        </Text>
                    )}
                    placeholder="Write a comment..."
                    ref={commentInputRef}
                    type="text"
                    value={commentBody}
                    onChangeText={setCommentBody}

                />
                {post.comments.map((comment) => (
                    <CommentCard
                        comment={comment}
                        key={comment._id?.toString()}
                        onDeleteComment={handleDeleteComment}
                    />
                ))}
            </ScrollView>
        </VStack>

    );
};
