import React from 'react';
import {
    Button, View, StyleSheet, Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/navigationTypes';
// @ts-ignore
import logo from '../../../assets/TabatableBasicLogo.png'; // Adjust the path and filename as necessary

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
    buttonContainer: {
        width: '80%',
    },
});

export const AuthPage = (): JSX.Element => {
    const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();

    return (
        <View style={styles.container}>
            <Image source={logo} style={styles.logo} />
            <View style={styles.buttonContainer}>
                <Button title="Sign Up" onPress={(): void => navigation.navigate('SignupScreen')} />
                <Button title="Login" onPress={(): void => navigation.navigate('LoginScreen')} />
            </View>
        </View>
    );
};
