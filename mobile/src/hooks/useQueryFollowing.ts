// hooks/useFollowingStatus.js
import { UseQueryResult, useQuery } from 'react-query';
import axios from 'axios';
import { User } from '../types/users';

const apiUrl = 'http://localhost:3000';

const fetchFollowing = async (userId, followerId): Promise<User[]> => axios.get(`${apiUrl}/follows/${userId}/following`, {
    params: { followerId: followerId || undefined },
});

export const useQueryFollowing = (userId, followeeId): UseQueryResult<User[], Error> => useQuery(['followingStatus', userId, followeeId], () => fetchFollowing(userId, followeeId));
