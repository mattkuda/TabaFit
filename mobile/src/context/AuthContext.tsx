import React, {
    createContext, useContext, useState, useEffect,
} from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { User } from '../types/users';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const tokenKey = process.env.EXPO_PUBLIC_TOKEN_KEY;

// Add a user field to the AuthProps interface
interface AuthProps {
    children?: React.ReactNode;
    authState?: {
        token: string | null;
        authenticated: boolean | null;
        user?: User; // You can replace 'any' with a more specific type for your user data
    };
    onRegister?: (email: string, password: string) => Promise<any>;
    onLogin?: (email: string, password: string) => Promise<any>;
    onLogout?: () => Promise<any>;
}

const AuthContext = createContext<AuthProps>({});

export const useAuth = (): AuthProps => useContext(AuthContext);

export const AuthProvider: React.FC<AuthProps> = ({ children }: any) => {
    // Update the initial state to include a user field
    const [authState, setAuthState] = useState<{
        token: string | null;
        authenticated: boolean | null;
        user?: any; // Again, replace 'any' with your user type
    }>({
        token: null,
        authenticated: null,
        user: null,
    });

    useEffect(() => {
        const loadToken = async (): Promise<void> => {
            const token = await SecureStore.getItemAsync(tokenKey);

            if (token) {
                axios.defaults.headers.common.Authorization = `Bearer ${token}`;
                setAuthState({
                    token,
                    authenticated: true,
                });
            }
        };

        loadToken();
    }, []);

    const onRegister = async (email: string, password: string): Promise<void> => {
        try {
            const response = await axios.post(`${apiUrl}/signup`, { email, password });
            const { token } = response.data;

            setAuthState({ token, authenticated: true });

            axios.defaults.headers.common.Authorization = `Bearer ${response.data.token}`;

            await SecureStore.setItemAsync(tokenKey, response.data.token);
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    };

    // Update the onLogin function to handle user data
    const onLogin = async (email: string, password: string): Promise<any> => {
        try {
            const response = await axios.post(`${apiUrl}/login`, { email, password });
            const { token, user } = response.data;

            setAuthState({ token, authenticated: true, user });
            axios.defaults.headers.common.Authorization = `Bearer ${token}`;
            await SecureStore.setItemAsync(tokenKey, token);

            return { success: true, user };
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const onLogout = async (): Promise<void> => {
        try {
            await SecureStore.deleteItemAsync(tokenKey);
            axios.defaults.headers.common.Authorization = '';
            setAuthState({ token: null, authenticated: false });
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    };

    // eslint-disable-next-line react/jsx-no-constructed-context-values
    const value = {
        authState,
        onRegister,
        onLogin,
        onLogout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
