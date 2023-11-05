// mutations/followMutations.ts
import { useMutation, UseMutationResult } from 'react-query';
import axios from 'axios';

const apiUrl = 'http://localhost:3000';

interface FollowMutationVariables {
    followerId: string;
    followeeId: string;
}

export const useFollowUser = (): UseMutationResult<void, unknown, FollowMutationVariables> => useMutation<void, unknown, FollowMutationVariables>(
    ({ followerId, followeeId }) => axios.post(`${apiUrl}/follow`, { followerId, followeeId }),
);

export const useUnfollowUser = (): UseMutationResult<void, unknown, FollowMutationVariables> => useMutation<void, unknown, FollowMutationVariables>(
    ({ followerId, followeeId }) => axios.delete(`${apiUrl}/unfollow`, {
        data: { followerId, followeeId },
    }),
);
