import React, { useState } from 'react';
import {
    Box, Button, ScrollView, VStack, Text, Icon, HStack, Center,
} from 'native-base';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useSetRecoilState } from 'recoil';
import { TouchableOpacity } from 'react-native';
import { useFollowAll, useFollowUser } from '../../mutations/followMutations';
import { useAuth } from '../../context/AuthContext';
import { User } from '../../types/users';
import { useQuerySuggestedUsers } from '../../hooks/useQueryUserByUsername';
import { ProfilePicture } from '../ProfilePicture';
import { wizardActiveState } from '../../atoms/wizardActiveAtom';
import { GradientVStack } from '../common/GradientVStack';

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
        followMutation.mutate({ followerId: userId, followeeId: user._id.toString() }, {
            onSuccess: () => {
                setIsFollowed(true);
                onFollowed();
            },
        });
    };

    return (
        <Box backgroundColor="gray.900" borderColor="gray8" borderRadius="md" borderWidth="1" key={key} mt="2" p="4">
            <HStack alignItems="center" space={3}>
                <ProfilePicture size="48px" user={user} />
                <VStack flex={1}>
                    <Text bold fontSize="sm">
                        {`${user.firstName} ${user.lastName}`}
                    </Text>
                    <Text color="gray.600" fontSize="xs">
                        {`@${user.username}`}
                    </Text>
                </VStack>
                <Button
                    colorScheme={isFollowed || isAllFollowed ? 'success' : 'primary'}
                    isDisabled={isFollowed || isAllFollowed}
                    leftIcon={<Icon as={MaterialIcons} color={isFollowed ? 'easyGreen' : 'primary'} name={isFollowed || isAllFollowed ? 'check' : 'add'} size="sm" />}
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
    const setwizardActive = useSetRecoilState(wizardActiveState);

    const userId = authState?.userId;
    // const navigation = useNavigation<SuggestedFollowsScreenNavigationProp>();
    // const handleContinue = async (): Promise<void> => {
    //     navigation.navigate('HomeScreen');
    // };
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
        <GradientVStack
            flex={1}
            space={0}
            width="100%"
        >
            <ScrollView flex={1}>
                <VStack
                    flex={1}
                    justifyContent="center"
                    px={4}
                    space={4}
                >
                    <VStack
                        flex={1}
                        justifyContent="center"
                        space={2}
                    >
                        <Text fontSize="2xl" fontWeight="bold" mt="10" textAlign="center">
                            {`Let's get you connected!`}
                        </Text>
                        <Text fontSize="lg" mt="5" textAlign="center">
                            Follow some suggested users, or follow all current TabaFit users! (recommended)
                        </Text>
                    </VStack>
                    <Center>
                        <TouchableOpacity
                            onPress={handleFollowAll}
                        >
                            <Box
                                alignItems="center"
                                bg={{
                                    linearGradient: {
                                        colors: ['flame.500', 'cherry.500'],
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
                                my="2"
                                p="2"
                                px={4}
                                width="150"
                            >
                                <Icon as={Ionicons} name="add" size="lg" />
                                <Text fontSize="md" fontWeight="semibold">
                                    Follow All
                                </Text>
                            </Box>
                        </TouchableOpacity>
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
            <TouchableOpacity onPress={(): void => setwizardActive(false)}>
                <Box
                    alignItems="center"
                    bg={isAnyFollowed ? {
                        linearGradient: {
                            colors: ['flame.500', 'cherry.500'],
                            start: [0, 1],
                            end: [1, 0],
                        },
                    } : 'gray.800'}
                    borderRadius="full"
                    flexDirection="row"
                    // @ts-expect-error
                    gap={2}
                    justifyContent="center"
                    mx="4"
                    my="16"
                    p="4"
                    px={4}
                >
                    <Text bold color={isAnyFollowed ? 'white' : 'gray.600'} fontSize="lg">
                        Finish!
                    </Text>
                    <Icon as={Ionicons} color={isAnyFollowed ? 'white' : 'gray.600'} name="chevron-forward" size="lg" />
                </Box>
            </TouchableOpacity>
        </GradientVStack>
    );
};
