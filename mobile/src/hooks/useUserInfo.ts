import { useQuery, UseQueryResult } from 'react-query';
import { User } from '../types/users';

const fetchUserInfo = async (username: string): Promise<User> => {
    console.log('In here fetch user info');
    const response = await fetch(`http://localhost:3000/users/username/${username}`);

    console.log('response');
    console.log(response);

    if (!response.ok) {
        throw new Error('An error occurred while fetching user info');
    }
    return response.json();
};

export const useUserInfo = (username: string): UseQueryResult<User, Error> => useQuery(['userInfo', username], () => fetchUserInfo(username));
