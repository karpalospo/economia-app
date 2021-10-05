import { createStackNavigator,  } from "react-navigation-stack";
import Profile from "../../views/profile/ProfileView";
import AddressList from "../../views/address/AddressListView";
import AddNewAddressView from "../../views/address/AddNewAddressView";
import EditProfileView from "../../views/profile/EditProfileView";

export const ProfileRoutes = createStackNavigator({
    Profile: {
        screen: Profile,
        navigationOptions: ({ navigation }) => ({
            headerShown: false,
        })
    },
    EditProfile: {
        screen: EditProfileView,
        navigationOptions: ({ navigation }) => ({
            headerShown: false,
        })
    },
    AddressList: {
        screen: AddressList,
        navigationOptions: ({ navigation }) => ({
            headerShown: false,
        })
    },
    AddNewAddress: {
        screen: AddNewAddressView,
        navigationOptions: ({ navigation }) => ({
            headerShown: false,
        })
    }    
}, 
{
    initialRouteName: 'Profile',
})