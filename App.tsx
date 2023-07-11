import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { NativeBaseProvider } from 'native-base';
import { SafeAreaView } from 'react-native';
import { Timer } from './src/components/Timer';
import { Home } from './src/components/Home'; // Path based on your file structure
import { About } from './src/components/About'; // Path based on your file structure

const Stack = createStackNavigator();

export const App = (): JSX.Element => (
    <NativeBaseProvider>
        <SafeAreaView style={{ flex: 1 }}>
            <NavigationContainer>
                <Stack.Navigator
                    initialRouteName="Home"
                    screenOptions={{ headerShown: false }}
                >
                    <Stack.Screen component={Home} name="Home" />
                    <Stack.Screen component={Timer} name="Timer" />
                    <Stack.Screen component={About} name="About" />
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaView>
    </NativeBaseProvider>
);

// eslint-disable-next-line import/no-default-export
export default App;
