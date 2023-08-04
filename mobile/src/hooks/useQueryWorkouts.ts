import { useQuery, UseQueryResult } from 'react-query';
import { Workout } from '../types/workouts';

// Define the type for a workout, based on your actual data structure

const fetchWorkouts = async (): Promise<Workout[]> => {
    const response = await fetch('http://localhost:3000/workouts');

    if (!response.ok) {
        throw new Error('An error occurred while fetching workouts');
    }
    return response.json();
};

export const useQueryWorkouts = (): UseQueryResult<Workout[], Error> => useQuery('workouts', fetchWorkouts);
