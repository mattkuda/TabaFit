import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
// eslint-disable-next-line import/no-unresolved
import { ProfileStackParamList } from 'src/navigation/navigationTypes';

type EditProfileRouteProp = RouteProp<ProfileStackParamList, 'EditProfile'>;
type EditProfileNavigationProp = StackNavigationProp<ProfileStackParamList, 'EditProfile'>;

interface EditProfileProps {
    route: EditProfileRouteProp;
    navigation: EditProfileNavigationProp;
}

export const EditProfilePage: React.FC<EditProfileProps> = ({ route, navigation }) => {
    const { user } = route.params;

    console.log('HERE ARE THE PROPS');
    console.log(user);
    const [username, setUsername] = useState(user.username);
    const [email, setEmail] = useState(user.email);
    const [firstName, setFirstName] = useState(user.firstName);
    const [lastName, setLastName] = useState(user.lastName);

    // Function to handle the update of user info
    const handleUpdate = (): void => {
    // Here you would typically make an API call to update the user info
        console.log('User Info Updated:', {
            username, email, firstName, lastName,
        });
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
