import { useQuery, UseQueryResult } from 'react-query';
import axios from 'axios';
import { Types } from 'mongoose';
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

export const useWorkoutOwnership = (workoutId?: Types.ObjectId): { isWorkoutSavedByUser, isWorkoutCreatedByUser } => {
    const { authState } = useAuth();
    const { data: userInfo } = useUserInfo(authState.userId);

    const workoutIdStr = workoutId?.toString();

    const isWorkoutSavedByUser = userInfo?.savedWorkouts?.some(
        (savedWorkout) => savedWorkout.toString() === workoutIdStr,
    );
    const isWorkoutCreatedByUser = userInfo?.createdWorkouts?.some(
        (createdWorkout) => createdWorkout.toString() === workoutIdStr,
    );

    console.log('userInfo?.savedWorkouts', userInfo?.savedWorkouts);
    console.log('workoutIdStr', workoutIdStr);
    console.log('isWorkoutSavedByUser', isWorkoutSavedByUser);

    return { isWorkoutSavedByUser, isWorkoutCreatedByUser };
};
