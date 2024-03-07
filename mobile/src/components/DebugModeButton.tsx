import React, { useState } from 'react';
import {
    Box, Menu, Icon, IconButton,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useSetRecoilState } from 'recoil';
import { wizardTodoState } from '../atoms/wizardTodoAtom';

const MoreOptionsTrigger = (triggerProps: any): JSX.Element => (
    <Box>
        <IconButton
            {...triggerProps}
            borderRadius="full"
            icon={<Icon as={Ionicons} name="settings-outline" />}
        />
    </Box>
);

export const DebugModeButton = (): JSX.Element => {
    const [showMenu, setShowMenu] = useState(false);
    const setWizardTodo = useSetRecoilState(wizardTodoState);

    const toggleWizardTodo = (): void => {
        setWizardTodo((prev) => !prev);
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
                <Menu.Item onPress={toggleWizardTodo}>Toggle wizardTodo</Menu.Item>
            </Menu>
        </Box>
    );
};
