import React, { useState } from 'react';
import {
    Box, Button, ScrollView, VStack, Text, Icon, Avatar, HStack,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons'; // Assuming you're using Expo
import { useNavigation } from '@react-navigation/native';
import { useFollowAll, useFollowUser } from '../../mutations/followMutations';
import { useAuth } from '../../context/AuthContext';
import { SuggestedFollowsScreenNavigationProp } from '../../navigation/navigationTypes';
import { User } from '../../types/users';
import { useQuerySuggestedUsers } from '../../hooks/useQueryUserByUsername';

type ConnectionCardProps = {
    user: User;
};

export const ConnectionCard: React.FC<ConnectionCardProps> = ({ user }) => {
    const [isFollowed, setIsFollowed] = useState(false);

    const { authState: { userId } } = useAuth();

    const followMutation = useFollowUser();

    const handleFollow = (): void => {
        followMutation.mutate({ followerId: user._id.toString(), followeeId: userId }, {
            onSuccess: () => {
                setIsFollowed(true);
            },
        });
    };

    return (
        <Box backgroundColor="white" borderColor="coolGray.200" borderRadius="md" borderWidth="1" mt="2" p="4">
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
                    colorScheme={isFollowed ? 'success' : 'primary'}
                    isDisabled={isFollowed}
                    leftIcon={<Icon as={MaterialIcons} color={isFollowed ? 'green.500' : 'white'} name={isFollowed ? 'check' : 'add'} size="sm" />}
                    variant="solid"
                    onPress={handleFollow}
                >
                    {isFollowed ? 'Followed' : 'Follow'}
                </Button>
            </HStack>
        </Box>
    );
};

export const SuggestedFollowsScreen = (): JSX.Element => {
    const followAllMutation = useFollowAll();
    const { authState } = useAuth();
    const { data: users } = useQuerySuggestedUsers();

    const userId = authState?.userId;
    const navigation = useNavigation<SuggestedFollowsScreenNavigationProp>();
    const handleContinue = async (): Promise<void> => {
        navigation.navigate('SuggestedWorkoutsScreen');
    };
    const handleFollowAll = (): void => {
        if (userId) {
            followAllMutation.mutate({ followerId: userId });
        }
    };

    return (
        <ScrollView bg="white">
            <VStack mt="5" px="4" space={4}>
                <Box>
                    <Text bold fontSize="xl" mb="4">
                        People You May Know
                    </Text>
                    {users?.map((user) => (
                        <ConnectionCard user={user} />
                    ))}
                </Box>
                <Button
                    colorScheme="primary"
                    isLoading={followAllMutation.isLoading}
                    leftIcon={(
                        <Icon
                            as={MaterialIcons}
                            color={followAllMutation.isSuccess ? 'green.500' : 'white'}
                            name={followAllMutation.isSuccess ? 'check' : 'add'}
                            size="sm"
                        />
                      )}
                    variant="solid"
                    onPress={handleFollowAll}
                >
                    Follow All
                </Button>
                <Button onPress={handleContinue}>Continue</Button>
            </VStack>
        </ScrollView>
    );
};
