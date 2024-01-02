import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    VStack, Box, Text,
} from 'native-base';
import { useQueryPostsFollowing } from '../../hooks/useQueryPostsFollowing';
import { useAuth } from '../../context/AuthContext';
import { PostCard } from '../common/PostCard';
import { RefreshableScrollView } from '../RefreshableScrollView';

export const HomePage = (): JSX.Element => {
    const [token, setToken] = useState<string>('');
    const { data: postData, refetch } = useQueryPostsFollowing();
    const { authState: authenticated } = useAuth();

    const onRefresh = async (): Promise<void> => {
        await refetch();
    };

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
            <RefreshableScrollView onRefresh={onRefresh}>
                <VStack alignItems="center" space={4}>
                    <Text fontSize="5xl">Abcountable</Text>
                    {postData?.map((post) => (
                        <PostCard key={post._id.toString()} post={post} />
                    ))}
                    <Text>
                        Token:
                        {' '}
                        {token}
                        {' '}
                        authenticated:
                        {' '}
                        {authenticated ? 'y' : 'n'}
                    </Text>
                </VStack>
            </RefreshableScrollView>
        </Box>
    );
};
