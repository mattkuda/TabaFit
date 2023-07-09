import React from 'react';
import { SafeAreaView } from 'react-native';
import { NativeBaseProvider } from 'native-base';
import { Timer } from './src/components/Timer';

export const App = (): JSX.Element => (
    <NativeBaseProvider>
        <SafeAreaView>
            <Timer />
        </SafeAreaView>
    </NativeBaseProvider>
);

// eslint-disable-next-line import/no-default-export
export default App;
