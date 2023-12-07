import { useMutation, UseMutationResult } from 'react-query';
import axios, { AxiosError } from 'axios';
import { TabataWorkout } from '../types/workouts';

const apiUrl = 'http://localhost:3000';

interface SaveWorkoutVariables {
    workout: TabataWorkout;
}

export const useMutateSaveWorkout = (): UseMutationResult<void, AxiosError, SaveWorkoutVariables> => useMutation<void, AxiosError, SaveWorkoutVariables>(
    ({ workout }) => (
        axios.post(`${apiUrl}/workouts/save`, { workout })),
);

interface DeleteWorkoutVariables {
    workoutId: string;
}

export const useMutateDeleteWorkout = (): UseMutationResult<void, AxiosError, DeleteWorkoutVariables> => useMutation<void, AxiosError, DeleteWorkoutVariables>(
    ({ workoutId }) => axios.delete(`${apiUrl}/workouts/${workoutId}`),
    {
        onError: (error) => {
            console.error('Error deleting workout', error.message);
        },
        // You can add onSuccess here to refetch queries or update the UI accordingly
    },
);
