import { useQuery, UseQueryResult } from 'react-query';
import axios from 'axios';
import { PostModel } from '../types/posts';

const apiUrl = 'http://localhost:3000';

const fetchPosts = async (): Promise<PostModel> => {
    try {
        const response = await axios.get(`${apiUrl}/posts`);

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data.message || 'An error occurred while fetching post');
        }
        throw new Error('An error occurred while fetching post');
    }
};

export const useQueryPosts = (): UseQueryResult<PostModel[], Error> => useQuery('posts', fetchPosts);
