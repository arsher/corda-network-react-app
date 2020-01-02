import * as actionTypes from '../actions';

const initialState = {
    createNodeInProgress: false,
    networkType: '',
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
        case actionTypes.SHOW_CERTIFICATES:
            return {
                ...state,
                currentStep: actionTypes.SHOW_CERTIFICATES,
                networkType: action.networkType,
            };
        case actionTypes.NETWORKS_HOW_TO_SET_UP_A_NODE:
            return {
                ...state,
                currentStep: actionTypes.NETWORKS_HOW_TO_SET_UP_A_NODE,
            };
        case actionTypes.CURRENT_STEP_START_NODE_CREATION:
            return {
                ...state,
                currentStep: actionTypes.CURRENT_STEP_START_NODE_CREATION,
                createNodeInProgress: true,
                networkType: action.networkType,
            };
        case actionTypes.CURRENT_STEP_CREATE_NODE_CONFIG:
            return {
                ...state,
                currentStep: actionTypes.CURRENT_STEP_CREATE_NODE_CONFIG,
                createNodeInProgress: true,
                nodeDetails: action.payload,
            };
        case actionTypes.CURRENT_STEP_DOWNLOAD_NODE_CONFIG:
            return {
                ...state,
                currentStep: actionTypes.CURRENT_STEP_DOWNLOAD_NODE_CONFIG,
                networkType: action.networkType,
                createNodeInProgress: true,
            };
        case actionTypes.UPGRADE_TO_PRODUCTION_NETWORK:
            return {
                ...state,
                currentStep: actionTypes.UPGRADE_TO_PRODUCTION_NETWORK,
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
