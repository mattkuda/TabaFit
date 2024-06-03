import React from 'react';
import {
    Box, IAvatarProps, Text,
} from 'native-base';
import { UserInfo } from '../types/workouts';
import { ProfilePicture } from './ProfilePicture';
import { UserFullInfoModel } from '../types/users';

interface ProfilePictureProps extends IAvatarProps {
    user?: UserFullInfoModel | UserInfo;

}

export const PictureWithName: React.FC<ProfilePictureProps> = ({
    user,
}) => {
    const isTabaFitAdmin = user?.username === 'tabafit';

    return (
        <Box alignItems="center" flexDirection="row">
            <ProfilePicture isTabaFitAdmin={isTabaFitAdmin} size="xs" user={user} />
            <Text style={{ marginLeft: 8 }}>
                {isTabaFitAdmin ? 'TabaFit' : `${user?.firstName} ${user?.lastName}`}
            </Text>
        </Box>
    );
};
