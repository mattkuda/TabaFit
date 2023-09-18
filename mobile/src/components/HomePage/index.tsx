import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    VStack, Box, Text,
} from 'native-base';
import { useQueryPosts } from '../../hooks/useQueryPosts';
import { useAuth } from '../../context/AuthContext';

export const Home = (): JSX.Element => {
    const [token, setToken] = useState<string>('');
    const { data } = useQueryPosts();
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
                <Text>TODO: Home Feed</Text>
                <Text>
                    {JSON.stringify(data)}
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
