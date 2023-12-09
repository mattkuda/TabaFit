import { useQuery, UseQueryResult } from 'react-query';
import axios from 'axios';
import { NotificationModel } from '../types/notifications';

const apiUrl = 'http://localhost:3000';

const fetchNotifications = async (): Promise<NotificationModel[]> => {
    try {
        const response = await axios.get(`${apiUrl}/notifications`);

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data.message || 'An error occurred while fetching notifications');
        }
        throw new Error('An error occurred while fetching notifications');
    }
};

export const useQueryNotifications = (): UseQueryResult<NotificationModel[], Error> => useQuery('notifications', fetchNotifications);
