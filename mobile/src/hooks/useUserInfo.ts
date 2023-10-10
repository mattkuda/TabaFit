import { useQuery, UseQueryResult } from 'react-query';
import { User } from '../types/users';

const fetchUserInfo = async (username: string): Promise<User> => {
    const response = await fetch(`http://localhost:3000/users/username/${username}`);

    if (!response.ok) {
        throw new Error('An error occurred while fetching user info');
    }
    return response.json();
};

export const useUserInfo = (username: string): UseQueryResult<User, Error> => useQuery(['userInfo', username], () => fetchUserInfo(username));
