import React from 'react';
import {
    Avatar, IAvatarProps, Icon, Text, Image,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { UserFullInfoModel } from '../types/users';
import { UserInfo } from '../types/workouts';
// @ts-ignore
import logo from '../../assets/tabafit-icon.png';

interface ProfilePictureProps extends IAvatarProps {
    user: UserFullInfoModel | UserInfo;
    showEdit?: boolean;
    isTabaFitAdmin?: boolean;
}

const sizes = {
    xs: 14,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 40,
    '1xl': 48,
    '2xl': 56,
    '3xl': 64,
    '4xl': 72,
    '5xl': 80,
    '6xl': 96,
};

export const ProfilePicture: React.FC<ProfilePictureProps> = ({
    user, isTabaFitAdmin, size = 'md', showEdit, ...avatarProps
}) => {
    const fontSize = sizes[size as keyof typeof sizes] || 24;

    const initials = user?.firstName || user?.lastName ? `${user?.firstName?.charAt(0).toUpperCase() ?? ''}${user?.lastName?.charAt(0).toUpperCase() ?? ''}` : user?.username?.charAt(0).toUpperCase() ?? '?';

    let profilePictureSource;

    if (isTabaFitAdmin) {
        return (
            <Image
                alt="TabaFit Logo"
                size={fontSize + 4}
                source={logo}
            />
        );
    }

    if (user?.profilePictureUrl) {
        profilePictureSource = { uri: user.profilePictureUrl };
    }

    return (
        <Avatar
            alignItems="center"
            justifyContent="center"
            size={size}
            source={profilePictureSource}
            {...avatarProps}
        >
            <Text color="white" fontSize={fontSize} fontWeight="bold">
                {initials}
            </Text>
            {showEdit && (
            <Avatar.Badge bg="flame.500" borderColor="flame.500">
                <Icon as={Ionicons} color="white" name="pencil" pl={1.9} pt={1.1} size="sm" />
            </Avatar.Badge>
            )}
        </Avatar>
    );
};
