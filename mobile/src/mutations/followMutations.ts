// mutations/followMutations.ts
import { useMutation, UseMutationResult } from 'react-query';
import axios, { AxiosError } from 'axios';

const apiUrl = process.env.EXPO_PUBLIC_EAS_API_BASE_URL || 'http://localhost:3000';

interface FollowMutationVariables {
    followerId: string;
    followeeId: string;
}
interface FollowAllVariables {
    followerId: string;
}

export const useFollowUser = (): UseMutationResult<void, AxiosError, FollowMutationVariables> => useMutation<void, AxiosError, FollowMutationVariables>(
    ({ followerId, followeeId }) => axios.post(`${apiUrl}/follows/follow`, { followerId, followeeId }),
);

export const useUnfollowUser = (): UseMutationResult<void, AxiosError, FollowMutationVariables> => useMutation<void, AxiosError, FollowMutationVariables>(
    ({ followerId, followeeId }) => axios.delete(`${apiUrl}/follows/unfollow`, {
        data: { followerId, followeeId },
    }),
);

export const useFollowAll = (): UseMutationResult<void, AxiosError, FollowAllVariables> => useMutation<void, AxiosError, FollowAllVariables>(
    ({ followerId }) => axios.post(`${apiUrl}/follows/followAll`, { followerId }),
);
