import { useQuery, UseQueryResult } from 'react-query';
import { User } from '../types/users';

const fetchUsers = async (query: string): Promise<User[]> => {
    const response = await fetch(`http://localhost:3000/users/search/${query}`);

    if (!response.ok) {
        throw new Error('An error occurred while searching for users');
    }
    return response.json();
};

export const useSearchUsers = (query: string): UseQueryResult<User[], Error> => useQuery(['users', query], () => fetchUsers(query), {
    enabled: !!query, // Only run the query if there's a query string
});
