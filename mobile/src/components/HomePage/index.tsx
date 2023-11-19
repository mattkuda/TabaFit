import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    VStack, Box, Text, Icon, IconButton, ScrollView,
} from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { RefreshControl } from 'react-native';
import { useQueryPostsFollowing } from '../../hooks/useQueryPostsFollowing';
import { SearchScreenNavigationProp } from '../../navigation/navigationTypes';
import { useAuth } from '../../context/AuthContext';
import { PostCard } from '../common/PostCard';

export const HomePage = (): JSX.Element => {
    const [token, setToken] = useState<string>('');
    const [refreshing, setRefreshing] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data: postData, refetch } = useQueryPostsFollowing();
    const { authState: authenticated } = useAuth();
    const navigation = useNavigation<SearchScreenNavigationProp>();

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
                refreshControl={(
                    <RefreshControl
                        colors={['#9Bd35A', '#689F38']}
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                  )}
            >
                {/* <CustomHeader /> */}
                <VStack alignItems="center" space={4}>
                    <IconButton
                        _icon={{
                            color: 'primary.500',
                            size: 'md',
                        }}
                        borderRadius="full"
                        icon={<Icon as={Ionicons} name="search-outline" size="sm" />}
                        onPress={(): void => navigation.navigate('Search')}
                    />
                    <Text fontSize="5xl">Abcountable</Text>
                    {postData?.map((post) => (
                        <PostCard key={post._id.toString()} post={post} />
                    ))}
                    <Text>
                        Token:
                        {' '}
                        {token}
                        authenticated:
                        {authenticated ? ' y' : ' n'}
                    </Text>
                </VStack>
            </ScrollView>
        </Box>
    );
};
