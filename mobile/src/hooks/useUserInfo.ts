import { useQuery, UseQueryResult } from 'react-query';
import axios from 'axios';
import { User } from '../types/users';

const apiUrl = 'http://localhost:3000';

const fetchUserInfo = async (userId: string): Promise<User> => {
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

export const useUserInfo = (userId: string): UseQueryResult<User, Error> => useQuery(['userInfo', userId], () => fetchUserInfo(userId));
