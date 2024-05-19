import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Easing,
} from 'react-native';
import {
    VStack, HStack, Text, Icon, Button, Divider,
} from 'native-base';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useMutateLike, useMutateUnlike } from '../../mutations/useMutateLike';
import { PostModel } from '../../types/posts';

type LikeCommentButtonsProps = {
    post: PostModel;
    handleCommentPress?: () => void;
};

export const LikeCommentButtons = ({ post, handleCommentPress }: LikeCommentButtonsProps): JSX.Element => {
    const { authState } = useAuth();
    const userId = authState?.userId;
    const likeMutation = useMutateLike();
    const unlikeMutation = useMutateUnlike();
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    useEffect(() => {
        if (post) {
            setLiked(post.likes.map((id) => id.toString()).includes(userId));
            setLikeCount(post.likes.length);
        }
    }, [post, userId]);

    const likeIconSize = useRef(new Animated.Value(1)).current;
    const likeIconRotation = useRef(new Animated.Value(0)).current;

    const handleLikePress = (): void => {
        setLiked(!liked);
        setLikeCount(liked ? likeCount - 1 : likeCount + 1);

        if (liked) {
            unlikeMutation.mutate({ postId: post._id.toString(), userId }, {
                onError: () => {
                    setLiked(true);
                    setLikeCount(likeCount);
                },
            });
        } else {
            likeMutation.mutate({ postId: post._id.toString(), userId }, {
                onError: () => {
                    setLiked(false);
                    setLikeCount(likeCount);
                },
            });

            Animated.sequence([
                Animated.parallel([
                    Animated.timing(likeIconSize, {
                        toValue: 1.2,
                        duration: 150,
                        easing: Easing.linear,
                        useNativeDriver: true,
                    }),
                    Animated.timing(likeIconRotation, {
                        toValue: 1,
                        duration: 150,
                        easing: Easing.linear,
                        useNativeDriver: true,
                    }),
                ]),
                Animated.parallel([
                    Animated.timing(likeIconSize, {
                        toValue: 1,
                        duration: 150,
                        easing: Easing.linear,
                        useNativeDriver: true,
                    }),
                    Animated.timing(likeIconRotation, {
                        toValue: 0,
                        duration: 150,
                        easing: Easing.linear,
                        useNativeDriver: true,
                    }),
                ]),
            ]).start(() => {
                // Reset the animation
                likeIconSize.setValue(1);
                likeIconRotation.setValue(0);
            });
        }
    };

    const handleCommentPressOnPostCard = (): void => {
        // TODO: Highlight input when button pressed');
        handleCommentPress();
    };

    const likeText = (): string => {
        if (likeCount === 0) return 'Be the first to like this!';

        if (liked) {
            if (likeCount === 1) {
                return 'You liked this post';
            } if (likeCount === 2) {
                return 'You and 1 other liked this post';
            }
            return `You and ${likeCount - 1} others liked this post`;
        }

        if (likeCount === 1) return '1 like';
        return `${likeCount} likes`;
    };

    return (
        <VStack backgroundColor="gray9" borderColor="gray.200" flex={1}>
            <HStack color="gray.500" fontSize="xs" justifyContent="space-between" mt={2}>
                <Text>
                    {likeText()}
                </Text>
                <Text>
                    {post.comments.length === 1 ? '1 Comment' : `${post.comments.length} Comments`}
                </Text>
            </HStack>
            <Divider backgroundColor="gray6" mt={2} />
            <HStack justifyContent="space-between" space={4}>
                <Button
                    colorScheme={liked ? 'cherry.500' : 'secondary'}
                    flex={1}
                    size="md"
                    startIcon={(
                        <Animated.View
                            style={{
                                transform: [
                                    { scale: likeIconSize },
                                    {
                                        rotate: likeIconRotation.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: ['0deg', '-10deg'],
                                        }),
                                    },
                                ],
                            }}
                        >
                            <Icon
                                as={AntDesign}
                                color={liked ? 'cherry.500' : 'white'}
                                name={liked ? 'like1' : 'like2'}
                                size="md"
                            />
                        </Animated.View>
                        )}
                    variant="ghost"
                    onPress={handleLikePress}
                >
                    Like
                </Button>
                <Button
                    colorScheme="secondary"
                    flex={1}
                    size="md"
                    startIcon={(
                        <Icon
                            as={MaterialCommunityIcons}
                            color="white"
                            name="comment-text"
                            size="md"
                        />
                        )}
                    variant="ghost"
                    onPress={handleCommentPressOnPostCard}
                >
                    Comment
                </Button>
            </HStack>
        </VStack>
    );
};
