import React from 'react';
import {
    HStack, VStack, Text, Box,
} from 'native-base';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { User } from '../../types/users';
import { formatName } from '../../util/util';
import { ProfilePageScreenNavigationProp } from '../../types/navigationTypes';
import { ProfilePicture } from '../ProfilePicture';

type NotificationCardProps = {
    user: User;
};

export const ConnectionCard: React.FC<NotificationCardProps> = ({ user }) => {
    const navigation = useNavigation<ProfilePageScreenNavigationProp>();
    const handlePressUser = (): void => {
        // Navigate to the ProfilePage with the userId as a parameter
        navigation.navigate('Profile', { userId: user._id });
    };

    return (
        <TouchableOpacity onPress={handlePressUser}>
            <Box backgroundColor="gray9" borderColor="gray.200" borderRadius="md" mt="2" p="4">
                <HStack alignItems="center" space={3}>
                    <ProfilePicture size="48px" user={user} />
                    <VStack>
                        <Text bold fontSize="sm">
                            {formatName(user.firstName, user.lastName)}
                        </Text>
                        <Text color="gray.600" fontSize="xs">
                            {`@${user.username}`}
                        </Text>
                    </VStack>
                </HStack>
            </Box>
        </TouchableOpacity>
    );
};
