import React, { useState, useCallback, useEffect } from 'react';
import {
    VStack, ScrollView, Center,
} from 'native-base';
import { RefreshControl } from 'react-native';
import { useQueryNotifications } from '../../hooks/useQueryNotifications';
import { NotificationCard } from './NotificationCard';
import { useMutateNotificationsRead } from '../../mutations/useMutateNotificationsRead';
import { useAuth } from '../../context/AuthContext';

export const NotificationsScreen = (): JSX.Element => {
    const [refreshing, setRefreshing] = useState(false);
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

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    }, [refetch]);

    if (isLoading) return <Center>Loading...</Center>;
    if (isError || !notifications) return <Center>Error loading notifications</Center>;

    return (
        <ScrollView
            _contentContainerStyle={{ px: '4', mb: '4' }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <VStack space={4}>
                {notifications.map((notification) => (
                    <NotificationCard key={notification._id.toString()} notification={notification} />
                ))}
            </VStack>
        </ScrollView>
    );
};
