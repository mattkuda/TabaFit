import React from 'react';
import { VStack } from 'native-base';

export const GradientVStack = ({ children, ...props }): JSX.Element => (
    <VStack
        bg={{
            linearGradient: {
                colors: ['gray.800', 'gray.900'],
                start: [0, 0], // Top left
                end: [0, 1], // Bottom left (creates vertical gradient)
            },
        }}
        flex={1}
        {...props}
    >
        {children}
    </VStack>
);
