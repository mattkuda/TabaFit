import { useQuery, UseQueryResult } from 'react-query';
import { Post } from '../types/posts';

const fetchPost = async (postId: string): Promise<Post> => {
    const response = await fetch(`http://localhost:3000/posts/${postId}`);

    if (!response.ok) {
        throw new Error('An error occurred while fetching the post');
    }
    return response.json();
};

export const useQueryPost = (postId: string): UseQueryResult<Post, Error> => useQuery(['post', postId], () => fetchPost(postId), {
    enabled: !!postId, // Only run the query if there's a postId
});
