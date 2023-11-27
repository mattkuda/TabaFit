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
                            Username @
                            {' '}
                            {post.userId.toString().substring(0, 8)}
                        </Text>
                        <Text color="coolGray.600" fontSize="xs">
                            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                        </Text>
                    </VStack>
                </HStack>
                <Text mt={2}>{post.description}</Text>
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
