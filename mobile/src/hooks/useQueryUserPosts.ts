import {
    useInfiniteQuery, UseInfiniteQueryResult, useQuery, UseQueryResult,
} from 'react-query';
import axios from 'axios';
import { PostModel } from '../types/posts';

const apiUrl = 'http://localhost:3000';
const limit = 10;

export type FetchUserPostsResponse = PostModel[];

const fetchUserPosts = async ({ userId, pageParam = 0 }): Promise<FetchUserPostsResponse> => {
    const response = await axios.get<FetchUserPostsResponse>(`${apiUrl}/posts/user-posts/${userId}`, {
        params: { offset: pageParam, limit },
    });

    return response.data;
};

export const useQueryUserPosts = (userId: string): UseQueryResult<PostModel[], Error> => useQuery(['userPosts', userId], () => fetchUserPosts({ userId }));

export const useInfiniteQueryUserPosts = (userId: string): UseInfiniteQueryResult<FetchUserPostsResponse, Error> => useInfiniteQuery(['userPosts', userId], ({ pageParam = 0 }) => fetchUserPosts({ userId, pageParam }), {
    getNextPageParam: (lastPage, allPages) => {
        if (lastPage.length < limit) {
            return undefined;
        }
        const nextOffset = allPages.length * limit;

        return nextOffset;
    },
});
