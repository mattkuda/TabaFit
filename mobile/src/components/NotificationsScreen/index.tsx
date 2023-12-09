import React, { useState, useCallback } from 'react';
import {
    VStack, ScrollView, Center,
} from 'native-base';
import { RefreshControl } from 'react-native';
import { useQueryNotifications } from '../../hooks/useQueryNotifications';
import { NotificationCard } from './NotificationCard';

export const NotificationsScreen = (): JSX.Element => {
    const [refreshing, setRefreshing] = useState(false);
    const {
        data: notifications, isLoading, isError, refetch,
    } = useQueryNotifications();

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
