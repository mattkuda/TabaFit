import React, { useState } from 'react';
import {
    Box, Button, ScrollView, VStack, Text, Icon, Avatar, HStack, Center,
} from 'native-base';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
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
        <Box backgroundColor="gray9" borderColor="gray8" borderRadius="md" borderWidth="1" key={key} mt="2" p="4">
            <HStack alignItems="center" space={3}>
                <Avatar size="48px" source={{ uri: user.profilePictureUrl }} />
                <VStack flex={1}>
                    <Text bold fontSize="sm">
                        {`${user.firstName} ${user.lastName}`}
                    </Text>
                    <Text color="coolGray.600" fontSize="xs">
                        {`@${user.username}`}
                    </Text>
                </VStack>
                <Button
                    colorScheme={isFollowed || isAllFollowed ? 'success' : 'primary'}
                    isDisabled={isFollowed || isAllFollowed}
                    leftIcon={<Icon as={MaterialIcons} color={isFollowed ? 'green.500' : 'flame'} name={isFollowed || isAllFollowed ? 'check' : 'add'} size="sm" />}
                    variant="ghost"
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
        <VStack
            backgroundColor="gray9"
            flex={1}
            width="100%"
        >
            <ScrollView flex={1}>
                <VStack
                    justifyContent="center"
                    mt="5"
                    px="4"
                    space={8}
                >
                    <VStack
                        flex={1}
                        justifyContent="center"
                        space={2}
                    >
                        <Text fontSize="2xl" fontWeight="bold" mt="10" textAlign="center">
                            {`First, let's get you connected!`}
                        </Text>
                        <Text fontSize="lg" mt="5" textAlign="center">
                            Follow some suggested users, or follow all Tabaat users!
                        </Text>
                    </VStack>
                    <Center>
                        <Button
                            borderRadius="full"
                            colorScheme="primary"
                            isLoading={followAllMutation.isLoading}
                            leftIcon={<Icon as={MaterialIcons} color={followAllMutation.isSuccess ? 'green.500' : 'white'} name={followAllMutation.isSuccess ? 'check' : 'add'} size="sm" />}
                            variant="solid"
                            width={180}
                            onPress={handleFollowAll}
                        >
                            Follow All
                        </Button>
                    </Center>
                    {users?.map((user) => (
                        <ConnectionCard
                            isAllFollowed={isAllFollowed}
                            key={user._id.toString()}
                            user={user}
                            onFollowed={(): void => setIsAnyFollowed(true)}
                        />
                    ))}
                </VStack>
            </ScrollView>
            <Box bg="gray9" height={110} p="4" width="100%">
                <Button
                    borderRadius="full"
                    bottom={8}
                    endIcon={(
                        <Icon as={Ionicons} name="chevron-forward" />
                    )}
                    flex={1}
                    m={4}
                    position="absolute"
                    width="100%"
                    onPress={handleContinue}
                >
                    Continue
                </Button>
            </Box>
        </VStack>
    );
};
