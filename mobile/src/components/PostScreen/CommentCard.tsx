import React, { useState } from 'react';
import {
    HStack, VStack, Text, Icon,
    Menu,
    Pressable,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import { PostCommentModel } from '../../types/posts';
import { PostScreenNavigationProp } from '../../types/navigationTypes';
import { ProfilePicture } from '../ProfilePicture';
import { ReportModal } from '../common/ReportModal';

type CommentCardProps = {
    comment: PostCommentModel;
    onDeleteComment: (commentId: string) => void;
};

const MenuTrigger = ({ triggerProps }): JSX.Element => (
    <Pressable accessibilityLabel="More options menu" {...triggerProps}>
        <Icon as={Ionicons} name="ellipsis-horizontal-outline" size="md" />
    </Pressable>
);

export const CommentCard: React.FC<CommentCardProps> = ({ comment, onDeleteComment }) => {
    // Todo: Include logic to determine if the comment should show a delete button
    // This could be based on comparing the comment's userId with the current user's id
    const showDeleteButton = true; // Placeholder logic
    const navigation = useNavigation<PostScreenNavigationProp>();
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    const handlePressUser = (userId: string): void => {
        navigation.navigate('Profile', { userId });
    };

    return (
        <VStack
            bg="cardGray"
            borderColor="gray5"
            borderRadius="md"
            borderWidth={1}
            my={2}
            p={2}
            space={2}
        >
            <HStack alignItems="center" space={2}>
                <ProfilePicture size="sm" user={comment?.user} />
                <VStack flex={1}>
                    <Text
                        fontSize="sm"
                        onPress={(): void => (comment.user
                            ? handlePressUser(comment.userId) : undefined)}
                    >
                        {comment.user ? `${comment.user.firstName} ${comment.user.lastName}` : 'Unknown User'}
                    </Text>
                    <Text color="gray.400" fontSize="xs">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </Text>
                </VStack>
                <Menu
                    backgroundColor="gray.900"
                    shadow={2}
                    // eslint-disable-next-line react/no-unstable-nested-components
                    trigger={(triggerProps): JSX.Element => <MenuTrigger triggerProps={triggerProps} />}
                    w="190"
                >
                    <Menu.Item onPress={(): void => setIsReportModalOpen(true)}>
                        <>
                            <Icon as={Ionicons} color="red.500" name="flag" size="sm" />
                            <Text color="red.500">Report comment</Text>
                        </>
                    </Menu.Item>
                    {showDeleteButton && (
                        <Menu.Item
                            onPress={(): void => onDeleteComment(comment._id?.toString())}
                        >
                            <>
                                <Icon as={Ionicons} color="red.500" name="trash-bin" size="sm" />
                                <Text color="red.500">Delete comment</Text>
                            </>
                        </Menu.Item>
                    )}
                </Menu>
            </HStack>
            <Text fontSize="sm" mt={2}>
                {comment.body}
            </Text>
            <ReportModal
                isOpen={isReportModalOpen}
                itemId={comment._id?.toString() || ''}
                itemType="comment"
                onClose={(): void => setIsReportModalOpen(false)}
            />
        </VStack>
    );
};
