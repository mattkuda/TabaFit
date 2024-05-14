import {
    useInfiniteQuery, UseInfiniteQueryResult, useQuery, UseQueryResult,
} from 'react-query';
import axios from 'axios';
import { TabataWorkoutWithUserInfo } from '../types/workouts';
import { PagingParams } from '../types/common';

const apiUrl = process.env.EAS_API_BASE_URL || 'http://localhost:3000';
const defaultLimit = 10;

const fetchPremadeWorkouts = async ({ offset = 0, limit }: PagingParams): Promise<TabataWorkoutWithUserInfo[]> => {
    try {
        const response = await axios.get<TabataWorkoutWithUserInfo[]>(`${apiUrl}/premade-workouts`, {
            params: { offset, limit: limit || defaultLimit },
        });

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data.message || 'An error occurred while fetching workouts');
        }
        throw new Error('An error occurred while fetching premade workouts');
    }
};
// TODO: Transform into querying featured workouts perhaps

export const useQueryPremadeWorkouts = (pagingParams?: PagingParams): UseQueryResult<TabataWorkoutWithUserInfo[], Error> => useQuery([
    'premade-workouts', pagingParams], () => fetchPremadeWorkouts(pagingParams));

export const useInfiniteQueryPremadeWorkouts = (): UseInfiniteQueryResult<TabataWorkoutWithUserInfo[], Error> => useInfiniteQuery(
    'remade-workouts',
    ({ pageParam = { offset: 0, limit: 0 } }) => fetchPremadeWorkouts(pageParam),
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
