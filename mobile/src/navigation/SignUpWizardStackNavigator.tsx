import { createStackNavigator } from '@react-navigation/stack';
import { WelcomeScreen } from '../components/WelcomeScreen';
import { SuggestedFollowsScreen } from '../components/SuggestedFollowsScreen';
import { SuggestedWorkoutsScreen } from '../components/SuggestedWorkoutsScreen';

const SignUpWizardStack = createStackNavigator();

export const SignUpWizardStackNavigator = (): JSX.Element => (
    <SignUpWizardStack.Navigator screenOptions={{ headerShown: false }}>
        <SignUpWizardStack.Screen component={WelcomeScreen} name="WelcomeScreen" />
        <SignUpWizardStack.Screen component={SuggestedFollowsScreen} name="SuggestedFollowsScreen" />
        <SignUpWizardStack.Screen component={SuggestedWorkoutsScreen} name="SuggestedWorkoutsScreen" />
    </SignUpWizardStack.Navigator>
);
