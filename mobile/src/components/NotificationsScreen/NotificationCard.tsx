import React from 'react';
import {
    HStack, VStack, Text, Avatar, Box,
} from 'native-base';
import { formatDistanceToNow } from 'date-fns';
import { TouchableOpacity } from 'react-native';
import { NotificationModel } from '../../types/notifications';

type NotificationCardProps = {
    notification: NotificationModel;
};

export const NotificationCard: React.FC<NotificationCardProps> = ({ notification }) => {
    const backgroundColor = notification.read ? 'white' : 'coolGray.100';

    return (
        <TouchableOpacity>
            <Box backgroundColor={backgroundColor} borderColor="coolGray.200" borderRadius="md" borderWidth="1" mt="2" p="4">
                <HStack alignItems="center" space={3}>
                    <Avatar size="48px" source={{ uri: notification.initiatorUser.profilePicture }} />
                    <VStack>
                        <Text bold fontSize="sm">Todo: Add title</Text>
                        <Text color="coolGray.600" fontSize="xs">
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </Text>
                    </VStack>
                </HStack>
            </Box>
        </TouchableOpacity>
    );
};
