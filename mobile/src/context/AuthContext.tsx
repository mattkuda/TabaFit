/* eslint-disable no-underscore-dangle */
import React, {
    createContext, useContext, useState, useEffect, useCallback,
} from 'react';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import * as SecureStore from 'expo-secure-store';
import * as SplashScreen from 'expo-splash-screen';

const apiUrl = process.env.EXPO_PUBLIC_EAS_API_BASE_URL || 'http://localhost:3000';
const tokenKey = process.env.EXPO_PUBLIC_TOKEN_KEY;
const refreshTokenKey = 'refreshToken';
// const TUTORIAL_STATUS_KEY = 'hasSeenTutorial';

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
    const [hasSeenTutorial, setHasSeenTutorial] = useState<boolean | null>(true);
    const [loading, setLoading] = useState<boolean>(true); // Add loading state

    const onLogout = useCallback(async (): Promise<void> => {
        try {
            await SecureStore.deleteItemAsync(tokenKey);
            await SecureStore.deleteItemAsync(refreshTokenKey);
            await SecureStore.deleteItemAsync('userId');
            axios.defaults.headers.common.Authorization = '';
            setAuthState({
                token: null, authenticated: false, userId: null,
            });
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    }, []);

    const refreshToken = useCallback(async () => {
        try {
            const currentRefreshToken = await SecureStore.getItemAsync(refreshTokenKey);

            if (!currentRefreshToken) {
                throw new Error('No refresh token available');
            }

            const response = await axios.post(`${apiUrl}/refresh-token`, { refreshToken: currentRefreshToken });
            const { token: newToken, refreshToken: newRefreshToken } = response.data;

            await SecureStore.setItemAsync(tokenKey, newToken);
            await SecureStore.setItemAsync(refreshTokenKey, newRefreshToken);

            axios.defaults.headers.common.Authorization = `Bearer ${newToken}`;
            setAuthState((prev) => ({ ...prev, token: newToken }));

            return newToken;
        } catch (error) {
            console.error('Token refresh failed:', error);
            // If refresh fails, log out the user
            await onLogout();
            // You might want to notify the user here
            // For example, you could use a state variable to show a "Session expired" message
            setAuthState((prev) => ({ ...prev, authenticated: false }));
            throw error;
        }
    }, [onLogout]);

    useEffect(() => {
        const loadToken = async (): Promise<void> => {
            try {
                await SplashScreen.preventAutoHideAsync(); // Prevent the splash screen from auto-hiding
                setLoading(true); // Add loading state

                const token = await SecureStore.getItemAsync(tokenKey);
                const userId = await SecureStore.getItemAsync('userId');

                if (token) {
                    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
                    setAuthState({
                        token,
                        authenticated: true,
                        userId,
                    });

                    // Set up interceptor for automatic token refresh
                    axios.interceptors.response.use(
                        (response: AxiosResponse) => response,
                        async (error: AxiosError) => {
                            const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

                            if (error.response?.status === 401 && !originalRequest._retry) {
                                originalRequest._retry = true;
                                try {
                                    const newToken = await refreshToken();

                                    if (originalRequest.headers) {
                                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                                    }
                                    return axios(originalRequest);
                                } catch (refreshError) {
                                    // If refresh fails, proceed with the error
                                    return Promise.reject(refreshError);
                                }
                            }
                            return Promise.reject(error);
                        },
                    );
                }

                // setHasSeenTutorial(tutorialStatus === 'true');
            } finally {
                setLoading(false); // Add loading state

                await SplashScreen.hideAsync(); // Hide the splash screen once the auth check is done
            }
        };

        loadToken();
    }, [refreshToken]);

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
            const { token, refreshToken: newRefreshToken, user } = response.data;

            setHasSeenTutorial(false);
            setAuthState({ token, authenticated: true, userId: user._id });

            axios.defaults.headers.common.Authorization = `Bearer ${token}`;

            await SecureStore.setItemAsync(tokenKey, token);
            await SecureStore.setItemAsync(refreshTokenKey, newRefreshToken);
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
            const { token, refreshToken: newRefreshToken, user } = response.data;

            // Store tokens and user ID
            await Promise.all([
                SecureStore.setItemAsync(tokenKey, token),
                SecureStore.setItemAsync(refreshTokenKey, newRefreshToken),
                SecureStore.setItemAsync('userId', user._id),
            ]);

            // Update auth state immediately
            setAuthState({
                token,
                authenticated: true,
                userId: user._id,
            });

            // Set axios default header
            axios.defaults.headers.common.Authorization = `Bearer ${token}`;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const completeTutorial = async (): Promise<void> => {
        try {
            // await SecureStore.setItemAsync(TUTORIAL_STATUS_KEY, 'true');
            setHasSeenTutorial(true);
        } catch (error) {
            console.error('Failed to save tutorial status', error);
        }
    };

    const resetTutorial = async (): Promise<void> => {
        try {
            // await SecureStore.deleteItemAsync(TUTORIAL_STATUS_KEY);
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
        refreshToken, // Add refreshToken to the context value
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
