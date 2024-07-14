import React, { useEffect } from 'react';
import {
    VStack, Center, Text, Spinner,
} from 'native-base';
import { useQueryClient } from 'react-query';
import { useQueryNotifications } from '../../hooks/useQueryNotifications';
import { NotificationCard } from './NotificationCard';
import { useMutateNotificationsRead } from '../../mutations/useMutateNotificationsRead';
import { useAuth } from '../../context/AuthContext';
import { RefreshableScrollView } from '../RefreshableScrollView';
import { GradientVStack } from '../common/GradientVStack';

export const NotificationsScreen = (): JSX.Element => {
    const queryClient = useQueryClient();
    const {
        data: notifications, isLoading, isError, refetch,
    } = useQueryNotifications();
    const { mutate: markNotificationsRead } = useMutateNotificationsRead();
    const { authState } = useAuth();
    const userId = authState?.userId;

    useEffect(() => {
        if (notifications?.length > 0) {
            // Extract IDs of unread notifications
            const unreadNotificationIds = notifications
                .filter((notification) => !notification.read)
                .map((notification) => notification._id.toString());

            if (unreadNotificationIds.length > 0) {
                // Call the mutation to mark them as read
                markNotificationsRead(
                    { userId },
                    { onSuccess: () => queryClient.invalidateQueries('notifications') },
                );
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onRefresh = async (): Promise<void> => {
        await refetch();
    };

    if (isLoading) {
        return (
            <GradientVStack
                flex={1}
                space={4}
                width="100%"
            >
                <Center flex={1}><Spinner /></Center>
            </GradientVStack>
        );
    }

    if (isError) {
        return (
            <GradientVStack
                flex={1}
                space={4}
                width="100%"
            >
                <Text>Error loading notifications</Text>
            </GradientVStack>
        );
    }

    return isLoading
        ? (
            <GradientVStack backgroundColor="gray9" flex={1} space={4} width="100%">
                <Spinner color="white" mt={8} size="lg" />
            </GradientVStack>
        ) : (
            <GradientVStack backgroundColor="gray9" flex={1}>
                <RefreshableScrollView onRefresh={onRefresh}>
                    <VStack flex={1} p={2} space={2}>
                        {notifications.map((notification) => (
                            <NotificationCard key={notification._id.toString()} notification={notification} />
                        ))}
                    </VStack>
                </RefreshableScrollView>
            </GradientVStack>
        );
};
