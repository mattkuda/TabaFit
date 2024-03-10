import React from 'react';
import {
    Box, Button, ScrollView, VStack, Text, Icon,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons'; // Assuming you're using Expo
import { useSetRecoilState } from 'recoil';
// import { useSaveAll } from '../../mutations/followMutations';
import { useAuth } from '../../context/AuthContext';
import { wizardTodoState } from '../../atoms/wizardTodoAtom';

export const SuggestedWorkoutsScreen = (): JSX.Element => {
    const setWizardTodo = useSetRecoilState(wizardTodoState);
    const { authState } = useAuth();
    const userId = authState?.userId;

    console.log('userId', userId);

    const handleSaveAll = (): void => {
        // if (userId) {
        //     followAllMutation.mutate({ followerId: userId });
        // }
    };

    return (
        <ScrollView bg="white">
            <VStack mt="5" px="4" space={4}>
                <Button
                    colorScheme="primary"
                    isLoading={false}
                    leftIcon={(
                        <Icon
                            as={MaterialIcons}
                            color={false ? 'green.500' : 'white'}
                            name={false ? 'check' : 'add'}
                            size="sm"
                        />
                      )}
                    variant="solid"
                    onPress={handleSaveAll}
                >
                    Save All
                </Button>
                <Box>
                    <Text bold fontSize="xl" mb="4">
                        Suggested workouts
                    </Text>
                    {/* ConnectionCard components */}
                </Box>
                <Button onPress={(): void => setWizardTodo(false)}>Done</Button>
            </VStack>
        </ScrollView>
    );
};
