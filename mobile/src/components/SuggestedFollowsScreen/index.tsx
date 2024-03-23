import React, { useState } from 'react';
import {
    Box, Button, ScrollView, VStack, Text, Icon, Avatar, HStack,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFollowAll, useFollowUser } from '../../mutations/followMutations';
import { useAuth } from '../../context/AuthContext';
import { SuggestedFollowsScreenNavigationProp } from '../../navigation/navigationTypes';
import { User } from '../../types/users';
import { useQuerySuggestedUsers } from '../../hooks/useQueryUserByUsername';

type ConnectionCardProps = {
    user: User;
    isAllFollowed: boolean;
    key: string;
    onFollowed: () => void;
};

export const ConnectionCard: React.FC<ConnectionCardProps> = ({
    onFollowed, key, user, isAllFollowed,
}) => {
    const [isFollowed, setIsFollowed] = useState(false);

    const { authState: { userId } } = useAuth();

    const followMutation = useFollowUser();

    const handleFollow = (): void => {
        followMutation.mutate({ followerId: user._id.toString(), followeeId: userId }, {
            onSuccess: () => {
                setIsFollowed(true);
                onFollowed();
            },
        });
    };

    return (
        <Box backgroundColor="white" borderColor="coolGray.200" borderRadius="md" borderWidth="1" key={key} mt="2" p="4">
            <HStack alignItems="center" space={3}>
                <Avatar size="48px" source={{ uri: user.profilePictureUrl }} />
                <VStack flex={1}>
                    <Text bold fontSize="sm">
                        {`${user.firstName} ${user.lastName}`}
                    </Text>
                    <Text color="coolGray.600" fontSize="xs">
                        {user.username}
                    </Text>
                </VStack>
                <Button
                    colorScheme={isFollowed || isAllFollowed ? 'success' : 'primary'}
                    isDisabled={isFollowed || isAllFollowed}
                    leftIcon={<Icon as={MaterialIcons} color={isFollowed ? 'green.500' : 'white'} name={isFollowed || isAllFollowed ? 'check' : 'add'} size="sm" />}
                    variant="solid"
                    onPress={handleFollow}
                >
                    {isFollowed || isAllFollowed ? 'Followed' : 'Follow'}
                </Button>
            </HStack>
        </Box>
    );
};

export const SuggestedFollowsScreen = (): JSX.Element => {
    const followAllMutation = useFollowAll();
    const { authState } = useAuth();
    const { data: users } = useQuerySuggestedUsers();
    const [isAllFollowed, setIsAllFollowed] = useState(false);
    const [isAnyFollowed, setIsAnyFollowed] = useState(false);

    const userId = authState?.userId;
    const navigation = useNavigation<SuggestedFollowsScreenNavigationProp>();
    const handleContinue = async (): Promise<void> => {
        navigation.navigate('SuggestedWorkoutsScreen');
    };
    const handleFollowAll = (): void => {
        if (userId) {
            followAllMutation.mutate(
                { followerId: userId },
                {
                    onSuccess: () => {
                        setIsAllFollowed(true);
                        setIsAnyFollowed(true);
                    },
                },
            );
        }
    };

    return (
        <VStack bg="white" flex={1}>
            <ScrollView flex={1}>
                <VStack mt="5" px="4" space={4}>
                    <Box>
                        <Text bold fontSize="xl" mb="4">
                            People You May Know
                        </Text>
                        {users?.map((user) => (
                            <ConnectionCard
                                isAllFollowed={isAllFollowed}
                                key={user._id.toString()}
                                user={user}
                                onFollowed={(): void => setIsAnyFollowed(true)}
                            />
                        ))}
                    </Box>
                    <Button
                        colorScheme="primary"
                        isLoading={followAllMutation.isLoading}
                        leftIcon={<Icon as={MaterialIcons} color={followAllMutation.isSuccess ? 'green.500' : 'white'} name={followAllMutation.isSuccess ? 'check' : 'add'} size="sm" />}
                        mb={4}
                        variant="solid"
                        onPress={handleFollowAll}
                    >
                        Follow All
                    </Button>
                </VStack>
            </ScrollView>
            <Button
                isDisabled={!isAnyFollowed}
                mt="auto"
                onPress={handleContinue}
            >
                Continue
            </Button>
        </VStack>
    );
};
