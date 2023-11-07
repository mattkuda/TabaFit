import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    VStack, Box, Text, Icon, IconButton,
} from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useQueryPostsFollowing } from '../../hooks/useQueryPostsFollowing';
import { SearchScreenNavigationProp } from '../../navigation/navigationTypes';
import { useQueryPosts } from '../../hooks/useQueryPosts';
import { useAuth } from '../../context/AuthContext';

export const HomePage = (): JSX.Element => {
    const [token, setToken] = useState<string>('');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data: postData2 } = useQueryPosts();
    const { data: postData } = useQueryPostsFollowing();

    const { authState: authenticated } = useAuth();
    const navigation = useNavigation<SearchScreenNavigationProp>();

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
            {/* <CustomHeader /> */}
            <VStack alignItems="center" space={4}>
                <Text fontSize="5xl">Abcountable</Text>
                <Text>TODO: Home Feed</Text>
                <IconButton
                    _icon={{
                        color: 'primary.500',
                        size: 'md',
                    }}
                    borderRadius="full"
                    icon={<Icon as={Ionicons} name="search-outline" size="sm" />}
                    onPress={(): void => navigation.navigate('Search')}
                />
                <Text>
                    {JSON.stringify(postData)}
                </Text>
                <Text>
                    Token:
                    {' '}
                    {token}
                    authenticated:
                    {authenticated ? ' y' : ' n'}
                </Text>
            </VStack>
        </Box>
    );
};
