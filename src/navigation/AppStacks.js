import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'


import Home from '../screens/Home'
import Busqueda from '../screens/Busqueda'
import Categorias from '../screens/Categorias'
import Cart from '../screens/Cart'
import Checkout from '../screens/Checkout'
import Profile from '../screens/Profile'
import Registro from '../screens/Registro'


const Stack = createStackNavigator()

const AppStacks = () => {
    
    return (
        <Stack.Navigator initialRouteName={"Home"}>
            <Stack.Screen name='Home' component={Home} options={{ headerShown:false }}/>
            <Stack.Screen name='Busqueda' component={Busqueda} options={{ headerShown:false }}/>
            <Stack.Screen name='Categorias' component={Categorias} options={{ headerShown:false }}/>
            <Stack.Screen name='Cart' component={Cart} options={{ headerShown:false }}/>
            <Stack.Screen name='Checkout' component={Checkout} options={{ headerShown:false }}/>
            <Stack.Screen name='Profile' component={Profile} options={{ headerShown:false }}/>
            <Stack.Screen name='Registro' component={Registro} options={{ headerShown:false }}/>
        </Stack.Navigator>
    )
}
export default AppStacks