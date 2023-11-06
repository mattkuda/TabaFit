// mutations/followMutations.ts
import { useMutation, UseMutationResult } from 'react-query';
import axios, { AxiosError } from 'axios';

const apiUrl = 'http://localhost:3000';

interface FollowMutationVariables {
    followerId: string;
    followeeId: string;
}

export const useFollowUser = (): UseMutationResult<void, AxiosError, FollowMutationVariables> => useMutation<void, AxiosError, FollowMutationVariables>(
    ({ followerId, followeeId }) => axios.post(`${apiUrl}/follows/follow`, { followerId, followeeId }),
);

export const useUnfollowUser = (): UseMutationResult<void, AxiosError, FollowMutationVariables> => useMutation<void, AxiosError, FollowMutationVariables>(
    ({ followerId, followeeId }) => axios.delete(`${apiUrl}/follows/unfollow`, {
        data: { followerId, followeeId },
    }),
);
