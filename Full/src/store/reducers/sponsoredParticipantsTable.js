import * as actionTypes from '../actions';

const initialState = {
    sponsoredParticipants: [],
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SHOW_SPONSORED_PARTICIPANTS:
            return {
                ...state,
                sponsoredParticipants: action.sponsoredParticipants,
            };
        default:
            return state;
    }
};

export default reducer;
