import { useMutation, UseMutationResult } from 'react-query';
import axios, { AxiosError } from 'axios';
import { TabataWorkout } from '../types/workouts';

const apiUrl = process.env.EXPO_PUBLIC_EAS_API_BASE_URL || 'http://localhost:3000';

interface CreateWorkoutVariables {
    workout: TabataWorkout;
}

interface CreateWorkoutResponse {
    newWorkoutId: string;
}

export const useCreateWorkout = (): UseMutationResult<CreateWorkoutResponse, AxiosError, CreateWorkoutVariables> => useMutation<CreateWorkoutResponse, AxiosError, CreateWorkoutVariables>(
    ({ workout }) => (
        axios.post(`${apiUrl}/workouts/create`, { workout }).then((response) => response.data)),
);

interface SaveWorkoutVariables {
    workoutId: string;
}

export const useSaveWorkout = (): UseMutationResult<void, AxiosError, SaveWorkoutVariables> => useMutation<void, AxiosError, SaveWorkoutVariables>(
    ({ workoutId }) => (
        axios.post(`${apiUrl}/workouts/save`, { workoutId })),
);

interface DeleteWorkoutVariables {
    workoutId: string;
}

export const useUnsaveWorkout = (): UseMutationResult<void, AxiosError, DeleteWorkoutVariables> => useMutation<void, AxiosError, DeleteWorkoutVariables>(
    ({ workoutId }) => (
        axios.delete(`${apiUrl}/workouts/unsave/${workoutId}`)),
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

interface UpdateWorkoutResponse {
    newWorkoutId: string;
}

export const useUpdateWorkout = (): UseMutationResult<UpdateWorkoutResponse, AxiosError, UpdateWorkoutVariables> => useMutation<UpdateWorkoutResponse, AxiosError, UpdateWorkoutVariables>(
    ({ workoutId, workout }) => axios.put(`${apiUrl}/workouts/update/${workoutId}`, workout).then((response) => response.data),
    {
        onError: (error) => {
            console.error('Error updating workout', error.message);
        },
        // You can add onSuccess here to refetch queries or update the UI accordingly
    },
);

export const useSaveAllSuggestedWorkouts = (): UseMutationResult<void, AxiosError> => useMutation<void, AxiosError>(() => axios.post(`${apiUrl}/workouts/saveAllSuggested`), {});
