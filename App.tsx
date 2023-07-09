import React from 'react';
import { SafeAreaView } from 'react-native';
import Timer from './src/components/Timer';
import { NativeBaseProvider } from 'native-base';

export default function App() {
  return (
    <NativeBaseProvider>
      <SafeAreaView>
        <Timer />
      </SafeAreaView>
    </NativeBaseProvider>
  );
}

