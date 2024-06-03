import React from 'react';
import {
    Icon, IconButton, Box, Text,
} from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { NotificationsScreenNavigationProp } from '../navigation/navigationTypes';
import { useQueryNotifications } from '../hooks/useQueryNotifications';

export const NotificationsButton = (): JSX.Element => {
    const navigation = useNavigation<NotificationsScreenNavigationProp>();
    const { data: notifications } = useQueryNotifications(true);

    const unreadNotificationsCount = notifications?.filter((notif) => !notif.read).length || 0;

    return (
        <Box>
            <IconButton
                _icon={{
                    color: 'primary',
                    size: 'md',
                }}
                borderRadius="full"
                color="primary"
                icon={<Icon as={Ionicons} name="notifications" size="md" />}
                onPress={(): void => navigation.navigate('NotificationsScreen')}
            />
            {unreadNotificationsCount > 0 && (
                <Box
                    alignItems="center"
                    bg="red.500"
                    borderRadius="full"
                    height={3}
                    justifyContent="center"
                    position="absolute"
                    right={2}
                    top={2}
                    width={3}
                >
                    <Text color="white" fontSize="10" pb={4}>
                        {unreadNotificationsCount}
                    </Text>
                </Box>
            )}
        </Box>
    );
};
