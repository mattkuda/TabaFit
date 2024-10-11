import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import axios, { AxiosError } from 'axios';

const apiUrl = process.env.EXPO_PUBLIC_EAS_API_BASE_URL || 'http://localhost:3000';

interface BlockVariables {
    userIdToBlock: string;
}

interface UnblockVariables {
    userIdToUnblock: string;
}

export const useMutateBlock = (): UseMutationResult<void, AxiosError, BlockVariables> => {
    const queryClient = useQueryClient();

    return useMutation<void, AxiosError, BlockVariables>(
        ({ userIdToBlock }) => axios.post(`${apiUrl}/users/${userIdToBlock}/block`),
        {
            onSuccess: () => {
                // Invalidate and refetch relevant queries
                queryClient.invalidateQueries('userInfo');
                queryClient.invalidateQueries('blockedUsers');
                queryClient.invalidateQueries('suggestedUsers');
            },
        },
    );
};

export const useMutateUnblock = (): UseMutationResult<void, AxiosError, UnblockVariables> => {
    const queryClient = useQueryClient();

    return useMutation<void, AxiosError, UnblockVariables>(
        ({ userIdToUnblock }) => axios.delete(`${apiUrl}/users/${userIdToUnblock}/block`),
        {
            onSuccess: () => {
                // Invalidate and refetch relevant queries
                queryClient.invalidateQueries('userInfo');
                queryClient.invalidateQueries('blockedUsers');
                queryClient.invalidateQueries('suggestedUsers');
            },
        },
    );
};
