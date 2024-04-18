import React, { useState } from 'react';
import {
    Input, FlatList, Text,
    Pressable,
    VStack,
    Icon,
} from 'native-base';
import { Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ProfilePageScreenNavigationProp } from '../../types/navigationTypes';
import { useSearchUsers } from '../../hooks/useSearchUsers'; // Make sure to create this hook
import { User } from '../../types/users';
import { formatName } from '../../util/util';

export const SearchPage = (): JSX.Element => {
    const [searchQuery, setSearchQuery] = useState('');
    const { data: users, isLoading } = useSearchUsers(searchQuery);
    const navigation = useNavigation<ProfilePageScreenNavigationProp>(); // Use the hook to get the navigation object

    const handlePressUser = (userId: string): void => {
        // Navigate to the ProfilePage with the userId as a parameter
        navigation.navigate('Profile', { userId });
    };

    return (
        <VStack
            backgroundColor="gray9"
            flex={1}
            space={0}
            width="100%"
        >
            <Button title="Go Back" onPress={(): void => navigation.goBack()} />

            <Input
                fontSize="md"
                InputLeftElement={<Icon as={Ionicons} ml={4} name="search-outline" size="sm" />}
                m="4"
                placeholder="Search for an exercise"
                value={searchQuery}
                onChangeText={setSearchQuery}

            />
            {isLoading ? (
                <Text>Loading...</Text>
            ) : (
                <FlatList
                    data={users}
                    keyExtractor={(item: User): string => item._id.toString()}
                    renderItem={({ item }): JSX.Element => (
                        <Pressable onPress={(): void => handlePressUser(item._id.toString())}>
                            <Text>{formatName(item.firstName, item.lastName)}</Text>
                        </Pressable>
                    )}
                />
            )}
        </VStack>

    );
};
