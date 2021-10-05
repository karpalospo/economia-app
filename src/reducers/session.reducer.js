import { createStore } from "redux";
import { REDUCER_SET_SESSION, REDUCER_RESET_SESSION } from "../utils/constants";

SessionReducer = (state = '', action) => {
    switch (action.type) {
        case REDUCER_SET_SESSION:
            return {
                ...state,
                session: {
                    token: action.session.token,
                    email: action.session.email,
                    name: action.session.name,
                    document: action.session.document,
                }
            }
        case REDUCER_RESET_SESSION:
            return {
                ...state,
                session: {
                    document: "",
                    token: "",
                    email: "",
                    name: "",
                }
            }
        default:
            return state;
    }
}

const SessionStore = createStore(SessionReducer, {session: {email: '', name: '', token: '', document: ''}});

export default SessionStore;