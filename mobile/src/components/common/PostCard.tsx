import React from 'react';
import {
    HStack, VStack, Text,
} from 'native-base';
import { formatDistanceToNow } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import { HomeScreenNavigationProp } from '../../types/navigationTypes';
import { PostModel } from '../../types/posts';
import { formatName } from '../../util/util';
import { LikeCommentButtons } from './LikeCommentButtons';
import { WorkoutPostDisplay } from './WorkoutPostDisplay';
import { ProfilePicture } from '../ProfilePicture';

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
                backgroundColor="cardGray"
                mt={4}
                pt={4}
                px={4}
                space={2}
                style={{
                    width: '100%',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                }}
                width="100%"
            >
                <HStack justifyContent="space-between" space={2}>
                    <ProfilePicture size="48px" user={post.user} />
                    <VStack flex={1} justifyContent="flex-start">
                        <Text onPress={userFound && handlePressUser}>
                            <Text bold fontSize="md">{userFound ? `${formatName(post.user.firstName, post.user.lastName)}` : 'Unknown User'}</Text>
                            {'  '}
                            <Text color="gray.400" fontSize="md">
                                {`@${post.user.username}`}
                            </Text>
                        </Text>
                        <Text color="gray.400" fontSize="xs">
                            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                        </Text>
                    </VStack>
                </HStack>
                <Text bold fontSize="lg" mt={2}>
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
