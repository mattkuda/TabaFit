import React, { useState } from 'react';
import {
    Box, Menu, Icon, IconButton,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const MoreOptionsTrigger = (triggerProps: any): JSX.Element => (
    <Box>
        <IconButton
            {...triggerProps}
            _icon={{
                color: 'white',
                size: 'lg',
            }}
            borderRadius="full"
            color="primary"
            icon={<Icon as={Ionicons} name="settings" />}
        />
    </Box>
);

export const DebugModeButton = (): JSX.Element => {
    const [showMenu, setShowMenu] = useState(false);
    const authState = useAuth();

    const { resetTutorial, hasSeenTutorial } = useAuth();

    const togglewizardActive = async (): Promise<void> => {
        await resetTutorial();
    };

    return (
        <Box>
            <Menu
                isOpen={showMenu}
                trigger={MoreOptionsTrigger}
                w="190"
                onClose={(): void => setShowMenu(false)}
                onOpen={(): void => setShowMenu(true)}
            >
                <Menu.Item>
                    {`EXPO_PUBLIC_EAS_API_BASE_URL: ${process.env.EXPO_PUBLIC_EAS_API_BASE_URL}`}
                </Menu.Item>
                <Menu.Item>
                    {`EXPO_PUBLIC_TOKEN_KEY: ${process.env.EXPO_PUBLIC_TOKEN_KEY}`}
                </Menu.Item>
                <Menu.Item onPress={togglewizardActive}>
                    {`Toggle hasSeenTutorial (${hasSeenTutorial === true ? 'T' : 'F'})`}
                </Menu.Item>
                <Menu.Item>
                    {`EXPO_PUBLIC_ENVIRONMENT: ${process.env.EXPO_PUBLIC_ENVIRONMENT}`}
                </Menu.Item>
                <Menu.Item>
                    {`AuthState: ${JSON.stringify(authState)} )`}
                </Menu.Item>
            </Menu>
        </Box>
    );
};
