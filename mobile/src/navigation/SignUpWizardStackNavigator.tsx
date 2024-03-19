import { createStackNavigator } from '@react-navigation/stack';
import { Button } from 'native-base';
import { useSetRecoilState } from 'recoil';
import { WelcomeScreen } from '../components/WelcomeScreen';
import { SuggestedFollowsScreen } from '../components/SuggestedFollowsScreen';
import { SuggestedWorkoutsScreen } from '../components/SuggestedWorkoutsScreen';
import { wizardTodoState } from '../atoms/wizardTodoAtom';

const SignUpWizardStack = createStackNavigator();

const SkipButton = (): JSX.Element => {
    const setWizardTodo = useSetRecoilState(wizardTodoState);

    const handleSaveOrUpdateWorkout = (): void => {
        setWizardTodo(false);
    };

    return (
        <Button
            colorScheme="muted" // Use the 'muted' color scheme or any other to get a light gray color, adjust based on your theme
            variant="ghost"
            onPress={handleSaveOrUpdateWorkout}
        >
            Skip
        </Button>

    );
};

export const SignUpWizardStackNavigator = (): JSX.Element => (
    <SignUpWizardStack.Navigator>
        <SignUpWizardStack.Screen
            component={WelcomeScreen}
            name="WelcomeScreen"
            options={{
                headerRight: SkipButton,
            }}
        />
        <SignUpWizardStack.Screen
            component={SuggestedFollowsScreen}
            name="SuggestedFollowsScreen"
            options={{
                headerRight: SkipButton,
            }}
        />
        <SignUpWizardStack.Screen
            component={SuggestedWorkoutsScreen}
            name="SuggestedWorkoutsScreen"
            options={{
                headerRight: SkipButton,
            }}
        />
    </SignUpWizardStack.Navigator>
);
