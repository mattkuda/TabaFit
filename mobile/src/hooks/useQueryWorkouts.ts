import {
    useInfiniteQuery, UseInfiniteQueryResult, useQuery, UseQueryResult,
} from 'react-query';
import axios from 'axios';
import { TabataWorkoutWithUserInfo } from '../types/workouts';
import { PagingParams } from '../types/common';

const apiUrl = 'http://localhost:3000';
const defaultLimit = 10;

const fetchWorkouts = async ({ offset = 0, limit }: PagingParams): Promise<TabataWorkoutWithUserInfo[]> => {
    try {
        const response = await axios.get<TabataWorkoutWithUserInfo[]>(`${apiUrl}/workouts`, {
            params: { offset, limit: limit || defaultLimit },
        });

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data.message || 'An error occurred while fetching workouts');
        }
        throw new Error('An error occurred while fetching workouts');
    }
};
// TODO: Transform into querying featured workouts perhaps

export const useQueryWorkouts = (pagingParams?: PagingParams): UseQueryResult<TabataWorkoutWithUserInfo[], Error> => useQuery([
    'workouts', pagingParams], () => fetchWorkouts(pagingParams));

export const useInfiniteQueryWorkouts = (): UseInfiniteQueryResult<TabataWorkoutWithUserInfo[], Error> => useInfiniteQuery(
    'workouts',
    ({ pageParam = { offset: 0, limit: 0 } }) => fetchWorkouts(pageParam),
    {
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length < defaultLimit) {
                return undefined; // No more pages
            }
            // Calculate the next page's offset
            return allPages.length * defaultLimit;
        },
    },
);

const fetchSuggestedWorkouts = async (): Promise<TabataWorkoutWithUserInfo[]> => {
    try {
        const response = await axios.get<TabataWorkoutWithUserInfo[]>(`${apiUrl}/workouts/suggested`, {
        });

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data.message || 'An error occurred while fetching suggested workouts');
        }
        throw new Error('An error occurred while fetching suggested workouts');
    }
};
// TODO: Transform into querying featured workouts perhaps

export const useQuerySuggestedWorkouts = (pagingParams?: PagingParams): UseQueryResult<TabataWorkoutWithUserInfo[], Error> => useQuery([
    'suggested-workouts', pagingParams], () => fetchSuggestedWorkouts());
