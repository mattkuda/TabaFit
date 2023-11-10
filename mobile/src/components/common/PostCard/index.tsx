import React from 'react';
import {
    HStack, VStack, Text, Avatar, Icon, IconButton,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import { HomeScreenNavigationProp } from '../../../types/navigationTypes';
import { Post } from '../../../types/posts';

// Define the type for the props
type PostCardProps = {
    post: Post;
};

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
    const navigation = useNavigation<HomeScreenNavigationProp>();

    const handleLikePress = (): void => {
        console.log('Like button pressed');
    };

    // Function to handle when the comment button is pressed
    const handleCommentPress = (): void => {
        console.log('Comment button pressed');
    };

    const handlePress = (): void => {
        navigation.navigate('PostScreen', { postId: post._id });
    };

    return (
        <TouchableOpacity onPress={handlePress}>
            <VStack borderColor="coolGray.200" borderRadius="md" borderWidth={1} mt={4} p={4} space={2}>
                <HStack justifyContent="space-between" space={2}>
                    <Avatar size="48px" source={{ uri: 'https://example.com/user-avatar.png' }} />
                    <VStack flex={1}>
                        <Text bold fontSize="md">
                            Username
                            {' '}
                            @
                            {post.userId.substring(0, 8)}
                        </Text>
                        <Text color="coolGray.600" fontSize="xs">
                            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                        </Text>
                    </VStack>
                </HStack>
                <Text mt={2}>
                    {post.description}
                </Text>
                <HStack justifyContent="space-between" mt={2} space={4}>
                    <IconButton
                        borderRadius="full"
                        icon={<Icon as={Ionicons} name="heart-outline" size="sm" />}
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
                        {post.likeCount}
                        {' '}
                        Likes
                    </Text>
                    <Text>
                        {post.commentCount}
                        {' '}
                        Comments
                    </Text>
                    {/* ... other info like share count, etc. */}
                </HStack>
            </VStack>
        </TouchableOpacity>
    );
};
