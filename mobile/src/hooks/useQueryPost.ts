import { useQuery, UseQueryResult } from 'react-query';
import axios from 'axios';
import { PostModel } from '../types/posts';

const apiUrl = process.env.EXPO_PUBLIC_EAS_API_BASE_URL || 'http://localhost:3000';

const fetchPost = async (postId: string): Promise<PostModel> => {
    try {
        const response = await axios.get(`${apiUrl}/posts/post/${postId}`);

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data.message || 'An error occurred while fetching post');
        }
        throw new Error('An error occurred while fetching post');
    }
};

export const useQueryPost = (postId: string): UseQueryResult<PostModel, Error> => useQuery(['post', postId], () => fetchPost(postId), {
    enabled: !!postId,
});
