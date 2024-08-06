import { useMutation, UseMutationResult } from 'react-query';
import axios, { AxiosError } from 'axios';
import { TabataWorkout } from '../types/workouts'; // Import your Workout type

const apiUrl = process.env.EXPO_PUBLIC_EAS_API_BASE_URL || 'http://localhost:3000';

interface ShareWorkoutVariables {
    userId: string;
    workout: TabataWorkout;
    title: string;
    description: string;
    manualTabatas?: number;
}

export const useMutateShareWorkout = (): UseMutationResult<void, AxiosError, ShareWorkoutVariables> => useMutation<void, AxiosError, ShareWorkoutVariables>(
    ({
        userId, workout, title, description, manualTabatas,
    }) => axios.post(`${apiUrl}/posts/share`, {
        userId, workout, title, description, manualTabatas,
    }),
);
