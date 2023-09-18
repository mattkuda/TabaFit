import { useQuery, UseQueryResult } from 'react-query';
import { Post } from '../types/posts';

const fetchPosts = async (): Promise<Post[]> => {
    const response = await fetch('http://localhost:3000/posts');

    if (!response.ok) {
        throw new Error('An error occurred while fetching posts');
    }
    return response.json();
};

export const useQueryPosts = (): UseQueryResult<Post[], Error> => useQuery('posts', fetchPosts);
