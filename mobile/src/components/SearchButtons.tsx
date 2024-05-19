import React, { } from 'react';
import {
    Icon, IconButton,
} from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { SearchScreenNavigationProp } from '../navigation/navigationTypes';

export const Searchbutton = (): JSX.Element => {
    const navigation = useNavigation<SearchScreenNavigationProp>();

    return (
        <IconButton
            _icon={{
                color: 'primary',
            }}
            borderRadius="full"
            icon={<Icon as={Ionicons} name="search" size="md" />}
            onPress={(): void => navigation.navigate('Search')}
        />
    );
};
