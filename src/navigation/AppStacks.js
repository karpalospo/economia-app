import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'


import Home from '../screens/Home'
import Busqueda from '../screens/Busqueda'
import Categorias from '../screens/Categorias'
import CategoriaView from '../screens/CategoriaView'
import Cart from '../screens/Cart'
import Checkout from '../screens/Checkout'
import Profile from '../screens/Profile'


const Stack = createStackNavigator()

const AppStacks = () => {
    
    return (
        <Stack.Navigator initialRouteName={"Home"}>
            <Stack.Screen name='Home' component={Home} options={{ headerShown:false }}/>
            <Stack.Screen name='Busqueda' component={Busqueda} options={{ headerShown:false }}/>
            <Stack.Screen name='Categorias' component={Categorias} options={{ headerShown:false }}/>
            <Stack.Screen name='CategoriaView' component={CategoriaView} options={{ headerShown:false }}/>
            <Stack.Screen name='Cart' component={Cart} options={{ headerShown:false }}/>
            <Stack.Screen name='Checkout' component={Checkout} options={{ headerShown:false }}/>
            <Stack.Screen name='Profile' component={Profile} options={{ headerShown:false }}/>
        </Stack.Navigator>
    )
}
export default AppStacks