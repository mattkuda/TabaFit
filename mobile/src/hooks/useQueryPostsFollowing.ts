import { useInfiniteQuery, UseInfiniteQueryResult } from 'react-query';
import axios from 'axios';
import { PostModel } from '../types/posts';

const apiUrl = process.env.EXPO_PUBLIC_EAS_API_BASE_URL || 'http://localhost:3000';
const limit = 10;

// Example of infinite scrolling with React Query in React Native:
// https://levelup.gitconnected.com/react-native-infinite-scrolling-with-react-query-3c2cc69790be

export type FetchPostsResponse = PostModel[];

const fetchPostsFollowing = async ({ pageParam = 0 }): Promise<FetchPostsResponse> => {
    const response = await axios.get<FetchPostsResponse>(`${apiUrl}/posts/following-posts`, {
        params: { offset: pageParam, limit },
    });

    return response.data;
};

export const useInfiniteQueryPostsFollowing = (): UseInfiniteQueryResult<FetchPostsResponse, Error> => useInfiniteQuery<FetchPostsResponse, Error>('following-posts', fetchPostsFollowing, {
    getNextPageParam: (lastPage, allPages) => {
        // Check if the last fetched page has less than 'limit' posts. If so, no more pages are left.
        if (lastPage.length < limit) {
            return undefined;
        }
        // The next offset is the current offset plus the limit
        const nextOffset = allPages.length * limit;

        return nextOffset;
    },
});
