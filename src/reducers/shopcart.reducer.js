import { createStore } from "redux";
import { REDUCER_SET_SHOP_CART, REDUCER_SET_SHOP_CART_QUANTITY } from "../utils/constants";

ShopCartReducer = (state = '', action) => {
    switch (action.type) {
        case REDUCER_SET_SHOP_CART:
            return {
                ...state,
                products: action.products,
            }
        case REDUCER_SET_SHOP_CART_QUANTITY:
            return {
                ...state,
                quantity: action.quantity,
            }
        default:
            return state;
    }
}

export const ShopCartStore = createStore(ShopCartReducer, {products: [], quantity: null});