import React, { useState } from 'react';
import {
    Modal,
    Text,
    VStack,
    Button,
    useToast,
    Input,
} from 'native-base';
import { useMutateBlock } from '../../mutations/useMutateBlock';

interface BlockModalProps {
    isOpen: boolean;
    onClose: () => void;
    userIdToBlock: string;
}

export const BlockModal: React.FC<BlockModalProps> = ({
    isOpen,
    onClose,
    userIdToBlock,
}) => {
    const toast = useToast();
    const blockMutation = useMutateBlock();
    const [blockReason, setBlockReason] = useState('');

    const handleBlockUser = (): void => {
        blockMutation.mutate({ userIdToBlock }, {
            onSuccess: () => {
                toast.show({
                    description: 'User blocked successfully',
                    placement: 'top',
                });
                onClose();
            },
            onError: () => {
                toast.show({
                    description: 'Failed to block user. Please try again.',
                    placement: 'top',
                });
            },
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            size="lg"
            onClose={onClose}
        >
            <Modal.Content backgroundColor="gray.900">
                <Modal.CloseButton />
                <Modal.Body backgroundColor="gray.900" p={8}>
                    <VStack space={4}>
                        <Text bold fontSize="lg" textAlign="center">
                            Block User?
                        </Text>
                        <Text textAlign="center">
                            Are you sure you want to block this user? You won't see their content anymore.
                        </Text>
                        <Input
                            placeholder="Reason for blocking (optional)"
                            value={blockReason}
                            onChangeText={setBlockReason}
                        />
                        <Button colorScheme="danger" onPress={handleBlockUser}>
                            Block User
                        </Button>
                        <Button colorScheme="secondary" variant="ghost" onPress={onClose}>
                            Cancel
                        </Button>
                    </VStack>
                </Modal.Body>
            </Modal.Content>
        </Modal>
    );
};
