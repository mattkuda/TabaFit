import { UseQueryResult, useQuery } from 'react-query';
import axios from 'axios';
import { TabataWorkout } from '../types/workouts';

const apiUrl = 'http://localhost:3000';

const fetchWorkoutById = async (workoutId: string): Promise<TabataWorkout> => {
    const response = await axios.get(`${apiUrl}/workouts//workout/${workoutId}`);

    return response.data;
};

export const useQueryWorkoutById = (workoutId: string): UseQueryResult<TabataWorkout, Error> => useQuery(['workout', workoutId], () => fetchWorkoutById(workoutId), {
    enabled: !!workoutId,
});
