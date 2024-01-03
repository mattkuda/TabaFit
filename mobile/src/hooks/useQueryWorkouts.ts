import { useQuery, UseQueryResult } from 'react-query';
import { TabataWorkoutWithUserInfo } from '../types/workouts';

const fetchWorkouts = async (): Promise<TabataWorkoutWithUserInfo[]> => {
    const response = await fetch('http://localhost:3000/workouts');

    if (!response.ok) {
        throw new Error('An error occurred while fetching workouts');
    }
    return response.json();
};

// TODO: Transform into querying featured workouts perhaps
export const useQueryWorkouts = (): UseQueryResult<TabataWorkoutWithUserInfo[], Error> => useQuery('workouts', fetchWorkouts);
