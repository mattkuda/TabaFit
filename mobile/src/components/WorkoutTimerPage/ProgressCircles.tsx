import React from 'react';
import { HStack, Box } from 'native-base';

type ProgressCirclesProps = {
    count: number;
    done: number;
    active: number;
};

export const ProgressCircles: React.FC<ProgressCirclesProps> = ({ count, done, active }) => {
    const circles = [];

    for (let i = 0; i < count; i++) {
        let color = 'gray.200'; // Default color for not started circles

        if (i < done) {
            color = 'green.500'; // Filled in green for done circles
        } else if (i === active) {
            color = 'yellow.500'; // Yellow for currently active circle
        }

        circles.push(
            <Box
                bg={color}
                borderRadius="full"
                h="10px"
                key={i}
                mx="2"
                w="10px"
            />,
        );
    }

    return <HStack>{circles}</HStack>;
};
