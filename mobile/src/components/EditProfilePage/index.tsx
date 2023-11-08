import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
// eslint-disable-next-line import/no-unresolved
import { ProfileStackParamList } from 'src/navigation/navigationTypes';
import axios from 'axios';

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

    const handleUpdate = async (): Promise<void> => {
        try {
            // TODO Replace with interchangeable baseURL
            const response = await axios.put(`http://localhost:3000/users/${user._id}`, {
                username,
                email,
                firstName,
                lastName,
            });

            if (response.status === 200) {
                navigation.goBack();
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    return (
        <View style={{ padding: 20 }}>
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
            <Button title="Go Back" onPress={(): void => navigation.goBack()} />
        </View>
    );
};
