import { createStore } from "redux";
import { REDUCER_SET_ADDRESS, REDUCER_SET_DEFAULT_ADDRESS } from "../utils/constants";

AddressReducer = (state = '', action) => {
    switch (action.type) {
        case REDUCER_SET_ADDRESS:
            return {
                ...state,
                addresses: action.addresses,
            };
        case REDUCER_SET_DEFAULT_ADDRESS:
            return {
                ...state,
                defaultAddress: action.defaultAddress,
            }
        default:
            return state;
    }
}

const AddressStore = createStore(AddressReducer, {addresses: [], defaultAddress: -1});

export default AddressStore;