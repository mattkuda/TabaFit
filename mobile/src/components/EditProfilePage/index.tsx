import { Avatar } from 'native-base';
import React, { useState } from 'react';
import {
    View, TextInput, Button, TouchableOpacity,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { StackNavigationProp } from '@react-navigation/stack';
// eslint-disable-next-line import/no-unresolved
import { ProfileStackParamList } from 'src/navigation/navigationTypes';
import { useMutateProfilePicture, useMutateUpdateProfile } from '../../mutations/profileMutations';
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

    return (
        <View style={{ padding: 20 }}>
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
            <Button title="Update Profile" onPress={handleUpdate} />
            <Button title="Logout" onPress={handleLogout} />
            <Button title="Go Back" onPress={(): void => navigation.goBack()} />
        </View>
    );
};
