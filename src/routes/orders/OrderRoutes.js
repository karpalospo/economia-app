import { createStackNavigator,  } from "react-navigation-stack";
import OrderHistoryView from "../../views/orders/OrderHistoryView";
import OrderDetails from "../../views/orders/OrderDetailsView";

export const OrderRoutes = createStackNavigator({
    Orders: {
        screen: OrderHistoryView,
        navigationOptions: ({ navigation }) => ({
            header: () => null,
        })
    },  
    OrderDetails: {
        screen: OrderDetails,
        navigationOptions: ({ navigation }) => ({
            header: () => null,
        })
    },  
}, 
{
    initialRouteName: 'Orders',
})