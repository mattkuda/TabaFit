import { UseQueryResult, useQuery } from 'react-query';
import axios from 'axios';
import { TabataWorkoutWithUserInfo } from '../types/workouts';

const apiUrl = process.env.EAS_API_BASE_URL || 'http://localhost:3000';

const fetchWorkoutById = async (workoutId: string): Promise<TabataWorkoutWithUserInfo> => {
    const response = await axios.get(`${apiUrl}/workouts/workout/${workoutId}`);

    return response.data;
};

export const useQueryWorkoutById = (workoutId: string): UseQueryResult<TabataWorkoutWithUserInfo, Error> => useQuery(['workout', workoutId], () => fetchWorkoutById(workoutId), {
    enabled: !!workoutId,
});
