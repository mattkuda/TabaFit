import { createStackNavigator } from '@react-navigation/stack';
import { Button, useTheme } from 'native-base';
import { WelcomeScreen } from '../components/WelcomeScreen';
import { SuggestedFollowsScreen } from '../components/SuggestedFollowsScreen';
import { SuggestedWorkoutsScreen } from '../components/SuggestedWorkoutsScreen';
import { TutorialScreen } from '../components/TutorialScreen';
import { TabataExplanationScreen } from '../components/TabataExplanationScreen';
import { useAuth } from '../context/AuthContext';

const SignUpWizardStack = createStackNavigator();

const SkipButton = (): JSX.Element => {
    const { completeTutorial } = useAuth();

    const handleSkip = (): void => {
        completeTutorial();
    };

    return (
        <Button
            colorScheme="muted"
            variant="ghost"
            onPress={handleSkip}
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
                    backgroundColor: colors.gray[800],
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
                component={TabataExplanationScreen}
                name="TabataExplanationScreen"
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
