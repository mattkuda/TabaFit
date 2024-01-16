import {
    useInfiniteQuery, UseInfiniteQueryResult, useQuery, UseQueryResult,
} from 'react-query';
import axios from 'axios';
import { TabataWorkoutWithUserInfo } from '../types/workouts';
import { PagingParams } from '../types/common';

const apiUrl = 'http://localhost:3000';
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
