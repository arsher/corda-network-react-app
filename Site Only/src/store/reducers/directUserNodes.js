import * as actionTypes from '../actions';

const initialState = {
    cordanetwork: {},
    uat: {},
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_DIRECT_USER_CORDANETWORK_NODECONFIG:
            return {
                ...state,
                cordanetwork: action.cordanetwork,
            };
        case actionTypes.SET_DIRECT_USER_UAT_NODECONFIG:
            return {
                ...state,
                uat: action.uat,
            };
        default:
            return state;
    }
};

export default reducer;
