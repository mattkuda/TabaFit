import React, {
    createContext, useContext, useState, useEffect,
} from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import * as SplashScreen from 'expo-splash-screen';
import { QueryClient } from 'react-query';
import { fetchUserPreferences } from '../hooks/usePreferences';

const apiUrl = process.env.EXPO_PUBLIC_EAS_API_BASE_URL || 'http://localhost:3000';
const tokenKey = process.env.EXPO_PUBLIC_TOKEN_KEY;
const TUTORIAL_STATUS_KEY = 'hasSeenTutorial';

interface AuthProps {
    children?: React.ReactNode;
    authState?: {
        token: string | null;
        authenticated: boolean | null;
        userId?: string;
    };
    hasSeenTutorial?: boolean | null;
    completeTutorial?: () => Promise<void>;
    resetTutorial?: () => Promise<void>;
    onRegister?: (email: string, password: string, firstName: string,
        lastName: string, username: string) => Promise<any>;
    onLogin?: (emailOrUsername: string, password: string) => Promise<any>;
    onLogout?: () => Promise<any>;
    loading?: boolean;
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
    const [hasSeenTutorial, setHasSeenTutorial] = useState<boolean | null>(null);
    const [loading, setLoading] = useState<boolean>(true); // Add loading state

    useEffect(() => {
        const loadToken = async (): Promise<void> => {
            try {
                await SplashScreen.preventAutoHideAsync(); // Prevent the splash screen from auto-hiding
                setLoading(true); // Add loading state

                const token = await SecureStore.getItemAsync(tokenKey);
                const userId = await SecureStore.getItemAsync('userId');
                const tutorialStatus = await SecureStore.getItemAsync(TUTORIAL_STATUS_KEY);

                if (token) {
                    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
                    setAuthState({
                        token,
                        authenticated: true,
                        userId,
                    });
                }

                setHasSeenTutorial(tutorialStatus === 'true');
            } finally {
                setLoading(false); // Add loading state

                await SplashScreen.hideAsync(); // Hide the splash screen once the auth check is done
            }
        };

        loadToken();
    }, []);

    const onRegister = async (
        email: string,
        password: string,
        firstName: string,
        lastName: string,
        username: string,
    ): Promise<void> => {
        try {
            const response = await axios.post(`${apiUrl}/signup`, {
                email, password, firstName, lastName, username,
            });
            const { token, user } = response.data;

            setHasSeenTutorial(false);
            setAuthState({ token, authenticated: true, userId: user._id });

            axios.defaults.headers.common.Authorization = `Bearer ${response.data.token}`;

            await SecureStore.setItemAsync(tokenKey, response.data.token);
            await SecureStore.setItemAsync('userId', user._id);
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    };

    // Update the onLogin function to handle user data
    const onLogin = async (emailOrUsername: string, password: string): Promise<void> => {
        try {
            const response = await axios.post(`${apiUrl}/login`, { emailOrUsername, password });
            const { token, user } = response.data;
            // Fetch user preferences
            const queryClient = new QueryClient();

            queryClient.prefetchQuery(['preferences', user._id], () => fetchUserPreferences(user._id));

            setAuthState({
                token,
                authenticated: true,
                userId: user._id,
            });

            axios.defaults.headers.common.Authorization = `Bearer ${token}`;
            await SecureStore.setItemAsync(tokenKey, token);
            await SecureStore.setItemAsync('userId', user._id);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const onLogout = async (): Promise<void> => {
        try {
            await SecureStore.deleteItemAsync(tokenKey);
            await SecureStore.deleteItemAsync('userId');
            axios.defaults.headers.common.Authorization = '';
            setAuthState({ token: null, authenticated: false, userId: null });
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    };

    const completeTutorial = async (): Promise<void> => {
        try {
            await SecureStore.setItemAsync(TUTORIAL_STATUS_KEY, 'true');
            setHasSeenTutorial(true);
        } catch (error) {
            console.error('Failed to save tutorial status', error);
        }
    };

    const resetTutorial = async (): Promise<void> => {
        try {
            await SecureStore.deleteItemAsync(TUTORIAL_STATUS_KEY);
            setHasSeenTutorial(false);
        } catch (error) {
            console.error('Failed to reset tutorial status', error);
        }
    };

    // eslint-disable-next-line react/jsx-no-constructed-context-values
    const value = {
        authState,
        hasSeenTutorial,
        completeTutorial,
        resetTutorial,
        onRegister,
        onLogin,
        onLogout,
        loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
