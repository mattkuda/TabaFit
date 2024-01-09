import { useQuery, UseQueryResult } from 'react-query';
import axios from 'axios';
import { TabataWorkoutWithUserInfo } from '../types/workouts';

const apiUrl = 'http://localhost:3000';

const fetchWorkouts = async (): Promise<TabataWorkoutWithUserInfo> => {
    try {
        const response = await axios.get(`${apiUrl}/workouts`);

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
