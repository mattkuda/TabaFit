import { useQuery, UseQueryResult } from 'react-query';
import { User } from '../types/users';

const fetchUserInfo = async (userId: string): Promise<User> => {
    const response = await fetch(`http://localhost:3000/users/${userId}`);

    if (!response.ok) {
        throw new Error('An error occurred while fetching user info');
    }
    return response.json();
};

export const useUserInfo = (userId: string): UseQueryResult<User, Error> => useQuery(['userInfo', userId], () => fetchUserInfo(userId));
