import { useQuery, UseQueryResult } from 'react-query';
import axios from 'axios';
import { TabataWorkout } from '../types/workouts';
import { defaultTilePagingParams, PagingParams } from '../types/common';

const apiUrl = 'http://localhost:3000';

const fetchMySavedWorkouts = async (pagingParams: PagingParams = defaultTilePagingParams): Promise<TabataWorkout[]> => {
    const { offset, limit } = pagingParams;

    try {
        const response = await axios.get(`${apiUrl}/workouts/my-saved`, {
            params: { offset, limit },
        });

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data.message || 'An error occurred while my saved workouts');
        }
        throw new Error('An error occurred while fetching my saved workouts');
    }
};

export const useQueryMySavedWorkouts = (pagingParams?: PagingParams): UseQueryResult<TabataWorkout[], Error> => useQuery([
    'my-saved-workouts', pagingParams], () => fetchMySavedWorkouts(
    pagingParams,
));
