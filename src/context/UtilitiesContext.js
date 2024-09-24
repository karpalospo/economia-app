import React, { useState, createContext, useEffect } from 'react'

import AsyncStorage from '@react-native-async-storage/async-storage';

export const UtilitiesContext = createContext();

const Provider = ({ children }) => {

    const [location, setLocationState] = useState({})
    const [loading, setLoading] = useState(false)
    const [mustShowLocation, setMustShowLocation] = useState(false)

    const [user, setUserState] = useState({})
    const [cupones, setCuponesState] = useState({})
    const [cart, setCart] = useState({})
    const [cupon, setCuponState] = useState({})
    const [params, setParams] = useState({
        centroscostos: []
    })
    const [login, setLogin] = useState(async () => {

        try {
            setLoading(true)

            let _user = await AsyncStorage.getItem('user')
            if(_user) setUserState(JSON.parse(_user))
            let _location = await AsyncStorage.getItem('location')
            if(_location) setLocationState(JSON.parse(_location))
            let _cart = await AsyncStorage.getItem('cart')
            if(_cart) {
                setCart(JSON.parse(_cart))
            } else {
                setCart({
                    items:{},
                    total: 0,
                    itemsCount: 0
                })
            }

        


            setLoading(false)

        } catch (error) {
            setLoading(false)
        }
    })

    const setLocation = (location) => {
        setLocationState(location)
        AsyncStorage.setItem('location',JSON.stringify(location));  
    }

    const setUser = (user) => {
        setUserState(user)
        AsyncStorage.setItem('user',JSON.stringify(user));  
    }

    
    const setCupons = (cupons) => {
        setCuponesState(cupons)
    }
    const setCupon = (cupon) => {
        setCuponState(cupon)
    }

    const setCartItem = (id, quanty, sum = 0, product) => {
        
        let items = _setCart(id, quanty, sum, product),
            data = processCart(items),
            newCart = {
                items,
                total: data.total,
                itemsCount: data.count,
            }
        ;
        setCart(newCart)
        AsyncStorage.setItem('cart', JSON.stringify(newCart));
        
    }

    const rectificarCart = async (items) => {
        let newCart = {...cart}, data
        Object.keys(newCart.items).forEach(key => {
            const cartItem = newCart.items[key]
            let found = false

            delete cartItem._notFound
            delete cartItem._oldprice

            items.forEach(rectItem => {
                if(cartItem.id != rectItem.id) return;
                found = true
                if(cartItem.price != rectItem.price) {
                    cartItem._oldprice = cartItem.price
                    cartItem.price = rectItem.price
                }
            })
            if(!found) cartItem._notFound = true;
 
        })
        data = processCart(newCart.items),
        newCart = {...newCart, total: data.total, itemsCount: data.count,}

        setCart(newCart)
        await AsyncStorage.setItem('cart', JSON.stringify(newCart))
        return newCart
    }

    const clearCartItems = () => {
        let newCart = {
                items: {},
                total: 0,
                itemsCount: 0,
            }
        ;
        setCart(newCart)
        AsyncStorage.setItem('cart', JSON.stringify(newCart));
        //AsyncStorage.removeItem('location');
    }

    function processCart(items) {
        let total = 0,
            count = 0
        ;
        Object.keys(items).forEach(key => {
            let item = items[key]
            if(item._notFound) return
            let _t = item.price * item._quanty
            total += _t
            count += item._quanty
        })
        return({count, total})
    }

    function _setCart(id, quanty, sum = 0, product) {

        let _cart = {...cart.items}
        let item = _cart[id]
 
        if(item) {
            if(quanty != undefined && quanty > 0) {
                if(quanty < 1) quanty = 1
                if(quanty > item.stock) quanty = item.stock
                item._quanty = quanty
             } else {
                if(quanty <= 0 || item._quanty + sum <= 0) {
                    delete _cart[id]
                }
                else if(item._quanty + sum <= item.stock) {
                    item._quanty += sum
                }
            }
        } else if(quanty > 0) {
            _cart[id] = Object.assign({_date: new Date().getTime(), _quanty: Math.min(product.stock, quanty)}, product)
        }
        return _cart
    }

    const value = {
        loading,
        location,
        setLocation,
        user,
        setUser,
        cart,
        cupones,
        setCupons,
        cupon,
        setCupon,
        setCartItem,
        clearCartItems,
        rectificarCart,
        params,
        setParams,
        mustShowLocation,
        setMustShowLocation
    }

    return (
        <UtilitiesContext.Provider value={value}>
            {children}
        </UtilitiesContext.Provider>
    )
}
export default {
    Provider,
    Consumer: UtilitiesContext.Consumer
};