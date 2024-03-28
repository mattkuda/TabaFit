import {
    Modal, VStack, Button,
} from 'native-base';
import React, { useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
// eslint-disable-next-line import/no-unresolved
import { ProfileStackParamList } from 'src/navigation/navigationTypes';
import { useMutateDeleteAccount } from '../../mutations/profileMutations';
import { useAuth } from '../../context/AuthContext';

type SettingsScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'SettingsScreen'>;

interface SettingsScreenProps {
    navigation: SettingsScreenNavigationProp;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
    const deleteAccountMutation = useMutateDeleteAccount();
    const [showModal, setShowModal] = useState(false);
    const { onLogout, authState: { userId } } = useAuth();

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

    return (
        <VStack bgColor="gray9" height="100%" justifyContent="flex-end" style={{ padding: 20, gap: 8 }}>
            <Button color="flame" variant="ghost" onPress={handleLogout}>Logout</Button>
            <Button colorScheme="danger" variant="ghost" onPress={(): void => setShowModal(true)}>Delete Account</Button>
            <Modal isOpen={showModal}>
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header>Delete Account</Modal.Header>
                    <Modal.Body>
                        Are you sure you want to delete your account?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button.Group space={2}>
                            <Button colorScheme="blueGray" variant="ghost" onPress={(): void => setShowModal(false)}>
                                Cancel
                            </Button>
                            <Button colorScheme="danger" onPress={handleDeleteAccount}>
                                Delete
                            </Button>
                        </Button.Group>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </VStack>
    );
};
