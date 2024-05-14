import { useMutation, UseMutationResult } from 'react-query';
import axios, { AxiosError } from 'axios';

const apiUrl = process.env.EAS_API_BASE_URL || 'http://localhost:3000';

interface LikeMutationVariables {
    postId: string;
    userId: string;
}

export const useMutateLike = (): UseMutationResult<void, AxiosError, LikeMutationVariables> => useMutation<void, AxiosError, LikeMutationVariables>(
    ({ postId, userId }) => axios.put(`${apiUrl}/posts/${postId}/like`, { userId }),
);

export const useMutateUnlike = (): UseMutationResult<void, AxiosError, LikeMutationVariables> => useMutation<void, AxiosError, LikeMutationVariables>(
    ({ postId, userId }) => axios.put(`${apiUrl}/posts/${postId}/unlike`, { userId }),
);
