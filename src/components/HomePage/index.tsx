import {
    VStack, Button, Box, Text,
} from 'native-base';

export const Home = ({ navigation }): JSX.Element => (
    <Box flex={1} justifyContent="center">
        <VStack alignItems="center" space={4}>
            <Text fontSize="5xl">Abcountable</Text>
            <Button onPress={(): void => navigation.navigate('TabataSetup')}>Start Workout</Button>
            <Button onPress={(): void => navigation.navigate('ProfilePage')}>About</Button>
        </VStack>
    </Box>
);
