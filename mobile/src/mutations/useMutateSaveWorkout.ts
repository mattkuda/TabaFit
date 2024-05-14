import { useMutation, UseMutationResult } from 'react-query';
import axios, { AxiosError } from 'axios';
import { TabataWorkout } from '../types/workouts';

const apiUrl = process.env.EAS_API_BASE_URL || 'http://localhost:3000';

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

interface UpdateWorkoutVariables {
    workoutId: string;
    workout: TabataWorkout;
}

export const useMutateUpdateWorkout = (): UseMutationResult<void, AxiosError, UpdateWorkoutVariables> => useMutation<void, AxiosError, UpdateWorkoutVariables>(
    ({ workoutId, workout }) => axios.put(`${apiUrl}/workouts/${workoutId}`, workout),
    {
        onError: (error) => {
            console.error('Error updating workout', error.message);
        },
        // You can add onSuccess here to refetch queries or update the UI accordingly
    },
);

export const useMutateSaveAllSuggestedWorkout = (): UseMutationResult<void, AxiosError> => useMutation<void, AxiosError>(() => axios.post(`${apiUrl}/workouts/saveAllSuggested`), {});
