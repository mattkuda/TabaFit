import { useQuery, UseQueryResult } from 'react-query';
import { PostModel } from '../types/posts';

const fetchPost = async (postId: string): Promise<PostModel> => {
    const response = await fetch(`http://localhost:3000/posts/post/${postId}`);

    if (!response.ok) {
        throw new Error('An error occurred while fetching the post');
    }
    return response.json();
};

export const useQueryPost = (postId: string): UseQueryResult<PostModel, Error> => useQuery(['post', postId], () => fetchPost(postId), {
    enabled: !!postId,
});
