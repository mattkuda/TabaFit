import React from 'react';
import { NativeBaseProvider } from 'native-base';
import { RecoilRoot } from 'recoil';
import { Routes } from './src/components/Routes';

export const App = (): JSX.Element => (
    <RecoilRoot>
        <NativeBaseProvider>
            <Routes />
        </NativeBaseProvider>
    </RecoilRoot>
);

// eslint-disable-next-line import/no-default-export
export default App;
