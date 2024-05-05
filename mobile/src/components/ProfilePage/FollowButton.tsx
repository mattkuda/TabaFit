import React from 'react';
import { Button, Icon } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useFollowUser, useUnfollowUser } from '../../mutations/followMutations';
import { useQueryFollowing } from '../../hooks/useQueryFollowing';

type PropTypes = {
    profileUserId: string;
}

export const FollowButton = ({ profileUserId }: PropTypes): JSX.Element => {
    const { authState } = useAuth();
    const { userId } = authState;
    const {
        data, refetch, isLoading,
    } = useQueryFollowing(userId, profileUserId);
    const followMutation = useFollowUser();
    const unfollowMutation = useUnfollowUser();
    const isFollowing = data.find((follow) => follow._id === profileUserId);

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
        <Button
            disabled={isLoading}
            leftIcon={(
                <Icon
                    as={Ionicons}
                    name={isFollowing ? 'checkmark' : 'person-add-outline'}
                    size="sm"
                />
            )}
            variant={isFollowing ? 'outline' : 'solid'}
            onPress={isFollowing ? handleUnfollow : handleFollow}
        >
            {isFollowing ? 'Following' : 'Follow'}
        </Button>
    );
};
