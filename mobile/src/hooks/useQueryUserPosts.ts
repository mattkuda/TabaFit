import { useQuery, UseQueryResult } from 'react-query';
import axios from 'axios';
import { PostModel } from '../types/posts';

const apiUrl = 'http://localhost:3000';

const fetchUserPosts = async (userId: string): Promise<PostModel[]> => {
    try {
        const response = await axios.get(`${apiUrl}/posts/user-posts/${userId}`);

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data.message || 'An error occurred while fetching user posts');
        }
        throw new Error('An error occurred while fetching user posts');
    }
};

export const useQueryUserPosts = (userId: string): UseQueryResult<PostModel[], Error> => useQuery(['userPosts', userId], () => fetchUserPosts(userId));
