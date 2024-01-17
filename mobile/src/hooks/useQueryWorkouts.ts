import {
    useInfiniteQuery, UseInfiniteQueryResult, useQuery, UseQueryResult,
} from 'react-query';
import axios from 'axios';
import { TabataWorkoutWithUserInfo } from '../types/workouts';

const apiUrl = 'http://localhost:3000';
const limit = 10;

const fetchWorkouts = async ({ pageParam = 0 }): Promise<TabataWorkoutWithUserInfo[]> => {
    try {
        const response = await axios.get<TabataWorkoutWithUserInfo[]>(`${apiUrl}/workouts`, {
            params: { offset: pageParam, limit },
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

export const useQueryWorkouts = (): UseQueryResult<TabataWorkoutWithUserInfo[], Error> => useQuery('workouts', fetchWorkouts);

export const useInfiniteQueryWorkouts = (): UseInfiniteQueryResult<TabataWorkoutWithUserInfo[], Error> => useInfiniteQuery(
    'workouts',
    ({ pageParam = 0 }) => fetchWorkouts({ pageParam }),
    {
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length < limit) {
                return undefined; // No more pages
            }
            // Calculate the next page's offset
            return allPages.length * limit;
        },
    },
);
