import React from 'react';
import { NativeBaseProvider } from 'native-base';
import { RecoilRoot } from 'recoil';
import { QueryClient, QueryClientProvider } from 'react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { Routes } from './src/components/Routes';
import { AuthProvider } from './src/context/AuthContext';
import { theme } from './src/themes/CustomTheme';

const queryClient = new QueryClient();

const config = {
    dependencies: {
        'linear-gradient': LinearGradient,
    },
};

export const App = (): JSX.Element => (
    <QueryClientProvider client={queryClient}>
        <RecoilRoot>
            <AuthProvider>
                <NativeBaseProvider config={config} theme={theme}>
                    <Routes />
                </NativeBaseProvider>
            </AuthProvider>
        </RecoilRoot>
    </QueryClientProvider>
);

// eslint-disable-next-line import/no-default-export
export default App;
