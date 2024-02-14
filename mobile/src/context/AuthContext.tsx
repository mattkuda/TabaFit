import React, {
    createContext, useContext, useState, useEffect,
} from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const tokenKey = process.env.EXPO_PUBLIC_TOKEN_KEY;

interface AuthProps {
    children?: React.ReactNode;
    authState?: {
        token: string | null;
        authenticated: boolean | null;
        userId?: string;
    };
    onRegister?: (email: string, password: string, googleUid?: string) => Promise<any>;
    onLogin?: (email: string, password: string) => Promise<any>;
    onLogout?: () => Promise<any>;
}

const AuthContext = createContext<AuthProps>({});

export const useAuth = (): AuthProps => useContext(AuthContext);

export const AuthProvider: React.FC<AuthProps> = ({ children }: any) => {
    const [authState, setAuthState] = useState<{
        token: string | null;
        authenticated: boolean | null;
        userId?: string;
    }>({
        token: null,
        authenticated: null,
        userId: null,
    });

    useEffect(() => {
        const loadToken = async (): Promise<void> => {
            const token = await SecureStore.getItemAsync(tokenKey);

            if (token) {
                axios.defaults.headers.common.Authorization = `Bearer ${token}`;
                setAuthState((prev) => ({
                    token,
                    authenticated: true,
                    userId: prev.userId,
                }));
            }
        };

        loadToken();
    }, []);

    const onRegister = async (email: string, password: string, googleUid?: string): Promise<void> => {
        try {
            const response = await axios.post(`${apiUrl}/signup`, { email, password, googleUid });
            const { token, user } = response.data;

            console.log('setting the google token as: ', token, ' and user as: ', user._id, ' and response: ', response.data);

            setAuthState({ token, authenticated: true, userId: user._id });

            axios.defaults.headers.common.Authorization = `Bearer ${response.data.token}`;

            await SecureStore.setItemAsync(tokenKey, response.data.token);
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    };

    // Update the onLogin function to handle user data
    const onLogin = async (email: string, password: string): Promise<void> => {
        try {
            const response = await axios.post(`${apiUrl}/login`, { email, password });
            const { token, user } = response.data;

            setAuthState({
                token,
                authenticated: true,
                userId: user._id,
            });

            axios.defaults.headers.common.Authorization = `Bearer ${token}`;
            await SecureStore.setItemAsync(tokenKey, token);
            // You might also want to store the user ID and username in secure storage
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const onLogout = async (): Promise<void> => {
        try {
            await SecureStore.deleteItemAsync(tokenKey);
            axios.defaults.headers.common.Authorization = '';
            setAuthState({ token: null, authenticated: false, userId: null });
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
