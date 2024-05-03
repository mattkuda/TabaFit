import React from 'react';
import { IconButton, Icon } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

export const BackButton = (): JSX.Element => {
    const navigation = useNavigation<StackNavigationProp<any>>();

    return (
        <IconButton
            icon={<Icon as={Ionicons} color="gray6" name="arrow-back" size="lg" />}
            onPress={(): void => navigation.goBack()}
        />
    );
};
