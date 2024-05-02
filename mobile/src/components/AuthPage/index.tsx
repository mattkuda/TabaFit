import React from 'react';
import {
    View, StyleSheet, Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { VStack, Button } from 'native-base';
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
        <VStack
            alignItems="center"
            backgroundColor="gray9"
            flex={1}
            justifyContent="center"
            width="100%"
        >
            <Image source={logo} style={styles.logo} />
            <View style={styles.buttonContainer}>
                <Button.Group
                    isAttached

                >
                    <Button
                        borderColor="flame"
                        borderLeftRadius="full"
                        borderWidth={2}
                        flex={1}
                        size="lg"
                        variant="outline"
                        onPress={(): void => navigation.navigate('LoginScreen')}
                    >
                        Login
                    </Button>
                    <Button
                        borderColor="flame"
                        borderRightRadius="full"
                        borderWidth={2}
                        flex={1}
                        size="lg"
                        variant="outline"
                        onPress={(): void => navigation.navigate('SignupScreen')}
                    >
                        Signup
                    </Button>
                </Button.Group>
            </View>
        </VStack>
    );
};
