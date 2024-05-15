import { useMutation, UseMutationResult } from 'react-query';
import axios, { AxiosError } from 'axios';

const apiUrl = process.env.EXPO_PUBLIC_EAS_API_BASE_URL || 'http://localhost:3000';

interface MarkNotificationsReadVariables {
    userId: string;
}

export const useMutateNotificationsRead = (): UseMutationResult<void, AxiosError, MarkNotificationsReadVariables> => useMutation<void, AxiosError, MarkNotificationsReadVariables>(
    ({ userId }) => axios.put(`${apiUrl}/notifications/mark-as-read`, { userId }),
    {
        onError: (error) => {
            console.error('Error marking notifications as read', error.message);
        },
        // onSuccess can be used to refetch notification-related queries or update UI
        onSuccess: () => {
            // You can call any query refetch functions here if needed
            // queryClient.invalidateQueries('notifications');
        },
    },
);
