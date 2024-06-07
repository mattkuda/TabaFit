import React, { useState } from 'react';
import {
    Box, Menu, Icon, IconButton,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useRecoilState } from 'recoil';
import { wizardActiveState } from '../atoms/wizardActiveAtom';
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
    // const setwizardActive = useSetRecoilState(wizardActiveState);
    const [wizardActive, setwizardActive] = useRecoilState(wizardActiveState);
    const authState = useAuth();

    const togglewizardActive = (): void => {
        setwizardActive((prev) => !prev);
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
                    {`Toggle wizardActive (${wizardActive ? 'T' : 'F'})`}
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
