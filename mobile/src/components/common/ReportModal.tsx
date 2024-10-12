import React, { useState } from 'react';
import {
    Modal,
    Text,
    Box,
    HStack,
    Icon,
    Select,
    Input,
    useToast,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { Report, ReportItemType, ReportReason } from '../../types/reports';
import { useMutateReport } from '../../mutations/useMutateReport';
import { useAuth } from '../../context/AuthContext';

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    itemType: ReportItemType;
    itemId: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({
    isOpen,
    onClose,
    itemType,
    itemId,
}) => {
    const [reportReason, setReportReason] = useState<ReportReason | null>(null);
    const [description, setDescription] = useState('');
    const toast = useToast();
    const reportMutation = useMutateReport();
    const { authState: { userId: reporterId } } = useAuth();

    const handleSubmit = (): void => {
        if (reportReason) {
            const reportData: Report = {
                reporterId,
                reportedItemId: itemId,
                reportedItemType: itemType,
                reportReason,
                description,
            };

            reportMutation.mutate({ report: reportData }, {
                onSuccess: () => {
                    toast.show({
                        description: 'Report submitted successfully',
                        placement: 'top',
                    });
                    onClose();
                },
                onError: () => {
                    toast.show({
                        description: 'Failed to submit report. Please try again.',
                        placement: 'top',
                    });
                },
            });
        }
    };

    return (
        <Modal
            closeOnOverlayClick
            borderColor="gray.600"
            isOpen={isOpen}
            size="full"
            onClose={onClose}
        >

            <Modal.Content
                backgroundColor="gray.900"
                borderColor="gray.600"
                borderWidth={2}
                style={{ margin: 'auto' }}
                width="90%"
            >
                <Modal.CloseButton />
                <Modal.Body
                    backgroundColor="gray.900"
                    // @ts-expect-error
                    gap={4}
                    px={8}
                >
                    <Box
                        alignItems="center"
                        flexDirection="row"
                        justifyContent="center"
                        width="100%"
                    >
                        <Icon as={Ionicons} mr={2} name="flag" size="md" />
                        <Text bold fontSize="xl">
                            Report
                            {' '}
                            {itemType.charAt(0).toUpperCase() + itemType.slice(1)}
                        </Text>
                    </Box>
                    <Box
                        flexDirection="column"
                        justifyContent="center"
                        width="100%"
                    >
                        <HStack alignItems="center" justifyContent="flex-start">
                            <Text
                                fontSize="lg"
                                numberOfLines={2}
                                style={{
                                    fontWeight: 'bold',
                                }}
                            >
                                Reason (required):
                            </Text>
                        </HStack>
                        <Select
                            _actionSheetContent={{
                                bg: 'gray.900',
                            }}
                            _item={{
                                bg: 'gray.900',
                                color: 'white',
                                _text: {
                                    color: 'white',
                                },
                                _pressed: {
                                    bg: 'gray.800',
                                },
                            }}
                            _selectedItem={{
                                bg: 'gray.700',
                                color: 'white',
                            }}
                            backgroundColor="transparent"
                            borderColor="transparent"
                            placeholder="Select a reason"
                            selectedValue={reportReason}
                            size="xl"
                            onValueChange={(itemValue): void => setReportReason(itemValue as ReportReason)}
                        >
                            {Object.values(ReportReason).map((reason) => (
                                <Select.Item key={reason} label={reason} value={reason} />
                            ))}
                        </Select>
                    </Box>
                    <Input
                        fontSize="md"
                        placeholder="Additional details"
                        returnKeyType={reportReason ? 'go' : 'done'}
                        value={description}
                        onChangeText={setDescription}
                        onSubmitEditing={handleSubmit}
                    />
                    <Box
                        flexDirection="row"
                        justifyContent="center"
                        width="100%"
                    >
                        <TouchableOpacity onPress={handleSubmit}>
                            <Box
                                alignItems="center"
                                bg={{
                                    linearGradient: reportReason ? {
                                        colors: ['flame.500', 'cherry.500'],
                                        start: [0, 1],
                                        end: [1, 0],
                                    } : {
                                        colors: ['gray.500', 'gray.500'],
                                        start: [0, 1],
                                        end: [1, 0],
                                    },
                                }}
                                borderRadius="full"
                                flexDirection="row"
                                // @ts-ignore
                                gap={2}
                                justifyContent="center"
                                mx="4"
                                p="2"
                                px={4}
                                // @ts-ignore
                                width="120"
                            >
                                <Icon as={Ionicons} name="checkmark" size="lg" />
                                <Text fontSize="md" fontWeight="semibold">
                                    Submit
                                </Text>
                            </Box>
                        </TouchableOpacity>
                    </Box>
                </Modal.Body>
            </Modal.Content>
        </Modal>
    );
};
