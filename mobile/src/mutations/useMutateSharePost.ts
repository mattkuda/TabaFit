import { useMutation, UseMutationResult } from 'react-query';
import axios, { AxiosError } from 'axios';
import { TabataWorkout } from '../types/workouts'; // Import your Workout type

const apiUrl = 'http://localhost:3000';

interface ShareWorkoutVariables {
    userId: string;
    workout: TabataWorkout;
    title: string;
    description: string;
}

export const useMutateShareWorkout = (): UseMutationResult<void, AxiosError, ShareWorkoutVariables> => useMutation<void, AxiosError, ShareWorkoutVariables>(
    ({
        userId, workout, title, description,
    }) => axios.post(`${apiUrl}/posts/share`, {
        userId, workout, title, description,
    }),
);
