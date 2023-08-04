import React from 'react';
import { NativeBaseProvider } from 'native-base';
import { RecoilRoot } from 'recoil';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Routes } from './src/components/Routes';

const queryClient = new QueryClient();

export const App = (): JSX.Element => (

    <QueryClientProvider client={queryClient}>
        <RecoilRoot>
            <NativeBaseProvider>
                <Routes />
            </NativeBaseProvider>
        </RecoilRoot>
    </QueryClientProvider>

);

// eslint-disable-next-line import/no-default-export
export default App;
