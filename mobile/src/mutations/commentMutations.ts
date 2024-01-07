import { useMutation, UseMutationResult } from 'react-query';
import axios, { AxiosError } from 'axios';

const apiUrl = 'http://localhost:3000';

interface AddCommentMutationVariables {
    postId: string;
    userId: string;
    body: string;
}

export const useMutateAddComment = (): UseMutationResult<void, AxiosError, AddCommentMutationVariables> => useMutation<void, AxiosError, AddCommentMutationVariables>(
    ({ postId, userId, body }) => axios.post(`${apiUrl}/posts/${postId}/comments`, { userId, body }),
);

interface DeleteCommentMutationVariables {
    postId: string;
    commentId: string;
}

export const useMutateDeleteComment = (): UseMutationResult<void, AxiosError, DeleteCommentMutationVariables> => useMutation<void, AxiosError, DeleteCommentMutationVariables>(
    ({ postId, commentId }) => {
        const url = `${apiUrl}/posts/${postId}/comments/${commentId}`;

        return axios.delete(url);
    },
);
