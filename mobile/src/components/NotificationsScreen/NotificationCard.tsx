import React from 'react';
import {
    HStack, VStack, Text, Box,
} from 'native-base';
import { formatDistanceToNow } from 'date-fns';
import { TouchableOpacity } from 'react-native';
import { NotificationModel } from '../../types/notifications';
import { ProfilePicture } from '../ProfilePicture';

type NotificationCardProps = {
    notification: NotificationModel;
};

export const NotificationCard: React.FC<NotificationCardProps> = ({ notification }) => {
    const backgroundColor = notification.read ? 'gray8' : 'gray7';

    return (
        <TouchableOpacity>
            <Box backgroundColor={backgroundColor} borderRadius="md" borderWidth="1" mt="2" p="4">
                <HStack alignItems="center" space={3}>
                    <ProfilePicture size="48px" user={notification?.initiatorUserInfo} />
                    <VStack flex={1}>
                        <Text bold ellipsizeMode="tail" fontSize="sm" numberOfLines={2}>{notification.summaryText}</Text>
                        <Text color="gray.600" fontSize="xs">
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </Text>
                    </VStack>
                </HStack>
            </Box>
        </TouchableOpacity>
    );
};
