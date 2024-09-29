/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import {
    Input, FlatList, Icon, Spinner, Box,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useSearchUsers } from '../../hooks/useSearchUsers';
import { User } from '../../types/users';
import { ConnectionCard } from '../ConnectionsScreen/ConnectionCard';
import { GradientVStack } from '../common/GradientVStack';
import { EmptyState } from '../EmptyState';

export const SearchPage = (): JSX.Element => {
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
    const { data: users, isLoading } = useSearchUsers(debouncedQuery);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 500); // 500ms delay

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery]);

    const shouldShowNoUsers = !isLoading && debouncedQuery.length > 0 && users?.length === 0;

    return (
        <GradientVStack
            backgroundColor="gray9"
            flex={1}
            space={0}
            width="100%"
        >
            <Input
                fontSize="md"
                InputLeftElement={<Icon as={Ionicons} ml={4} name="search-outline" size="sm" />}
                m="4"
                placeholder="Search for users"
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            {isLoading ? (
                <Box alignContent="center" justifyContent="center" p="4">
                    <Spinner accessibilityLabel="Loading more items" color="white" />
                </Box>
            ) : (
                <FlatList
                    data={users}
                    keyExtractor={(item: User): string => item._id.toString()}
                    ListEmptyComponent={shouldShowNoUsers ? <EmptyState text="No users found" /> : null}
                    renderItem={({ item }): JSX.Element => (
                        <ConnectionCard user={item} />
                    )}
                />
            )}
        </GradientVStack>
    );
};
