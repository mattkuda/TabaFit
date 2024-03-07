import React from 'react';
import { Box, Text, Button } from 'native-base';
import { useSetRecoilState } from 'recoil';
import { wizardTodoState } from '../../atoms/wizardTodoAtom';

export const WelcomeScreen = (): JSX.Element => {
    const setWizardTodo = useSetRecoilState(wizardTodoState);
    const handleContinue = async (): Promise<void> => {
        // Navigate to the Home screen
        setWizardTodo(false);
    };

    return (
        <Box flex={1} justifyContent="center">
            <Text> This is the Welcome Screen </Text>
            <Button mt="5" onPress={handleContinue}>
                Continue
            </Button>
        </Box>
    );
};
