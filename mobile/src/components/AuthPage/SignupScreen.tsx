import React, { useState } from 'react';
import {
    Button, TextInput, View, StyleSheet, Image, Text,
} from 'react-native';
import { useSetRecoilState } from 'recoil';
import { userState } from '../../atoms/userStateAtom';
import { useAuth } from '../../context/AuthContext';
// @ts-ignore
import logo from '../../../assets/TabatableBasicLogo.png'; // Adjust the path and filename as necessary
import { useQueryUserByEmail, useQueryUserByUsername } from '../../hooks/useQueryUserByUsername';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    logo: {
        maxWidth: '100%',
        height: 100,
        resizeMode: 'contain',
        marginHorizontal: 100,
        marginBottom: 20,
    },
    input: {
        width: '80%',
        padding: 10,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 5,
    },
});

export const SignupScreen = (): JSX.Element => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const setUser = useSetRecoilState(userState);
    const { onRegister } = useAuth();
    const { data: foundUserByUseranme } = useQueryUserByUsername(username);
    const { data: foundUserByEmail } = useQueryUserByEmail(email);

    const handleSignUp = async (): Promise<void> => {
        try {
            const data = await onRegister(email, password, firstName, lastName, username);

            if (data.success) {
                setUser((prevState) => ({
                    ...prevState,
                    isAuthenticated: true,
                    user: data.user,
                }));
            } else {
                setErrorMessage(data.message);
            }
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Image source={logo} style={styles.logo} />
            <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} />
            {foundUserByEmail && <Text>Email already is use</Text>}
            <TextInput secureTextEntry placeholder="Password" style={styles.input} value={password} onChangeText={setPassword} />
            <TextInput placeholder="First Name" style={styles.input} value={firstName} onChangeText={setFirstName} />
            <TextInput placeholder="Last Name" style={styles.input} value={lastName} onChangeText={setLastName} />
            <TextInput
                autoCapitalize="none"
                placeholder="Username"
                style={styles.input}
                value={username}
                onChangeText={setUsername}
            />
            {foundUserByUseranme && <Text>Username already taken</Text>}
            <Button disabled={!!foundUserByUseranme || !!foundUserByEmail} title="Sign Up" onPress={handleSignUp} />
            <Text>{errorMessage}</Text>
            <Text>
                FUser:
                {foundUserByUseranme?.username}
            </Text>
            <Text>
                FEmail:
                {foundUserByEmail?.username}
            </Text>
        </View>
    );
};
