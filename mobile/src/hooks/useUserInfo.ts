import { useQuery, UseQueryResult } from 'react-query';
import axios from 'axios';
import { UserFullInfoModel } from '../types/users';
import { useAuth } from '../context/AuthContext';

const apiUrl = process.env.EXPO_PUBLIC_EAS_API_BASE_URL || 'http://localhost:3000';

const fetchUserInfo = async (userId: string): Promise<UserFullInfoModel> => {
    try {
        const response = await axios.get(`${apiUrl}/users/${userId}`);

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data.message || 'An error occurred while fetching user info');
        }
        throw new Error('An error occurred while fetching user info');
    }
};

export const useUserInfo = (userId: string): UseQueryResult<UserFullInfoModel, Error> => useQuery(['userInfo', userId], () => fetchUserInfo(userId));

export const useWorkoutOwnership = (workoutId?: string): { isWorkoutSavedByUser, isWorkoutCreatedByUser } => {
    const { authState } = useAuth();
    const { data: userInfo } = useUserInfo(authState.userId);

    const isWorkoutSavedByUser = userInfo?.savedWorkouts?.some(
        (savedWorkout) => savedWorkout.toString() === workoutId,
    );
    const isWorkoutCreatedByUser = userInfo?.createdWorkouts?.some(
        (createdWorkout) => createdWorkout.toString() === workoutId,
    );

    return { isWorkoutSavedByUser, isWorkoutCreatedByUser };
};
