import * as actionTypes from '../actions';

const initialState = {
    billingDetails: {
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        address: {
            addressCountry: {
                name: '',
                isoAlpha2Code: '',
            },
            addressLocality: {
                name: '',
            },
            addressRegion: {
                name: '',
                abbreviatedName: '',
            },
            postalCode: '',
            streetAddress: {
                line1: '',
                line2: '',
            },
        },
    },
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_BILLING_DETAILS:
            return {
                ...state,
                billingDetails: action.billingDetails,
            };
        default:
            return state;
    }
};

export default reducer;
