import { UseQueryResult, useQuery } from 'react-query';
import axios from 'axios';
import { User } from '../types/users';

const apiUrl = 'http://localhost:3000';

const fetchFollowing = async (userId, followeeId): Promise<User[]> => {
    const response = await axios.get(`${apiUrl}/follows/${userId}/following`, {
        params: { followeeId: followeeId || undefined },
    });

    return response.data;
};

export const useQueryFollowing = (userId, followeeId): UseQueryResult<User[], Error> => useQuery(['followingStatus', userId, followeeId], () => fetchFollowing(userId, followeeId));
