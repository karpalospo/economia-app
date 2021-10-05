import { createStackNavigator,  } from "react-navigation-stack";

import SignIn from '../../views/sign/SignInView';
import SignUp from '../../views/sign/SignUpView';
import { COLORS } from '../../utils/constants';

export const SignRoutes = createStackNavigator({
    SignIn: {
        screen: SignIn,
        navigationOptions: ({ navigation }) => {
          const { params = {} } = navigation.state;
          return {
              headerShown: false,
          }
        },
    },
    SignUp: {
        screen: SignUp,
        navigationOptions: ({ navigation }) => {
          const { params = {} } = navigation.state;
          return {
              headerShown: false,
          }
        },
    },
},
{
  defaultNavigationOptions: {
    drawerLockMode: 'locked-closed',
  }
})