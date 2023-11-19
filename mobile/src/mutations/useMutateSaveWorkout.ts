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
