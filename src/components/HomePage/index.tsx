import {
    VStack, Box, Text,
} from 'native-base';

export const Home = (): JSX.Element => (
    <Box flex={1} justifyContent="center">
        <VStack alignItems="center" space={4}>
            <Text fontSize="5xl">Abcountable</Text>
            <Text>TODO: Home Feed</Text>
        </VStack>
    </Box>
);
