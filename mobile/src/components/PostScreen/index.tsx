/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import {
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
    VStack, HStack, Text, Input, Divider,
    Center,
    Spinner,
    Icon,
    IconButton,
    Menu,
} from 'native-base';
import { formatDistanceToNow } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from 'react-query';
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
import { WorkoutPostManualDisplay } from '../common/WorkoutPostManualDisplay';
import { useDeletePost } from '../../mutations/useMutateSharePost';
import { ReportModal } from '../common/ReportModal';

export const PostScreen = (): JSX.Element => {
    const route = useRoute<PostScreenRouteProp>();
    const { postId } = route.params;
    const {
        data: post, isLoading, isError, refetch,
    } = useQueryPost(postId);
    const addCommentMutation = useMutateAddComment();
    const deleteCommentMutation = useMutateDeleteComment();
    const deletePostMutation = useDeletePost();
    const [commentBody, setCommentBody] = useState('');
    const { authState } = useAuth();
    const userId = authState?.userId;
    const navigation = useNavigation<PostScreenNavigationProp>();
    const commentInputRef = useRef<HTMLInputElement>(null);
    const queryClient = useQueryClient();
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    const handleDeletePost = (): void => {
        deletePostMutation.mutate({ postId }, {
            onSuccess: () => {
                queryClient.invalidateQueries(['userInfo', userId]);
                queryClient.invalidateQueries('following-posts');
                navigation.goBack(); // Navigate back after deletion
            },
        });
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

    const handlePressUser = (): void => {
        navigation.navigate('Profile', { userId: post.userId });
    };

    useEffect(() => {
        if (post?.userId === userId) {
            navigation.setOptions({
                headerRight: (): JSX.Element => (
                    <Menu
                        backgroundColor="gray.900"
                        shadow={2}
                        trigger={(triggerProps): JSX.Element => (
                            <IconButton
                                {...triggerProps}
                                _icon={{
                                    color: 'white',
                                    size: 'md',
                                }}
                                borderRadius="full"
                                color="primary"
                                icon={<Icon as={Ionicons} name="ellipsis-horizontal-outline" size="lg" />}
                            />
                        )}
                    >
                        <Menu.Item onPress={(): void => setIsReportModalOpen(true)}>
                            <Text color="red.500">Report Post</Text>
                        </Menu.Item>
                        {post?.userId === userId && (
                            <Menu.Item onPress={handleDeletePost}>
                                <Text color="red.500">Delete Post</Text>
                            </Menu.Item>
                        )}
                    </Menu>
                ),
            });
        }
    }, [navigation, post?.userId]);

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
                    <TouchableOpacity onPress={userFound && handlePressUser}>
                        <ProfilePicture borderColor="primary" size="48px" user={post.user} />
                    </TouchableOpacity>
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
                {post.workout
                    ? <WorkoutPostDisplay workout={post.workout} />
                    : <WorkoutPostManualDisplay manualTabatas={post.manualTabatas} />}
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
                    returnKeyType="go"
                    type="text"
                    value={commentBody}
                    onChangeText={setCommentBody}
                    onSubmitEditing={handleAddComment}
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
                {/* <HStack alignItems="center" justifyContent="space-between" p={4}>
                    <IconButton
                        icon={<Icon as={Ionicons} name="flag-outline" />}
                        onPress={() => setIsReportModalOpen(true)}
                    />
                </HStack> */}
                <ReportModal
                    isOpen={isReportModalOpen}
                    itemId={post._id.toString()}
                    itemType="post"
                    reporterId={userId}
                    onClose={(): void => setIsReportModalOpen(false)}
                />
            </ScrollView>
        </GradientVStack>
    );
};
