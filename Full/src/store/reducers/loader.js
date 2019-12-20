import * as actionTypes from '../actions';

const initialState = {
    isLoading: false,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.START_LOADER:
            return {
                ...state,
                isLoading: true,
            };
        case actionTypes.STOP_LOADER:
            return {
                ...state,
                isLoading: false,
            };
        default:
            return state;
    }
};

export default reducer;
