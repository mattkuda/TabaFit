// screens/SearchPage.tsx
import React, { useState } from 'react';
import {
    Box, Input, FlatList, Text,
} from 'native-base';
import { useSearchUsers } from '../../hooks/useSearchUsers'; // Make sure to create this hook
import { User } from '../../types/users';

export const SearchPage = (): JSX.Element => {
    const [searchQuery, setSearchQuery] = useState('');
    const { data: users, isLoading } = useSearchUsers(searchQuery);

    return (
        <Box flex={1} p="5">
            <Input
                autoCapitalize="none"
                placeholder="Search for users..."
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            {isLoading ? (
                <Text>Loading...</Text>
            ) : (
                <FlatList
                    data={users}
                    // eslint-disable-next-line no-underscore-dangle
                    keyExtractor={(item: User): string => item._id.toString()}
                    renderItem={({ item }): JSX.Element => <Text>{item.username}</Text>}
                />
            )}
        </Box>
    );
};
