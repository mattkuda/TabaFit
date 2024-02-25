import { createStackNavigator } from '@react-navigation/stack';
import { WelcomeScreen } from '../components/WelcomeScreen';

const SignUpWizardStack = createStackNavigator();

export const SignUpWizardStackNavigator = (): JSX.Element => (
    <SignUpWizardStack.Navigator screenOptions={{ headerShown: false }}>
        <SignUpWizardStack.Screen component={WelcomeScreen} name="WelcomeScreen" />
    </SignUpWizardStack.Navigator>
);
