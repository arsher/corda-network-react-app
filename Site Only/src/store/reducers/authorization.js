import * as actionTypes from '../actions';
import { getCookie } from '../../helpers/authorizationService';

const initialState = {
    isUserAuthorized: !!getCookie('authorizationKey').length,
    authorizationToken: getCookie('authorizationKey'),
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_USER_AUTHORIZATION:
            return {
                ...state,
                authorizationToken: action.authorizationToken,
                isUserAuthorized: !!action.authorizationToken.length,
            };
        case actionTypes.REMOVE_USER_AUTHORIZATION:
            return {
                ...state,
                authorizationToken: '',
                isUserAuthorized: false,
            };
        default:
            return state;
    }
};

export default reducer;
