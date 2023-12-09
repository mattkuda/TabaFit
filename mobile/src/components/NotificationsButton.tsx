import React, { } from 'react';
import { Icon, IconButton } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { NotificationsScreenNavigationProp } from '../navigation/navigationTypes';

export const NotificationsButton = (): JSX.Element => {
    const navigation = useNavigation<NotificationsScreenNavigationProp>();

    return (
        <IconButton
            _icon={{
                color: 'primary.500',
                size: 'md',
            }}
            borderRadius="full"
            icon={<Icon as={Ionicons} name="notifications-outline" size="sm" />}
            onPress={(): void => navigation.navigate('NotificationsScreen')}
        />
    );
};
