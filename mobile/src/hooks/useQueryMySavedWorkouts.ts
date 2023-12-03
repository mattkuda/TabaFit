import { useQuery, UseQueryResult } from 'react-query';
import axios from 'axios';
import { TabataWorkout } from '../types/workouts';

const apiUrl = 'http://localhost:3000';

const fetchMySavedWorkouts = async (): Promise<TabataWorkout[]> => {
    try {
        const response = await axios.get(`${apiUrl}/workouts/my-saved`);

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data.message || 'An error occurred while my saved workouts');
        }
        throw new Error('An error occurred while fetching my saved workouts');
    }
};

export const useQueryMySavedWorkouts = (): UseQueryResult<TabataWorkout[], Error> => useQuery('my-saved-workouts', fetchMySavedWorkouts);
