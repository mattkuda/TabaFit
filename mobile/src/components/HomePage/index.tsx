import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    VStack, Box, Text, ScrollView,
} from 'native-base';
import { RefreshControl } from 'react-native';
import { useQueryPostsFollowing } from '../../hooks/useQueryPostsFollowing';
import { useAuth } from '../../context/AuthContext';
import { PostCard } from '../common/PostCard';

export const HomePage = (): JSX.Element => {
    const [token, setToken] = useState<string>('');
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const { data: postData, refetch } = useQueryPostsFollowing();
    const { authState: authenticated } = useAuth();

    const onRefresh = async (): Promise<void> => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
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
            <ScrollView
                refreshControl={<RefreshControl colors={['#9Bd35A', '#689F38']} refreshing={refreshing} onRefresh={onRefresh} />}
            >
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
            </ScrollView>
        </Box>
    );
};
