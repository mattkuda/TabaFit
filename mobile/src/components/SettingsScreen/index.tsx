import {
    Modal, Button, Text,
    Icon,
    HStack,
} from 'native-base';
import React, { useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
// eslint-disable-next-line import/no-unresolved
import { ProfileStackParamList } from 'src/navigation/navigationTypes';
import { Linking, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMutateDeleteAccount } from '../../mutations/profileMutations';
import { useAuth } from '../../context/AuthContext';
import { version } from '../../../package.json';
import { GradientVStack } from '../common/GradientVStack';

type SettingsScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'SettingsScreen'>;
// type SettingsScreenRouteProp = RouteProp<ProfileStackParamList, 'SettingsScreen'>;

interface SettingsScreenProps {
    navigation: SettingsScreenNavigationProp;
    // route: SettingsScreenRouteProp;

}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
    // const { user } = route.params;
    const deleteAccountMutation = useMutateDeleteAccount();
    const [showModal, setShowModal] = useState(false);
    const { onLogout, authState: { userId } } = useAuth();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogout = async (): Promise<void> => {
        try {
            await onLogout();
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const handleDeleteAccount = async (): Promise<void> => {
        deleteAccountMutation.mutate({
            userId: userId.toString(),
        }, { onSuccess: () => navigation.goBack() });
        await onLogout();
        setShowModal(false);
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleAboutTabaFit = (): void => {
        navigation.navigate('AboutScreen');
    };

    const handleSubmitFeedback = (): void => {
        // TODO: Change the URL to your Google Form URL
        Linking.openURL('https://forms.gle/q6caxGtoJNtAYX5JA');
    };

    const handlePreferences = (): void => {
        navigation.navigate('PreferencesScreen');
    };

    return (
        <GradientVStack height="100%" justifyContent="flex-start" style={{ padding: 20, gap: 8 }}>
            {/* Disbale for now. Consider keeping here vs on main profile page.  */}
            {/* <TouchableOpacity
                style={{
                    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                }}
                onPress={handleEditProfile}
            >
                <Ionicons color="primary" name="person" size={24} />
                <Text color="primary" textAlign="left">Edit Profile</Text>
                <Icon as={Ionicons} color="primary" name="chevron-forward" />
            </TouchableOpacity> */}
            <TouchableOpacity
                style={{
                    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                }}
                onPress={handlePreferences}
            >
                <HStack alignItems="center" space="2">
                    <Icon as={Ionicons} color="primary" name="options" />
                    <Text color="primary" textAlign="left">Preferences</Text>
                </HStack>
                <Icon as={Ionicons} color="primary" name="chevron-forward" />
            </TouchableOpacity>
            <TouchableOpacity
                style={{
                    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                }}
                onPress={handleAboutTabaFit}
            >
                <HStack alignItems="center" space="2">
                    {/* eslint-disable-next-line dot-notation */}
                    <Icon as={Ionicons} color="primary" name="information-circle" />
                    <Text color="primary" textAlign="left">About TabaFit</Text>
                </HStack>
                <Icon as={Ionicons} color="primary" name="chevron-forward" />
            </TouchableOpacity>
            <TouchableOpacity
                style={{
                    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                }}
                onPress={handleSubmitFeedback}
            >
                <HStack alignItems="center" space="2">
                    {/* eslint-disable-next-line dot-notation */}
                    <Icon as={Ionicons} color="primary" name="chatbox-ellipses" />
                    <Text color="primary" textAlign="left">Submit Feedback</Text>
                </HStack>
                <Icon as={Ionicons} color="primary" name="chevron-forward" />
            </TouchableOpacity>
            <TouchableOpacity
                style={{
                    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                }}
                onPress={(): void => setShowLogoutModal(true)}
            >
                <HStack alignItems="center" space="2">
                    {/* eslint-disable-next-line dot-notation */}
                    <Icon as={Ionicons} color="red.500" name="log-out" />
                    <Text color="red.500" textAlign="left">Logout</Text>
                </HStack>
                <Icon as={Ionicons} color="red.500" name="chevron-forward" />
            </TouchableOpacity>
            <Text color="white" textAlign="center">
                {`TabaFit Version: ${version}`}
            </Text>
            <Text color="white" textAlign="center">
                {`Environment: ${process.env.EXPO_PUBLIC_ENVIRONMENT}`}
            </Text>
            <TouchableOpacity
                style={{
                    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                }}
                onPress={(): void => setShowModal(true)}
            >
                <HStack alignItems="center" space="2">
                    <Icon as={Ionicons} color="red.500" name="trash" />
                    <Text color="red.500" textAlign="left">Delete Account</Text>
                </HStack>
                <Icon as={Ionicons} color="red.500" name="chevron-forward" />
            </TouchableOpacity>
            <Modal isOpen={showLogoutModal} size="xl" onClose={(): void => setShowLogoutModal(false)}>
                <Modal.Content backgroundColor="gray9">
                    {/* @ts-expect-error */}
                    <Modal.Body backgroundColor="gray.900" gap="4" p="8">
                        <Text bold fontSize="lg" justifyContent="center" textAlign="center">
                            Log out?
                        </Text>
                        <Text textAlign="center">Are you sure you want to log out of your account?</Text>
                    </Modal.Body>
                    <Modal.Footer backgroundColor="gray.900" borderTopColor="gray.600" justifyContent="center" p={2}>
                        <Button colorScheme="danger" variant="ghost" onPress={handleLogout}>Log out</Button>
                    </Modal.Footer>
                    <Modal.Footer backgroundColor="gray.900" borderTopColor="gray.600" justifyContent="center" p={2}>
                        <Button colorScheme="secondary" variant="ghost" onPress={(): void => setShowLogoutModal(false)}>Cancel</Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
            <Modal isOpen={showModal} size="xl" onClose={(): void => setShowModal(false)}>
                <Modal.Content backgroundColor="gray9">
                    {/* @ts-expect-error */}
                    <Modal.Body backgroundColor="gray.900" gap="4" p="8">
                        <Text bold fontSize="lg" justifyContent="center" textAlign="center">
                            Delete Account?
                        </Text>
                        <Text textAlign="center">Are you sure you want to delete your account? This cannot be undone.</Text>
                    </Modal.Body>
                    <Modal.Footer backgroundColor="gray.900" borderTopColor="gray.600" justifyContent="center" p={2}>
                        <Button colorScheme="danger" variant="ghost" onPress={handleDeleteAccount}>Delete</Button>
                    </Modal.Footer>
                    <Modal.Footer backgroundColor="gray.900" borderTopColor="gray.600" justifyContent="center" p={2}>
                        <Button colorScheme="secondary" variant="ghost" onPress={(): void => setShowModal(false)}>Cancel</Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>

        </GradientVStack>
    );
};
