import React from 'react';
import {
    HStack, VStack, Text, Avatar, Box,
} from 'native-base';
import { TouchableOpacity } from 'react-native';
import { User } from '../types/users';
import { formatName } from '../util/util';

type NotificationCardProps = {
    user: User;
};

export const ConnectionCard: React.FC<NotificationCardProps> = ({ user }) => (
    <TouchableOpacity>
        <Box backgroundColor="white" borderColor="coolGray.200" borderRadius="md" borderWidth="1" mt="2" p="4">
            <HStack alignItems="center" space={3}>
                <Avatar size="48px" source={{ uri: user.profilePictureUrl }} />
                <VStack>
                    <Text bold fontSize="sm">
                        {formatName(user.firstName, user.lastName)}
                    </Text>
                    <Text color="coolGray.600" fontSize="xs">
                        {user.username}
                    </Text>
                </VStack>
            </HStack>
        </Box>
    </TouchableOpacity>
);
