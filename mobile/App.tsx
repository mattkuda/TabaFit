import React from 'react';
import { NativeBaseProvider, View } from 'native-base';
import { RecoilRoot } from 'recoil';
import { QueryClient, QueryClientProvider } from 'react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaProvider } from 'react-native-safe-area-context';
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
            <SafeAreaProvider>
                <AuthProvider>
                    <NativeBaseProvider config={config} theme={theme}>
                        <View style={{ flex: 1, backgroundColor: theme.colors.gray[900] }}>
                            <Routes />
                        </View>
                    </NativeBaseProvider>
                </AuthProvider>
            </SafeAreaProvider>
        </RecoilRoot>
    </QueryClientProvider>
);

// eslint-disable-next-line import/no-default-export
export default App;
