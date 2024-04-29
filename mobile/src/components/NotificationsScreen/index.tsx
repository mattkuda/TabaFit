import React, { useEffect } from 'react';
import {
    VStack, Center,
} from 'native-base';
import { useQueryNotifications } from '../../hooks/useQueryNotifications';
import { NotificationCard } from './NotificationCard';
import { useMutateNotificationsRead } from '../../mutations/useMutateNotificationsRead';
import { useAuth } from '../../context/AuthContext';
import { RefreshableScrollView } from '../RefreshableScrollView';

export const NotificationsScreen = (): JSX.Element => {
    const {
        data: notifications, isLoading, isError, refetch,
    } = useQueryNotifications();
    const { mutate: markNotificationsRead } = useMutateNotificationsRead();
    const { authState } = useAuth();
    const userId = authState?.userId;
    // This effect runs when the component is mounted and whenever notifications are refetched

    useEffect(() => {
        if (notifications?.length > 0) {
            // Extract IDs of unread notifications
            const unreadNotificationIds = notifications
                .filter((notification) => !notification.read)
                .map((notification) => notification._id.toString());

            if (unreadNotificationIds.length > 0) {
                // Call the mutation to mark them as read
                markNotificationsRead({ userId });
            }
        }
    }, [notifications, markNotificationsRead, userId]);

    const onRefresh = async (): Promise<void> => {
        await refetch();
    };

    if (isLoading) return <Center>Loading...</Center>;
    if (isError || !notifications) return <Center>Error loading notifications</Center>;

    return (
        <VStack backgroundColor="gray9" flex={1}>
            <RefreshableScrollView onRefresh={onRefresh}>
                <VStack flex={1} p={2} space={2}>
                    {notifications.map((notification) => (
                        <NotificationCard key={notification._id.toString()} notification={notification} />
                    ))}
                </VStack>
            </RefreshableScrollView>
        </VStack>
    );
};
