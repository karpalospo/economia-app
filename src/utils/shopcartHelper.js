import { AsyncStorage } from "react-native";
import { ShopCartStore } from "../reducers/shopcart.reducer";
import { REDUCER_SET_SHOP_CART, REDUCER_SET_SHOP_CART_QUANTITY } from "./constants";

export const SetProductsInShopCart = async (products) => 
{
    await AsyncStorage.setItem("lac", Date.now().toString())
    await AsyncStorage.setItem('shopcart', JSON.stringify(products));

    const totalProductsInCart = await GetTotalProductsInShopCart()

    ShopCartStore.dispatch({type: REDUCER_SET_SHOP_CART, products})
    ShopCartStore.dispatch({type: REDUCER_SET_SHOP_CART_QUANTITY, quantity: totalProductsInCart})
}


export const GetProductsInShopCart = async () => 
{
    let products = JSON.parse(await AsyncStorage.getItem('shopcart'));

    if(!products)
    {
        products = [];
    }

    return products;
}


export const AddToShopCart = async (product, qty) => 
{
    let products = JSON.parse(await AsyncStorage.getItem('shopcart'));

    if(products)
    {
        let added = false;

        for (let index = 0; index < products.length; index++) {
            if(products[index].id == product.id)
            {
                products[index].qty += parseInt(qty);
                added = true;
            }
        }

        if(!added)
        {
            products.push({...product, qty: parseInt(qty)});
        }
    }
    else
    {
        await AsyncStorage.setItem("lac", Date.now().toString())
        products = [{...product, qty: parseInt(qty)}];
    }

    const totalProductsInCart = await GetTotalProductsInShopCart()

    ShopCartStore.dispatch({type: REDUCER_SET_SHOP_CART, products})
    ShopCartStore.dispatch({type: REDUCER_SET_SHOP_CART_QUANTITY, quantity: totalProductsInCart})
    await AsyncStorage.setItem('shopcart', JSON.stringify(products));

    return {products, totalProductsInCart};
}


export const EditShopCart = async (productId, qty) => 
{
    let products = JSON.parse(await AsyncStorage.getItem('shopcart'));

    for (let index = 0; index < products.length; index++) {
        if(products[index].id == productId)
        {
            products[index].qty = qty;
        }
    }

    const totalProductsInCart = await GetTotalProductsInShopCart()

    ShopCartStore.dispatch({type: REDUCER_SET_SHOP_CART, products})
    ShopCartStore.dispatch({type: REDUCER_SET_SHOP_CART_QUANTITY, quantity: totalProductsInCart})
    await AsyncStorage.setItem('shopcart', JSON.stringify(products));

    return {products, totalProductsInCart};
}


export const RemoveProductInShopCart = async (productId) => 
{
    let products = JSON.parse(await AsyncStorage.getItem('shopcart'));
    let productIndex = -1;

    for (let index = 0; index < products.length; index++) {
        if(products[index].id == productId)
        {
            productIndex = index;
            return;
        }
    }

    if(productIndex != -1)
    {
        products.splice(productIndex, 1);
    }

    const totalProductsInCart = await GetTotalProductsInShopCart()

    ShopCartStore.dispatch({type: REDUCER_SET_SHOP_CART, products})
    ShopCartStore.dispatch({type: REDUCER_SET_SHOP_CART_QUANTITY, quantity: totalProductsInCart})
    await AsyncStorage.setItem('shopcart', JSON.stringify(products));
    
    return {products, totalProductsInCart};
}


export const GetTotalProductsInShopCart = async () => 
{
    let total = 0;
    let products = JSON.parse(await AsyncStorage.getItem('shopcart'));

    if(products)
    {
        for (let index = 0; index < products.length; index++) {
            total += products[index].qty;
        }
    }

    return total;
}