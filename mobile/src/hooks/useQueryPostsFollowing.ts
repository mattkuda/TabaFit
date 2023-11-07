import { useQuery, UseQueryResult } from 'react-query';
import { Post } from '../types/posts';

const fetchPostsFollowing = async (): Promise<Post[]> => {
    const response = await fetch('http://localhost:3000/posts/following-posts');

    if (!response.ok) {
        throw new Error('An error occurred while fetching posts from following');
    }
    return response.json();
};

export const useQueryPostsFollowing = (): UseQueryResult<Post[], Error> => useQuery('posts', fetchPostsFollowing);
