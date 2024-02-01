import {
    UseQueryResult, useQuery, useInfiniteQuery, UseInfiniteQueryResult,
} from 'react-query';
import axios from 'axios';
import { User } from '../types/users';
import { PagingParams } from '../types/common';

const apiUrl = 'http://localhost:3000';
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

const fetchFollowing = async ({ offset = 0, limit }: PagingParams, userId, followeeId): Promise<User[]> => {
    const response = await axios.get(`${apiUrl}/follows/${userId}/following`, {
        params: { followeeId: followeeId || undefined, offset, limit: limit || defaultLimit },
    });

    return response.data;
};

export const useQueryFollowing = (userId, followeeId, pagingParams?: PagingParams): UseQueryResult<User[], Error> => useQuery(['followingStatus', userId, followeeId, pagingParams], () => fetchFollowing(userId, followeeId, pagingParams));

export const useInfiniteQueryFollowing = (userId, followeeId?): UseInfiniteQueryResult<User[], Error> => useInfiniteQuery(['following', userId, followeeId], ({ pageParam = { offset: 0, limit: 0 } }) => fetchFollowing(pageParam, userId, followeeId), {
    getNextPageParam: (lastPage, allPages) => (lastPage.length < defaultLimit
        ? undefined : allPages.length * defaultLimit),
});
