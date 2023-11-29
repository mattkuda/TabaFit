import React, { useState } from 'react';
import {
    ScrollView, Button, TextInput,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import {
    VStack, HStack, Avatar, Text, Icon, IconButton,
} from 'native-base';
import { formatDistanceToNow } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useMutateAddComment, useMutateDeleteComment } from '../../mutations/commentMutations';
import { PostScreenRouteProp } from '../../navigation/navigationTypes';
import { useQueryPost } from '../../hooks/useQueryPost'; // Import the usePost hook
import { useMutateLike, useMutateUnlike } from '../../mutations/useMutateLike';

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

    const handleCommentPress = (): void => {
        console.log('TODO: Highlight input when button pressed');
    };

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

    if (isLoading) return <Text>Loading...</Text>;
    if (isError || !post) return <Text>Error loading post</Text>;

    return (
        <ScrollView>
            <VStack borderColor="coolGray.200" borderRadius="md" borderWidth={1} mt={4} p={4} space={2}>
                <HStack justifyContent="space-between" space={2}>
                    <Avatar size="48px" source={{ uri: 'https://iava.org/wp-content/uploads/2020/10/DGoggins-Rnd-1.png' }} />
                    <VStack flex={1}>
                        <Text bold fontSize="md">
                            {`${post.user.firstName} ${post.user.lastName} @${post.user.username}`}
                        </Text>
                        <Text color="coolGray.600" fontSize="xs">
                            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                        </Text>
                    </VStack>
                </HStack>
                <Text mt={2}>{post.description}</Text>
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
            <TextInput
                placeholder="Write a comment..."
                style={{
                    borderWidth: 1, borderColor: 'grey', padding: 10, margin: 10,
                }}
                value={commentBody}
                onChangeText={setCommentBody}
            />
            <Button title="Add Comment" onPress={handleAddComment} />
            {post.comments.map((comment) => (
                <HStack alignItems="center" justifyContent="space-between" key={comment._id?.toString()}>
                    <Text>{comment.body}</Text>
                    <Text>{comment._id?.toString()}</Text>
                    <IconButton
                        icon={<Icon as={Ionicons} name="trash-bin" />}
                        onPress={(): void => handleDeleteComment(comment._id?.toString())}
                    />
                </HStack>
            ))}
        </ScrollView>
    );
};
