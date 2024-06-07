import React, { } from 'react';
import {
    Icon, IconButton,
} from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { SearchScreenNavigationProp } from '../navigation/navigationTypes';

export const SearchButton = (): JSX.Element => {
    const navigation = useNavigation<SearchScreenNavigationProp>();

    return (
        <IconButton
            _icon={{
                color: 'white',
            }}
            borderRadius="full"
            icon={<Icon as={Ionicons} name="search" size="lg" />}
            onPress={(): void => navigation.navigate('Search')}
        />
    );
};
