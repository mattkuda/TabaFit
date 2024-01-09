import { useQuery, UseQueryResult } from 'react-query';
import axios from 'axios';
import { NotificationModel } from '../types/notifications';

const apiUrl = 'http://localhost:3000';

const fetchNotifications = async (unreadOnly: boolean): Promise<NotificationModel[]> => {
    try {
        const response = await axios.get(`${apiUrl}/notifications`, {
            params: { unreadOnly },
        });

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data.message || 'An error occurred while fetching notifications');
        }
        throw new Error('An error occurred while fetching notifications');
    }
};

export const useQueryNotifications = (unreadOnly = false): UseQueryResult<NotificationModel[], Error> => useQuery(['notifications', { unreadOnly }], () => fetchNotifications(unreadOnly));
