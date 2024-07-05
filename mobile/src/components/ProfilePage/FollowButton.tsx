import React, { useEffect } from 'react';
import { Button, Icon } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from 'react-query';
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
    const isFollowing = data?.length > 0;
    const queryClient = useQueryClient();

    const handleFollow = (): void => {
        if (userId) {
            followMutation.mutate({ followerId: userId, followeeId: profileUserId }, {
                onSuccess: () => {
                    refetch();
                    queryClient.invalidateQueries('userInfo');
                },
            });
        }
    };

    // Refetch user info only on component mount
    useEffect(() => {
        refetch();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleUnfollow = (): void => {
        if (userId) {
            unfollowMutation.mutate({ followerId: userId, followeeId: profileUserId }, {
                onSuccess: () => {
                    refetch();
                    queryClient.invalidateQueries('userInfo');
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
                    color={isFollowing ? 'flame.500' : 'white'}
                    name={isFollowing ? 'checkmark' : 'person-add-outline'}
                    size="sm"
                />
            )}
            size="sm"
            variant={isFollowing ? 'outline' : 'solid'}
            onPress={isFollowing ? handleUnfollow : handleFollow}
        >
            {isFollowing ? 'Following' : 'Follow'}
        </Button>
    );
};
