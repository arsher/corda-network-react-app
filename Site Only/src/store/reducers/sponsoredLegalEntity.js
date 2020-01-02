import * as actionTypes from '../actions';

const initialState = {
    legalEntity: {},
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_SPONSOR_LEGAL_ENTITY:
            return {
                ...state,
                legalEntity: action.legalEntity,
            };
        default:
            return state;
    }
};

export default reducer;
