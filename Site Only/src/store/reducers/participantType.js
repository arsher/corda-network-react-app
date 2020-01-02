import * as actionTypes from '../actions';

const initialState = {
    participantType: '',
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_PARTICIPANT_TYPE:
            return {
                ...state,
                participantType: action.participantType,
            };
        default:
            return state;
    }
};

export default reducer;
