import React, { useRef, useState } from 'react';
import {
    ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
    VStack, HStack, Text, Input, Divider,
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

    if (isLoading) return <Text>Loading...</Text>;
    if (isError || !post) return <Text>Error loading post</Text>;
    const userFound = post?.user?.username;

    return (
        <VStack backgroundColor="gray9" borderColor="coolGray.200" flex={1} p={4} space={2}>
            <ScrollView>
                <HStack justifyContent="space-between" space={2}>
                    <ProfilePicture borderColor="flame" size="48px" user={post.user} />
                    <VStack flex={1}>
                        <HStack>
                            <Text bold fontSize="md" onPress={userFound && handlePressUser}>
                                {userFound ? `${formatName(post.user.firstName, post.user.lastName)}` : 'Unknown User'}
                            </Text>
                            <Text color="coolGray.300" fontSize="md">
                                {userFound ? ` @${post.user.username}` : ''}
                            </Text>
                        </HStack>

                        <Text color="coolGray.300" fontSize="xs">
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
                    mt={2}
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
