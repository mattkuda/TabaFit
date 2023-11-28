import { useQuery, UseQueryResult } from 'react-query';
import axios from 'axios';
import { PostModel } from '../types/posts';

const apiUrl = 'http://localhost:3000';

const fetchPostsFollowing = async (): Promise<PostModel[]> => {
    try {
        const response = await axios.get(`${apiUrl}/posts/following-posts`);

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data.message || 'An error occurred while fetching posts from following');
        }
        throw new Error('An error occurred while fetching user posts');
    }
};

export const useQueryPostsFollowing = (): UseQueryResult<PostModel[], Error> => useQuery('following-posts', fetchPostsFollowing);
