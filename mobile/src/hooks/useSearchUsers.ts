import { useQuery, UseQueryResult } from 'react-query';
import axios from 'axios';
import { User } from '../types/users';

const apiUrl = process.env.EAS_API_BASE_URL || 'http://localhost:3000';

const fetchUsers = async (query: string): Promise<User[]> => {
    try {
        const response = await axios.get(`${apiUrl}/users/search/${query}`);

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data.message || 'An error occurred while searching for users');
        }
        throw new Error('An error occurred while searching for users');
    }
};

export const useSearchUsers = (query: string): UseQueryResult<User[], Error> => useQuery(['users', query], () => fetchUsers(query), {
    enabled: !!query, // Only run the query if there's a query string
});
