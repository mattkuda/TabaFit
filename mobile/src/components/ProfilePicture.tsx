import React from 'react';
import { Avatar, IAvatarProps, Text } from 'native-base';
import { UserFullInfoModel } from '../types/users';
import { UserInfo } from '../types/workouts';

interface ProfilePictureProps extends IAvatarProps {
    user: UserFullInfoModel | UserInfo;
}

export const ProfilePicture: React.FC<ProfilePictureProps> = ({ user, ...avatarProps }) => {
    // Get the initials from the user's name, else use the first letter of the username
    const initials = user?.firstName || user?.lastName ? `${user?.firstName?.charAt(0) ?? ''}${user?.lastName?.charAt(0) ?? ''}` : user?.username?.charAt(0) ?? '';

    return (
        <Avatar
            source={user?.profilePictureUrl ? { uri: user.profilePictureUrl } : undefined}
            {...avatarProps}
        >
            <Text color="white" fontSize="5xl" fontWeight="bold">
                {initials}
            </Text>
        </Avatar>
    );
};
