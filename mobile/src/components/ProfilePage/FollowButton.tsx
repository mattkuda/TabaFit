import React from 'react';
import { Button } from 'native-base';
import { useAuth } from '../../context/AuthContext';
import { useFollowUser, useUnfollowUser } from '../../mutations/followMutations';
import { useQueryFollowing } from '../../hooks/useQueryFollowing';

type PropTypes = {
    profileUserId: string;
}

export const FollowButton = ({ profileUserId }: PropTypes): JSX.Element => {
    const { authState } = useAuth();
    const userId = authState?.userId;
    const {
        data, refetch, isLoading,
    } = useQueryFollowing(userId, profileUserId);
    const followMutation = useFollowUser();
    const unfollowMutation = useUnfollowUser();

    const handleFollow = (): void => {
        if (userId) {
            followMutation.mutate({ followerId: userId, followeeId: profileUserId }, {
                onSuccess: () => {
                    refetch();
                },
            });
        }
    };

    const handleUnfollow = (): void => {
        if (userId) {
            unfollowMutation.mutate({ followerId: userId, followeeId: profileUserId }, {
                onSuccess: () => {
                    refetch(); // Refetch following status after unfollowing
                },
            });
        }
    };

    return (
        <Button disabled={isLoading} onPress={data?.length ? handleUnfollow : handleFollow}>
            {data?.length ? 'Unfollow' : 'Follow'}
        </Button>
    );
};
