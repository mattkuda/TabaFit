import React from 'react';
import {
    HStack, VStack, Text, Avatar, Icon, IconButton,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import { PostCommentModel } from '../../types/posts';
import { PostScreenNavigationProp } from '../../types/navigationTypes';

type CommentCardProps = {
    comment: PostCommentModel;
    onDeleteComment: (commentId: string) => void;
};

export const CommentCard: React.FC<CommentCardProps> = ({ comment, onDeleteComment }) => {
    // Todo: Include logic to determine if the comment should show a delete button
    // This could be based on comparing the comment's userId with the current user's id
    const showDeleteButton = true; // Placeholder logic
    const navigation = useNavigation<PostScreenNavigationProp>();

    const handlePressUser = (userId: string): void => {
        navigation.navigate('Profile', { userId });
    };

    return (
        <VStack
            borderColor="gray5"
            borderRadius="md"
            borderWidth={1}
            my={2}
            p={2}
            space={2}
        >
            <HStack alignItems="center" space={2}>
                <Avatar size="32px" source={{ uri: comment.user?.profilePictureUrl }} />
                <VStack>
                    <Text
                        fontSize="sm"
                        onPress={(): void => (comment.user
                            ? handlePressUser(comment.userId) : undefined)}
                    >
                        {comment.user ? `${comment.user.firstName} ${comment.user.lastName}` : 'Unknown User'}
                    </Text>
                    <Text color="coolGray.600" fontSize="xs">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </Text>
                </VStack>
                {showDeleteButton && (
                    <IconButton
                        icon={<Icon as={Ionicons} name="trash-bin" size="sm" />}
                        ml="auto"
                        onPress={(): void => onDeleteComment(comment._id?.toString())}
                    />
                )}
            </HStack>
            <Text fontSize="sm" mt={2}>
                {comment.body}
            </Text>
        </VStack>
    );
};
