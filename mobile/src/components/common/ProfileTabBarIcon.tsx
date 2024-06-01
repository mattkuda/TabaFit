import React from 'react';
import { Image } from 'react-native';

type TabBarIconProps = {
    focused: boolean;
    color: string;
    size: number;
};

export const ProfileTabBarIcon: React.FC<TabBarIconProps> = ({ focused, color, size }) => (
    <Image
        alt="profile icon"
        source={{ uri: '../../../assets/icon.png' }} // Adjust the path to your image
        style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            tintColor: focused ? color : 'gray', // This line is optional, in case you want to change the image color when it is focused
        }}
    />
);

// Then, in your Tab.Screen
