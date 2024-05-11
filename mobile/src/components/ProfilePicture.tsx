import React from 'react';
import { Avatar, IAvatarProps, Text } from 'native-base';
import { UserFullInfoModel } from '../types/users';
import { UserInfo } from '../types/workouts';

interface ProfilePictureProps extends IAvatarProps {
    user: UserFullInfoModel | UserInfo;
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

export const ProfilePicture: React.FC<ProfilePictureProps> = ({ user, size = 'md', ...avatarProps }) => {
    const fontSize = sizes[size as keyof typeof sizes] || 24;

    const initials = user?.firstName || user?.lastName ? `${user?.firstName?.charAt(0).toUpperCase() ?? ''}${user?.lastName?.charAt(0).toUpperCase() ?? ''}` : user?.username?.charAt(0).toUpperCase() ?? '?';

    return (
        <Avatar
            alignItems="center"
            justifyContent="center"
            size={size}
            source={user?.profilePictureUrl ? { uri: user.profilePictureUrl } : undefined}
            {...avatarProps}
        >
            <Text color="white" fontSize={fontSize} fontWeight="bold">
                {initials}
            </Text>
        </Avatar>
    );
};
