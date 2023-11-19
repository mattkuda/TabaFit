import { useQuery, UseQueryResult } from 'react-query';
import { TabataWorkout } from '../types/workouts';

const fetchWorkouts = async (): Promise<TabataWorkout[]> => {
    const response = await fetch('http://localhost:3000/workouts');

    if (!response.ok) {
        throw new Error('An error occurred while fetching workouts');
    }
    return response.json();
};

export const useQueryWorkouts = (): UseQueryResult<TabataWorkout[], Error> => useQuery('workouts', fetchWorkouts);
