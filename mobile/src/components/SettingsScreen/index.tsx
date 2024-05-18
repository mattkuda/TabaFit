import {
    Modal, VStack, Button, Text,
    Icon,
    HStack,
    useTheme,
} from 'native-base';
import React, { useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
// eslint-disable-next-line import/no-unresolved
import { ProfileStackParamList } from 'src/navigation/navigationTypes';
import { RouteProp } from '@react-navigation/native';
import { Linking, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMutateDeleteAccount } from '../../mutations/profileMutations';
import { useAuth } from '../../context/AuthContext';

type SettingsScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'SettingsScreen'>;
type SettingsScreenRouteProp = RouteProp<ProfileStackParamList, 'SettingsScreen'>;

interface SettingsScreenProps {
    navigation: SettingsScreenNavigationProp;
    route: SettingsScreenRouteProp;

}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ route, navigation }) => {
    const { user } = route.params;
    const deleteAccountMutation = useMutateDeleteAccount();
    const [showModal, setShowModal] = useState(false);
    const { onLogout, authState: { userId } } = useAuth();
    const { colors } = useTheme();

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
    const handleEditProfile = (): void => {
        navigation.navigate('EditProfile', { user });
    };

    const handleSubmitFeedback = (): void => {
        // TODO: Change the URL to your Google Form URL
        Linking.openURL('https://your-google-form-url.com');
    };

    return (
        <VStack bgColor="gray9" height="100%" justifyContent="flex-start" style={{ padding: 20, gap: 8 }}>
            {/* Disbale for now. Consider keeping here vs on main profile page.  */}
            {/* <TouchableOpacity
                style={{
                    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                }}
                onPress={handleEditProfile}
            >
                <Ionicons color="flame" name="person" size={24} />
                <Text color="flame" textAlign="left">Edit Profile</Text>
                <Icon as={Ionicons} color="flame" name="chevron-forward" />
            </TouchableOpacity> */}
            <TouchableOpacity
                style={{
                    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                }}
                onPress={(): void => console.log('Todo')}
            >
                <HStack space="2">
                    {/* eslint-disable-next-line dot-notation */}
                    <Ionicons color={colors['flame']} name="information-circle" size={24} />
                    <Text color="flame" textAlign="left">About</Text>
                </HStack>
                <Icon as={Ionicons} color="flame" name="chevron-forward" />
            </TouchableOpacity>
            <TouchableOpacity
                style={{
                    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                }}
                onPress={handleSubmitFeedback}
            >
                <HStack space="2">
                    {/* eslint-disable-next-line dot-notation */}
                    <Ionicons color={colors['flame']} name="chatbox-ellipses" size={24} />
                    <Text color="flame" textAlign="left">Submit Feedback</Text>
                </HStack>
                <Icon as={Ionicons} color="flame" name="chevron-forward" />
            </TouchableOpacity>
            <TouchableOpacity
                style={{
                    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                }}
                onPress={handleLogout}
            >
                <HStack space="2">
                    {/* eslint-disable-next-line dot-notation */}
                    <Ionicons color={colors['flame']} name="log-out" size={24} />
                    <Text color="flame" textAlign="left">Logout</Text>
                </HStack>
                <Icon as={Ionicons} color="flame" name="chevron-forward" />
            </TouchableOpacity>
            {/* <TouchableOpacity
                disabled
                style={{
                    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                }}
                onPress={(): void => setShowModal(true)}
            >
                <Text color="flame" textAlign="left">Delete Account</Text>
                <Icon as={Ionicons} color="flame" name="chevron-forward" />
            </TouchableOpacity> */}
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
