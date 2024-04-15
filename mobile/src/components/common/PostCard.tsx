import React from 'react';
import {
    HStack, VStack, Text, Avatar,
} from 'native-base';
import { formatDistanceToNow } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import { HomeScreenNavigationProp } from '../../types/navigationTypes';
import { PostModel } from '../../types/posts';
import { formatName } from '../../util/util';
import { LikeCommentButtons } from './LikeCommentButtons';
import { WorkoutPostDisplay } from './WorkoutPostDisplay';

type PostCardProps = {
    post: PostModel;
};

const arePropsEqual = (
    prevProps: PostCardProps,
    nextProps: PostCardProps,
): boolean => prevProps.post._id === nextProps.post._id;

export const PostCard: React.FC<PostCardProps> = React.memo(({ post }) => {
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const userFound = post?.user?.username;

    const handlePress = (): void => {
        navigation.navigate('PostScreen', { postId: post._id.toString() });
    };

    const handlePressUser = (): void => {
        navigation.navigate('Profile', { userId: post.userId });
    };

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
                pt={4}
                px={4}
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
                <WorkoutPostDisplay workout={post.workout} />
                <LikeCommentButtons handleCommentPress={handlePress} post={post} />
            </VStack>
        </TouchableOpacity>
    );
}, arePropsEqual);
