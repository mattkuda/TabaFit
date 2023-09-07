import React, {
    createContext, useContext, useState, useEffect,
} from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

interface AuthProps {
    children?: React.ReactNode;
    authState?: {
        token: string | null;
        authenticated: boolean | null;
    };
    onRegister?: (email: string, password: string) => Promise<any>;
    onLogin?: (email: string, password: string) => Promise<any>;
    onLogout?: () => Promise<any>;
}

const { TOKEN_KEY, API_URL } = Constants.manifest.extra;

const AuthContext = createContext<AuthProps>({});

export const useAuth = (): AuthProps => useContext(AuthContext);

export const AuthProvider: React.FC<AuthProps> = ({ children }: any) => {
    const [authState, setAuthState] = useState<{
        token: string | null;
        authenticated: boolean | null;
    }>({
        token: null,
        authenticated: null,
    });

    useEffect(() => {
        const loadToken = async (): Promise<void> => {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);

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
            const response = await axios.post(`${API_URL}/register`, { email, password });
            const { token } = response.data;

            setAuthState({ token, authenticated: true });

            axios.defaults.headers.common.Authorization = `Bearer ${response.data.token}`;

            await SecureStore.setItemAsync(TOKEN_KEY, response.data.token);

            // return response.data;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    };

    const onLogin = async (email: string, password: string): Promise<void> => {
        try {
            const response = await axios.post(`${API_URL}/login`, { email, password });
            const { token } = response.data;

            setAuthState({ token, authenticated: true });

            axios.defaults.headers.common.Authorization = `Bearer ${response.data.token}`;

            await SecureStore.setItemAsync(TOKEN_KEY, response.data.token);

            // return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const onLogout = async (): Promise<void> => {
        try {
            await SecureStore.deleteItemAsync(TOKEN_KEY);
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
