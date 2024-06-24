import { useMutation, UseMutationResult } from 'react-query';
import axios, { AxiosError } from 'axios';
import { TabataWorkout } from '../types/workouts';

const apiUrl = process.env.EXPO_PUBLIC_EAS_API_BASE_URL || 'http://localhost:3000';

interface CreateWorkoutVariables {
    workout: TabataWorkout;
}

export const useCreateWorkout = (): UseMutationResult<void, AxiosError, CreateWorkoutVariables> => useMutation<void, AxiosError, CreateWorkoutVariables>(
    ({ workout }) => (
        axios.post(`${apiUrl}/workouts/create`, { workout })),
);

interface SaveWorkoutVariables {
    workout: TabataWorkout;
}
export const useSaveWorkout = (): UseMutationResult<void, AxiosError, SaveWorkoutVariables> => useMutation<void, AxiosError, SaveWorkoutVariables>(
    ({ workout }) => (
        axios.post(`${apiUrl}/workouts/save`, { workout })),
);

interface DeleteWorkoutVariables {
    workoutId: string;
}

export const useDeleteWorkout = (): UseMutationResult<void, AxiosError, DeleteWorkoutVariables> => useMutation<void, AxiosError, DeleteWorkoutVariables>(
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

export const useUpdateWorkout = (): UseMutationResult<void, AxiosError, UpdateWorkoutVariables> => useMutation<void, AxiosError, UpdateWorkoutVariables>(
    ({ workoutId, workout }) => axios.put(`${apiUrl}/workouts/${workoutId}`, workout),
    {
        onError: (error) => {
            console.error('Error updating workout', error.message);
        },
        // You can add onSuccess here to refetch queries or update the UI accordingly
    },
);

export const useSaveAllSuggestedWorkouts = (): UseMutationResult<void, AxiosError> => useMutation<void, AxiosError>(() => axios.post(`${apiUrl}/workouts/saveAllSuggested`), {});
