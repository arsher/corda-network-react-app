import * as actionTypes from '../actions';

const initialState = {
    terms: [],
    currentTerm: {},
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_SIGNED_TERMS:
            return {
                ...state,
                terms: action.terms,
            };
        case actionTypes.SET_CURRENT_TERMS:
            return {
                ...state,
                currentTerm: action.currentTerm,
            };
        default:
            return state;
    }
};

export default reducer;
