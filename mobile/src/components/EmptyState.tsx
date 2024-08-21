import { Ionicons } from '@expo/vector-icons';
import {
    Box, VStack, Icon, Text,
} from 'native-base';

type EmptyStateProps = {
    text?: string;
};

export const EmptyState: React.FC<EmptyStateProps> = ({
    text = 'Hmm, nothing here yet',
}): JSX.Element => (
    <Box
        alignItems="center"
        bg="transparent"
        borderRadius="lg"
        height={150}
        justifyContent="center"
        p="4"
        style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        }}
        w="100%"
    >
        <VStack alignItems="center">
            <Icon as={Ionicons} color="gray.400" name="alert-circle-outline" size="lg" />
            <Text color="gray.400" fontSize="md" mt="2">
                {text}
            </Text>
        </VStack>
    </Box>
);
