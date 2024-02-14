import React from 'react';
import { NativeBaseProvider } from 'native-base';
import { RecoilRoot } from 'recoil';
import { QueryClient, QueryClientProvider } from 'react-query';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Routes } from './src/components/Routes';
import { AuthProvider } from './src/context/AuthContext';

const clientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;
const queryClient = new QueryClient();

export const App = (): JSX.Element => {
    GoogleSignin.configure({
        webClientId: clientId,
    });
    return (
        <QueryClientProvider client={queryClient}>
            <RecoilRoot>
                <AuthProvider>
                    <NativeBaseProvider>
                        <Routes />
                    </NativeBaseProvider>
                </AuthProvider>
            </RecoilRoot>
        </QueryClientProvider>
    );
};

// eslint-disable-next-line import/no-default-export
export default App;
