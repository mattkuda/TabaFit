import {
    useInfiniteQuery, UseInfiniteQueryResult, useQuery, UseQueryResult,
} from 'react-query';
import axios from 'axios';
import { TabataWorkoutWithUserInfo } from '../types/workouts';
import { PagingParams } from '../types/common';

const apiUrl = process.env.EXPO_PUBLIC_EAS_API_BASE_URL || 'http://localhost:3000';
const limit = 10; // Define the limit consistently

export type FetchWorkoutsResponse = TabataWorkoutWithUserInfo[];

const fetchMySavedWorkouts = async ({ offset = 0 }: PagingParams): Promise<FetchWorkoutsResponse> => {
    try {
        const response = await axios.get<FetchWorkoutsResponse>(`${apiUrl}/workouts/my-saved`, {
            params: { offset, limit },
        });

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data.message || 'An error occurred while fetching my saved workouts');
        }
        throw new Error('An error occurred while fetching my saved workouts');
    }
};

export const useQueryMySavedWorkouts = (pagingParams?: PagingParams): UseQueryResult<TabataWorkoutWithUserInfo[], Error> => useQuery([
    'my-saved-workouts', pagingParams], () => fetchMySavedWorkouts(pagingParams));

export const useInfiniteQueryMySavedWorkouts = (): UseInfiniteQueryResult<FetchWorkoutsResponse, Error> => useInfiniteQuery(
    ['my-saved-workouts'],
    ({ pageParam = { offset: 0, limit: 0 } }) => fetchMySavedWorkouts(pageParam),
    {
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length < limit) {
                return undefined;
            }
            return allPages.length * limit;
        },
    },
);

const fetchMyCreatedWorkouts = async ({ offset = 0 }: PagingParams): Promise<FetchWorkoutsResponse> => {
    try {
        const response = await axios.get<FetchWorkoutsResponse>(`${apiUrl}/workouts/my-created`, {
            params: { offset, limit },
        });

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data.message || 'An error occurred while fetching my created workouts');
        }
        throw new Error('An error occurred while fetching my created workouts');
    }
};

export const useQueryMyCreatedWorkouts = (pagingParams?: PagingParams): UseQueryResult<TabataWorkoutWithUserInfo[], Error> => useQuery([
    'my-created-workouts', pagingParams], () => fetchMyCreatedWorkouts(pagingParams));

export const useInfiniteQueryMyCreatedWorkouts = (): UseInfiniteQueryResult<FetchWorkoutsResponse, Error> => useInfiniteQuery(
    ['my-created-workouts'],
    ({ pageParam = { offset: 0, limit: 0 } }) => fetchMyCreatedWorkouts(pageParam),
    {
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length < limit) {
                return undefined;
            }
            return allPages.length * limit;
        },
    },
);
