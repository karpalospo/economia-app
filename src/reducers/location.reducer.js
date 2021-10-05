import { createStore } from "redux";
import { REDUCER_SAVE_LOCATION } from "../utils/constants";

LocationReducer = (state = '', action) => {
    switch (action.type) {
        case REDUCER_SAVE_LOCATION:
            return {
                ...state,
                location: action.location,
                locationName: action.locationName,
            };
        default:
            return state;
    }
}

const LocationStore = createStore(LocationReducer, {location: '', locationName: ''});

export default LocationStore;