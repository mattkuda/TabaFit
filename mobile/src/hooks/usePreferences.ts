import {
    useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult,
} from 'react-query';
import axios, { AxiosError } from 'axios';
import { UserPreferences } from '../types/users';

const apiUrl = process.env.EXPO_PUBLIC_EAS_API_BASE_URL || 'http://localhost:3000';

export const fetchUserPreferences = async (userId: string): Promise<UserPreferences> => {
    const response = await axios.get<UserPreferences>(`${apiUrl}/users/${userId}/preferences`);

    return response.data;
};

export const useGetPreferences = (userId: string): UseQueryResult<UserPreferences, Error> => useQuery(['preferences', userId], () => fetchUserPreferences(userId));

export const useUpdatePreferences = (): UseMutationResult<void, AxiosError, { userId: string; preferences: UserPreferences }> => {
    const queryClient = useQueryClient();

    return useMutation<void, AxiosError, { userId: string; preferences: UserPreferences }>(
        ({ userId, preferences }) => axios.put(`${apiUrl}/users/${userId}/preferences`, preferences),
        {
            onSuccess: (_, variables) => {
                queryClient.invalidateQueries(['preferences', variables.userId]);
                queryClient.invalidateQueries(['userInfo', variables.userId]);
            },
        },
    );
};
