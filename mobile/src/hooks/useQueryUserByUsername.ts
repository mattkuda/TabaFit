import { useQuery, UseQueryResult } from 'react-query';
import axios from 'axios';
import { UserFullInfoModel } from '../types/users';

const apiUrl = 'http://localhost:3000';

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
    ['userByUsername', username],
    () => fetchUserInfoByUsername(username),
    { enabled: !!username },
);
