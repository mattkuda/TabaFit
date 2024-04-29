import React, { useState } from 'react';
import {
    Input, FlatList, Text, VStack, Icon, Spinner, Box,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useSearchUsers } from '../../hooks/useSearchUsers'; // Make sure to create this hook
import { User } from '../../types/users';
import { ConnectionCard } from '../../ConnectionsScreen/ConnectionCard';

export const SearchPage = (): JSX.Element => {
    const [searchQuery, setSearchQuery] = useState('');
    const { data: users, isLoading } = useSearchUsers(searchQuery);
    // const navigation = useNavigation<ProfilePageScreenNavigationProp>(); // Use the hook to get the navigation object

    return (
        <VStack
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
                    ListEmptyComponent={searchQuery.length && <Text alignSelf="center" fontSize="md">No users found</Text>}
                    renderItem={({ item }): JSX.Element => (
                        <ConnectionCard user={item} />
                    )}
                />
            )}
        </VStack>

    );
};
