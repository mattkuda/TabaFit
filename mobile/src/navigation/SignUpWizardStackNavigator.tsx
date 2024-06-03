import { createStackNavigator } from '@react-navigation/stack';
import { Button, useTheme } from 'native-base';
import { useSetRecoilState } from 'recoil';
import { WelcomeScreen } from '../components/WelcomeScreen';
import { SuggestedFollowsScreen } from '../components/SuggestedFollowsScreen';
import { SuggestedWorkoutsScreen } from '../components/SuggestedWorkoutsScreen';
import { wizardActiveState } from '../atoms/wizardActiveAtom';
import { TutorialScreen } from '../components/TutorialScreen';

const SignUpWizardStack = createStackNavigator();

const SkipButton = (): JSX.Element => {
    const setwizardActive = useSetRecoilState(wizardActiveState);

    const handleSaveOrUpdateWorkout = (): void => {
        setwizardActive(false);
    };

    return (
        <Button
            colorScheme="muted"
            variant="ghost"
            onPress={handleSaveOrUpdateWorkout}
        >
            Skip
        </Button>

    );
};

export const SignUpWizardStackNavigator = (): JSX.Element => {
    const { colors } = useTheme();

    return (
        <SignUpWizardStack.Navigator
            screenOptions={{
                headerTitle: '',
                headerStyle: {
                    backgroundColor: colors.gray[900],
                },
                headerTintColor: 'white',
                headerShadowVisible: false,
            }}
        >
            <SignUpWizardStack.Screen
                component={WelcomeScreen}
                name="WelcomeScreen"
                options={{
                    headerRight: SkipButton,
                    headerLeft: () => null,
                }}

            />
            <SignUpWizardStack.Screen
                component={TutorialScreen}
                name="TutorialScreen"
                options={{
                    headerRight: SkipButton,
                    headerLeft: () => null,
                }}
            />
            <SignUpWizardStack.Screen
                component={SuggestedFollowsScreen}
                name="SuggestedFollowsScreen"
                options={{
                    headerRight: SkipButton,
                    headerLeft: () => null,
                }}
            />
            <SignUpWizardStack.Screen
                component={SuggestedWorkoutsScreen}
                name="SuggestedWorkoutsScreen"
                options={{
                    headerRight: SkipButton,
                    headerLeft: () => null,
                }}
            />
        </SignUpWizardStack.Navigator>
    );
};
