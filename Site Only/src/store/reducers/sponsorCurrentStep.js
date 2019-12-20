import * as actionTypes from '../actions';

const initialState = {
    createNodeInProgress: false,
    networkType: '',
    participantId: null,
    currentStep: actionTypes.CURRENT_STEP_STOP_NODE_CREATION,
    nodeDetails: {
        organisationUnit: '',
        commonName: '',
        state: '',
        nodeOperatorEmail: '',
    },
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SHOW_SPONSORED_PARTICIPANTS:
            return {
                ...state,
                currentStep: actionTypes.SHOW_SPONSORED_PARTICIPANTS,
            };
        case actionTypes.SPONSOR_SELECT_LEGAL_ENTITY:
            return {
                ...state,
                currentStep: actionTypes.SPONSOR_SELECT_LEGAL_ENTITY,
            };
        case actionTypes.SPONSOR_CONFIRM_LEGAL_ENTITY:
            return {
                ...state,
                currentStep: actionTypes.SPONSOR_CONFIRM_LEGAL_ENTITY,
            };
        case actionTypes.SPONSEES_HOW_TO_SET_UP_A_NODE:
            return {
                ...state,
                currentStep: actionTypes.SPONSEES_HOW_TO_SET_UP_A_NODE,
            };
        case actionTypes.CREATE_SPONSEE_NODE_CONFIG:
            return {
                ...state,
                currentStep: actionTypes.CREATE_SPONSEE_NODE_CONFIG,
                createNodeInProgress: true,
                networkType: action.networkType,
                participantId: action.participantId,
                nodeDetails: action.payload,
            };
        case actionTypes.DOWNLOAD_SPONSEE_NODE_CONFIG:
            return {
                ...state,
                currentStep: actionTypes.DOWNLOAD_SPONSEE_NODE_CONFIG,
                createNodeInProgress: true,
            };
        case actionTypes.CURRENT_STEP_STOP_NODE_CREATION:
            return {
                ...state,
                currentStep: actionTypes.CURRENT_STEP_STOP_NODE_CREATION,
                createNodeInProgress: false,
            };
        default:
            return state;
    }
};

export default reducer;
