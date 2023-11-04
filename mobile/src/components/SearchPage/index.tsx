// screens/SearchPage.tsx
import React, { useState } from 'react';
import {
    Box, Input, FlatList, Text,
    Pressable,
} from 'native-base';
import { Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ProfilePageScreenNavigationProp } from '../../types/navigationTypes';
import { useSearchUsers } from '../../hooks/useSearchUsers'; // Make sure to create this hook
import { User } from '../../types/users';

export const SearchPage = (): JSX.Element => {
    const [searchQuery, setSearchQuery] = useState('');
    const { data: users, isLoading } = useSearchUsers(searchQuery);
    const navigation = useNavigation<ProfilePageScreenNavigationProp>(); // Use the hook to get the navigation object

    const handlePressUser = (username: string): void => {
        // Navigate to the ProfilePage with the userId as a parameter
        navigation.navigate('Profile', { username });
    };

    return (
        <Box flex={1} p="5">
            <Button title="Go Back" onPress={(): void => navigation.goBack()} />
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
                    renderItem={({ item }): JSX.Element => (
                        // eslint-disable-next-line no-underscore-dangle
                        <Pressable onPress={(): void => handlePressUser(item.username)}>
                            <Text>
                                {item?.firstName}
                                {' '}
                                {item?.lastName}
                                {' '}
                                @
                                {item.username}
                            </Text>
                        </Pressable>
                    )}
                />
            )}
        </Box>

    );
};
