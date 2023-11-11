import React from 'react';
import { View, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import {
    VStack, HStack, Avatar, Text,
} from 'native-base';
import { formatDistanceToNow } from 'date-fns';
import { PostScreenRouteProp } from '../../navigation/navigationTypes';
import { useQueryPost } from '../../hooks/useQueryPost'; // Import the usePost hook

export const PostScreen = (): JSX.Element => {
    const route = useRoute<PostScreenRouteProp>();
    const { postId } = route.params;
    const { data: post, isLoading, isError } = useQueryPost(postId);
    const comments = [{ id: 'Comment 1' }, { id: 'Comment 2' }];

    if (isLoading) return <Text>Loading...</Text>;
    if (isError || !post) return <Text>Error loading post</Text>;

    return (
        <ScrollView>
            <VStack borderColor="coolGray.200" borderRadius="md" borderWidth={1} mt={4} p={4} space={2}>
                <HStack justifyContent="space-between" space={2}>
                    <Avatar size="48px" source={{ uri: 'https://example.com/user-avatar.png' }} />
                    <VStack flex={1}>
                        <Text bold fontSize="md">
                            Username @
                            {' '}
                            {post.userId.substring(0, 8)}
                        </Text>
                        <Text color="coolGray.600" fontSize="xs">
                            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                        </Text>
                    </VStack>
                </HStack>
                <Text mt={2}>{post.description}</Text>
                {/* ... other post details */}
            </VStack>
            {/* Render comments */}
            {comments.map((comment) => (
                <View key={comment.id}>
                    <Text>{comment.id}</Text>
                </View>
            ))}
        </ScrollView>
    );
};
