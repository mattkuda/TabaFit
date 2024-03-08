import React from 'react';
import {
    Box, Button, ScrollView, VStack, Text,
} from 'native-base';
// import { useNavigation } from '@react-navigation/native';
// import { ConnectionCard } from '../components/ConnectionCard'; // Adjust import paths as necessary
// import { users } from '../data/users'; // Assume you have a mock data file or fetch from an API
import { useSetRecoilState } from 'recoil';
import { wizardTodoState } from '../../atoms/wizardTodoAtom';

export const SuggestedFollowsScreen = (): JSX.Element => {
    // const navigation = useNavigation();
    const setWizardTodo = useSetRecoilState(wizardTodoState);
    const handleFollowAll = (): void => {
        // Implement follow all logic here
        console.log('Following all suggested users');
        setWizardTodo(false);
    };

    return (
        <ScrollView bg="white">
            <VStack mt="5" px="4" space={4}>
                <Button colorScheme="primary" variant="solid" onPress={handleFollowAll}>
                    Follow All
                </Button>
                <Box>
                    <Text bold fontSize="xl" mb="4">
                        People You May Know
                    </Text>
                    {/* {users.map((user) => (
                        <ConnectionCard key={user._id} user={user} />
                    ))} */}
                </Box>
            </VStack>
        </ScrollView>
    );
};
