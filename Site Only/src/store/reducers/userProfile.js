import * as actionTypes from '../actions';
import { getCookie } from '../../helpers/authorizationService';

const initialState = {
    names: '',
    email: '',
    role: getCookie('userRole'),
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_USER_PROFILE:
            return {
                ...state,
                names: action.names,
                email: action.email,
            };
        case actionTypes.SET_USER_ROLE:
            return {
                ...state,
                role: action.role,
            };
        case actionTypes.REMOVE_USER_ROLE:
            return {
                ...state,
                names: '',
                email: '',
                role: '',
            };
        default:
            return state;
    }
};

export default reducer;
