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
                color: 'flame',
                size: 'md',
            }}
            borderRadius="full"
            color="flame"
            icon={<Icon as={Ionicons} name="settings" size="md" />}
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
                <Menu.Item onPress={togglewizardActive}>
                    {`Toggle wizardActive (${wizardActive ? 'T' : 'F'})`}
                </Menu.Item>
                <Menu.Item>
                    {`AuthState: ${JSON.stringify(authState)} )`}
                </Menu.Item>
            </Menu>
        </Box>
    );
};
