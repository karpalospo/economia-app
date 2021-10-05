import { createStore } from "redux";
import { REDUCER_SET_CATEGORIES } from "../utils/constants";

CategoriesReducer = (state = '', action) => {
    switch (action.type) {
        case REDUCER_SET_CATEGORIES:
        return {
            ...state,
            categories: action.categories,
        };
        default:
        return state;
    }
}

const CategoriesStore = createStore(CategoriesReducer, {categories: []});

export default CategoriesStore;