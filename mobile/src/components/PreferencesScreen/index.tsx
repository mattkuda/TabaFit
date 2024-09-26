import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import {
    Text, HStack, Switch, useToast, Spinner,
} from 'native-base';
import { ProfileStackParamList } from '../../navigation/navigationTypes';
import { GradientVStack } from '../common/GradientVStack';
import { useAuth } from '../../context/AuthContext';
import { useGetPreferences, useUpdatePreferences } from '../../hooks/usePreferences';

type PreferencesScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'PreferencesScreen'>;

interface PreferencesScreenProps {
    navigation: PreferencesScreenNavigationProp;
}

export const PreferencesScreen: React.FC<PreferencesScreenProps> = () => {
    const { authState } = useAuth();
    const userId = authState?.userId;
    const { data: preferences, isLoading } = useGetPreferences(userId);
    const updatePreferencesMutation = useUpdatePreferences();
    const toast = useToast();

    const handleToggle = async (): Promise<void> => {
        const newValue = !preferences?.exerciseVideosEnabled;

        try {
            await updatePreferencesMutation.mutateAsync({
                userId: userId.toString(),
                preferences: {
                    ...preferences,
                    exerciseVideosEnabled: newValue,
                },
            });
            toast.show({
                description: 'Preference updated successfully',
                bgColor: 'success',
                bottom: 30,
            });
        } catch (error) {
            console.error('Error updating preference:', error);
            toast.show({
                description: 'Failed to update preference',
                bgColor: 'red.500',
                bottom: 30,
            });
        }
    };

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <GradientVStack height="100%" justifyContent="flex-start" style={{ padding: 20 }}>
            <HStack alignItems="center" justifyContent="space-between">
                <Text color="white">Enable Exercises Video</Text>
                <Switch
                    isChecked={preferences?.exerciseVideosEnabled || false}
                    isDisabled={updatePreferencesMutation.isLoading}
                    offThumbColor="gray.200"
                    offTrackColor="gray.700"
                    size="md"
                    onThumbColor="gray.200"
                    onToggle={handleToggle}
                    onTrackColor="flame.500"
                />
            </HStack>
        </GradientVStack>
    );
};
