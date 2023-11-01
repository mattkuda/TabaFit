import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    VStack, Box, Text, Input, FlatList,
} from 'native-base';
import { User } from '../../types/users';
import { useQueryPosts } from '../../hooks/useQueryPosts';
import { useSearchUsers } from '../../hooks/useSearchUsers'; // Import the new hook
import { useAuth } from '../../context/AuthContext';

export const Home = (): JSX.Element => {
    const [token, setToken] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>(''); // State to hold the search query
    const { data: postData } = useQueryPosts();
    const { data: userData } = useSearchUsers(searchQuery); // Use the new hook with the search query
    const { authState: authenticated } = useAuth();

    useEffect(() => {
        const fetchToken = async (): Promise<void> => {
            try {
                const storedToken = await AsyncStorage.getItem('token');

                if (storedToken) {
                    setToken(storedToken);
                }
            } catch (error) {
                console.error('Failed to fetch token:', error);
            }
        };

        fetchToken();
    }, []);

    return (
        <Box flex={1} justifyContent="center">
            <VStack alignItems="center" space={4}>
                <Text fontSize="5xl">Abcountable</Text>
                <Input
                    placeholder="Search for users..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <FlatList
                    data={userData}
                    // eslint-disable-next-line no-underscore-dangle
                    keyExtractor={(item: User): string => item._id.toString()}
                    renderItem={({ item }): JSX.Element => <Text>{item.username}</Text>}
                />
                <Text>TODO: Home Feed</Text>
                <Text>
                    {JSON.stringify(postData)}
                </Text>
                <Text>
                    Token:
                    {' '}
                    {token}
                    authenticated
                    {authenticated ? 'y' : 'n'}
                </Text>
            </VStack>
        </Box>
    );
};
