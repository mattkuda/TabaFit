import { useQuery, UseQueryResult } from 'react-query';
import axios from 'axios';
import { UserFullInfoModel } from '../types/users';

const apiUrl = process.env.EXPO_PUBLIC_EAS_API_BASE_URL || 'http://localhost:3000';

const fetchUserInfoByUsername = async (username: string): Promise<UserFullInfoModel> => {
    try {
        const response = await axios.get(`${apiUrl}/users/username/${username}`);

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data.message || 'An error occurred while fetching user info by username');
        }
        throw new Error('An error occurred while fetching user info by username');
    }
};

export const useQueryUserByUsername = (username: string): UseQueryResult<UserFullInfoModel, Error> => useQuery(
    ['userByEmail', username],
    () => fetchUserInfoByUsername(username),
    { enabled: !!username },
);

const fetchUserInfoByEmail = async (email: string): Promise<UserFullInfoModel> => {
    try {
        const response = await axios.get(`${apiUrl}/users/email/${email}`);

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data.message || 'An error occurred while fetching user info by email');
        }
        throw new Error('An error occurred while fetching user info by email');
    }
};

export const useQueryUserByEmail = (email: string): UseQueryResult<UserFullInfoModel, Error> => useQuery(
    ['userByEmail', email],
    () => fetchUserInfoByEmail(email),
    { enabled: !!email },
);

const fetchSuggestedUsers = async (): Promise<UserFullInfoModel[]> => {
    const response = await axios.get<UserFullInfoModel[]>(`${apiUrl}/users/suggested`);

    return response.data;
};

export const useQuerySuggestedUsers = (): UseQueryResult<UserFullInfoModel[], Error> => useQuery(
    'suggestedUsers',
    fetchSuggestedUsers,
);
