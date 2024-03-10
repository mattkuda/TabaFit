import React from 'react';
import {
    Box, Button, ScrollView, VStack, Text, Icon,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons'; // Assuming you're using Expo
import { useNavigation } from '@react-navigation/native';
import { useFollowAll } from '../../mutations/followMutations';
import { useAuth } from '../../context/AuthContext';
import { SuggestedFollowsScreenNavigationProp } from '../../navigation/navigationTypes';

export const SuggestedFollowsScreen = (): JSX.Element => {
    const followAllMutation = useFollowAll();
    const { authState } = useAuth();
    const userId = authState?.userId;
    const navigation = useNavigation<SuggestedFollowsScreenNavigationProp>();
    const handleContinue = async (): Promise<void> => {
        navigation.navigate('SuggestedWorkoutsScreen');
    };
    const handleFollowAll = (): void => {
        if (userId) {
            followAllMutation.mutate({ followerId: userId });
        }
    };

    return (
        <ScrollView bg="white">
            <VStack mt="5" px="4" space={4}>
                <Button
                    colorScheme="primary"
                    isLoading={followAllMutation.isLoading}
                    leftIcon={(
                        <Icon
                            as={MaterialIcons}
                            color={followAllMutation.isSuccess ? 'green.500' : 'white'}
                            name={followAllMutation.isSuccess ? 'check' : 'add'}
                            size="sm"
                        />
                      )}
                    variant="solid"
                    onPress={handleFollowAll}
                >
                    Follow All
                </Button>
                <Box>
                    <Text bold fontSize="xl" mb="4">
                        People You May Know
                    </Text>
                    {/* ConnectionCard components */}
                </Box>
                <Button onPress={handleContinue}>Continue</Button>
            </VStack>
        </ScrollView>
    );
};
