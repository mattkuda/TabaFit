import {
    UseQueryResult, useQuery, useInfiniteQuery, UseInfiniteQueryResult,
} from 'react-query';
import axios from 'axios';
import { User } from '../types/users';
import { PagingParams } from '../types/common';

const apiUrl = process.env.EAS_API_BASE_URL || 'http://localhost:3000';
const defaultLimit = 10;

const fetchFollowers = async ({ offset = 0, limit }: PagingParams, userId, followerId): Promise<User[]> => {
    const response = await axios.get(`${apiUrl}/follows/${userId}/followers`, {
        params: { followerId: followerId || undefined, offset, limit: limit || defaultLimit },

    });

    return response.data;
};

export const useInfiniteQueryFollowers = (userId, followerId?): UseInfiniteQueryResult<User[], Error> => useInfiniteQuery(['followers', userId, followerId], ({ pageParam = { offset: 0, limit: 0 } }) => fetchFollowers(pageParam, userId, followerId), {
    getNextPageParam: (lastPage, allPages) => (lastPage.length < defaultLimit
        ? undefined : allPages.length * defaultLimit),
});

const fetchFollowing = async (
    { offset = 0, limit }: PagingParams,
    userId: string,
    followeeId: string,
): Promise<User[]> => {
    const response = await axios.get(`${apiUrl}/follows/${userId}/following`, {
        params: { followeeId, offset, limit: limit || defaultLimit },
    });

    return response.data;
};

export const useQueryFollowing = (
    userId: string,
    followeeId: string,
    pagingParams?: Partial<PagingParams>,
): UseQueryResult<User[], Error> => {
    const { offset = 0, limit } = pagingParams || {}; // Add default values for offset and limit

    return useQuery(['followingStatus', userId, followeeId, pagingParams], () => fetchFollowing({ offset, limit }, userId, followeeId)); // Pass the modified pagingParams to fetchFollowing
};

export const useInfiniteQueryFollowing = (userId, followeeId?): UseInfiniteQueryResult<User[], Error> => useInfiniteQuery(['following', userId, followeeId], ({ pageParam = { offset: 0, limit: 0 } }) => fetchFollowing(pageParam, userId, followeeId), {
    getNextPageParam: (lastPage, allPages) => (lastPage.length < defaultLimit
        ? undefined : allPages.length * defaultLimit),
});
