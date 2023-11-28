import { useQuery, UseQueryResult } from 'react-query';
import { PostModel } from '../types/posts';

const fetchPosts = async (): Promise<PostModel[]> => {
    const response = await fetch('http://localhost:3000/posts');

    if (!response.ok) {
        throw new Error('An error occurred while fetching posts');
    }
    return response.json();
};

export const useQueryPosts = (): UseQueryResult<PostModel[], Error> => useQuery('posts', fetchPosts);
