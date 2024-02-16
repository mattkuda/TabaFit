import {
    Avatar, Modal, VStack, Button,
} from 'native-base';
import React, { useState } from 'react';
import {
    TextInput, TouchableOpacity,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { StackNavigationProp } from '@react-navigation/stack';
// eslint-disable-next-line import/no-unresolved
import { ProfileStackParamList } from 'src/navigation/navigationTypes';
import { useMutateDeleteAccount, useMutateProfilePicture, useMutateUpdateProfile } from '../../mutations/profileMutations';
import { useAuth } from '../../context/AuthContext';

type EditProfileRouteProp = RouteProp<ProfileStackParamList, 'EditProfile'>;
type EditProfileNavigationProp = StackNavigationProp<ProfileStackParamList, 'EditProfile'>;

interface EditProfileProps {
    route: EditProfileRouteProp;
    navigation: EditProfileNavigationProp;
}

export const EditProfilePage: React.FC<EditProfileProps> = ({ route, navigation }) => {
    const { user } = route.params;
    const [username, setUsername] = useState(user.username);
    const [email, setEmail] = useState(user.email);
    const [firstName, setFirstName] = useState(user.firstName);
    const [lastName, setLastName] = useState(user.lastName);
    const [profilePictureUrl, setProfilePictureUrl] = useState(user.profilePictureUrl);
    const updateProfileMutation = useMutateUpdateProfile();
    const updateProfilePictureMutation = useMutateProfilePicture();
    const deleteAccountMutation = useMutateDeleteAccount();
    const [showModal, setShowModal] = useState(false);
    const { onLogout } = useAuth();

    const handleUpdate = (): void => {
        updateProfileMutation.mutate({
            userId: user._id.toString(),
            userData: {
                username, email, firstName, lastName,
            },
        }, { onSuccess: () => navigation.goBack() });
    };

    const handleProfilePictureUpdate = async (): Promise<void> => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.5,
            aspect: [1, 1],
        });

        if (!result.canceled) {
            const localUri = result.assets[0].uri;
            const filename = localUri.split('/').pop();
            // Infer the type of the media from the extension
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : `image`;

            // Create the formData to send to the server
            const formData = new FormData();

            formData.append('file', {
                uri: localUri,
                name: filename,
                type,
            } as any); // 'any' casting is necessary to satisfy TypeScript

            updateProfilePictureMutation.mutate({
                formData,
                userId: user._id.toString(),
            }, {
                onSuccess: (data) => {
                    if (data?.url) {
                        setProfilePictureUrl(data.url);
                    } else {
                        console.error('No URL returned from the upload API');
                    }
                },
            });
        }
    };

    const handleLogout = async (): Promise<void> => {
        try {
            await onLogout();
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const handleDeleteAccount = async (): Promise<void> => {
        deleteAccountMutation.mutate({
            userId: user._id.toString(),
        }, { onSuccess: () => navigation.goBack() });
        await onLogout();
        setShowModal(false);
    };

    return (
        <VStack style={{ padding: 20 }}>
            <TouchableOpacity onPress={handleProfilePictureUpdate}>
                <Avatar
                    borderColor="blue.500"
                    borderWidth={2}
                    size="xl"
                    source={{
                        uri: profilePictureUrl, // make sure you have the correct uri
                    }}
                />
            </TouchableOpacity>
            <TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
            />
            <TextInput
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
            />
            <Button onPress={handleUpdate}>Update Profile</Button>
            <Button onPress={handleLogout}>Logout</Button>
            <Button onPress={(): void => navigation.goBack()}>Go Back</Button>
            <Button color="red" onPress={(): void => setShowModal(true)}>Delete Account</Button>
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
