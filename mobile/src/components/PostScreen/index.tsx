import React, { useRef, useState } from 'react';
import {
    ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
    VStack, HStack, Text, Input, Divider,
    Center,
    Spinner,
} from 'native-base';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import { useMutateAddComment, useMutateDeleteComment } from '../../mutations/commentMutations';
import { PostScreenRouteProp } from '../../navigation/navigationTypes';
import { useQueryPost } from '../../hooks/useQueryPost';
import { PostScreenNavigationProp } from '../../types/navigationTypes';
import { formatName } from '../../util/util';
import { CommentCard } from './CommentCard';
import { LikeCommentButtons } from '../common/LikeCommentButtons';
import { WorkoutPostDisplay } from '../common/WorkoutPostDisplay';
import { ProfilePicture } from '../ProfilePicture';
import { GradientVStack } from '../common/GradientVStack';

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

    const handlePressUser = (): void => {
        navigation.navigate('Profile', { userId: post.userId });
    };

    if (isLoading) {
        return (
            <GradientVStack
                backgroundColor="gray9"
                flex={1}
                space={4}
                width="100%"
            >
                <Center flex={1}><Spinner /></Center>
            </GradientVStack>
        );
    }

    if (isError || !post) {
        return (
            <GradientVStack
                backgroundColor="gray9"
                flex={1}
                space={4}
                width="100%"
            >
                <Text>Error loading post</Text>
            </GradientVStack>
        );
    }
    const userFound = post?.user?.username;

    return (
        <GradientVStack backgroundColor="gray9" borderColor="gray.200" flex={1} p={4} space={2}>
            <ScrollView>
                <HStack justifyContent="space-between" space={2}>
                    <ProfilePicture borderColor="primary" size="48px" user={post.user} />
                    <VStack flex={1}>
                        <HStack>
                            <Text bold fontSize="md" onPress={userFound && handlePressUser}>
                                {userFound ? `${formatName(post.user.firstName, post.user.lastName)}` : 'Unknown User'}
                            </Text>
                            <Text color="gray.300" fontSize="md">
                                {userFound ? ` @${post.user.username}` : ''}
                            </Text>
                        </HStack>
                        <Text color="gray.400" fontSize="xs">
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
                <WorkoutPostDisplay workout={post.workout} />
                <LikeCommentButtons post={post} />
                <Divider backgroundColor="gray6" />
                <Input
                    backgroundColor="gray.900"
                    InputRightElement={(
                        <Text
                            color="white"
                            fontSize="sm"
                            fontWeight="bold"
                            mr={2}
                            onPress={handleAddComment}
                        >
                            Send
                        </Text>
                    )}
                    mt={4}
                    placeholder="Write a comment..."
                    ref={commentInputRef}
                    type="text"
                    value={commentBody}
                    onChangeText={setCommentBody}

                />
                {/* @ts-expect-errors */}
                <VStack gap={4} mt={2}>
                    {post.comments.map((comment) => (
                        <CommentCard
                            comment={comment}
                            key={comment._id?.toString()}
                            onDeleteComment={handleDeleteComment}
                        />
                    ))}
                </VStack>
            </ScrollView>
        </GradientVStack>

    );
};
