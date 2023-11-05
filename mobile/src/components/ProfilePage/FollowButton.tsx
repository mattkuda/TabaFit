// components/FollowButton.js
import React from 'react';
import { Button, Text } from 'native-base';
import { useAuth } from '../../context/AuthContext';
import { useFollowUser, useUnfollowUser } from '../../mutations/followMutations';
import { useQueryFollowing } from '../../hooks/useQueryFollowing';

type PropTypes = {
    profileUserId: string;
}

export const FollowButton = ({ profileUserId }: PropTypes): JSX.Element => {
    // eslint-disable-next-line no-underscore-dangle
    const { userId } = useAuth().authState;
    // eslint-disable-next-line no-underscore-dangle
    const { data, refetch } = useQueryFollowing(userId, profileUserId);
    const followMutation = useFollowUser();
    const unfollowMutation = useUnfollowUser();

    const handleFollow = (): void => {
        followMutation.mutate({ followerId: userId.toString(), followeeId: profileUserId }, {
            onSuccess: () => {
                refetch(); // Refetch following status after following
            },
        });
    };

    const handleUnfollow = (): void => {
        unfollowMutation.mutate({ followerId: userId.toString(), followeeId: profileUserId }, {
            onSuccess: () => {
                refetch(); // Refetch following status after unfollowing
            },
        });
    };

    if (data === undefined) {
        return <Text>{userId}</Text>;
    }

    return (
        <Button onPress={data.length ? handleUnfollow : handleFollow}>
            {data.length ? 'Unfollow' : 'Follow'}
        </Button>
    );
};
