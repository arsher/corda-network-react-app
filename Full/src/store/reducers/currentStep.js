import * as actionTypes from '../actions';

const initialState = {
    currentStep: null,
    isOnboardingCompleted: false,
    isParticipantPrimaryCompleted: false,
    isBliingDetailsCompleted: false,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.CURRENT_STEP_SELECT_PARTICIPANT_TYPE:
            return {
                ...state,
                currentStep: actionTypes.CURRENT_STEP_SELECT_PARTICIPANT_TYPE,
                isOnboardingCompleted: false,
            };
        case actionTypes.CURRENT_STEP_CONFIRM_PARTICIPANT_TYPE:
            return {
                ...state,
                currentStep: actionTypes.CURRENT_STEP_CONFIRM_PARTICIPANT_TYPE,
                isOnboardingCompleted: false,
            };
        case actionTypes.CURRENT_STEP_SELECT_LEGAL_ENTITY:
            return {
                ...state,
                currentStep: actionTypes.CURRENT_STEP_SELECT_LEGAL_ENTITY,
                isOnboardingCompleted: false,
            };
        case actionTypes.CURRENT_STEP_CONFIRM_LEGAL_ENTITY:
            return {
                ...state,
                currentStep: actionTypes.CURRENT_STEP_CONFIRM_LEGAL_ENTITY,
                isOnboardingCompleted: false,
            };
        case actionTypes.CURRENT_STEP_ENTER_BILLING_DETAILS:
            return {
                ...state,
                currentStep: actionTypes.CURRENT_STEP_ENTER_BILLING_DETAILS,
                isOnboardingCompleted: false,
                isParticipantPrimaryCompleted: true,
            };
        case actionTypes.CURRENT_STEP_REENTER_BILLING_DETAILS:
            return {
                ...state,
                currentStep: actionTypes.CURRENT_STEP_REENTER_BILLING_DETAILS,
                isOnboardingCompleted: false,
                isParticipantPrimaryCompleted: true,
                isBliingDetailsCompleted: true,
            };
        case actionTypes.CURRENT_STEP_CONFIRM_BILLING_DETAILS:
            return {
                ...state,
                currentStep: actionTypes.CURRENT_STEP_CONFIRM_BILLING_DETAILS,
                isOnboardingCompleted: false,
                isParticipantPrimaryCompleted: true,
            };
        case actionTypes.CURRENT_STEP_SIGN_TERMS:
            return {
                ...state,
                currentStep: actionTypes.CURRENT_STEP_SIGN_TERMS,
                isOnboardingCompleted: false,
                isParticipantPrimaryCompleted: true,
                isBliingDetailsCompleted: true,
            };
        case actionTypes.CURRENT_STEP_CONFIRM_SIGN_TERMS:
            return {
                ...state,
                currentStep: actionTypes.CURRENT_STEP_CONFIRM_SIGN_TERMS,
                isOnboardingCompleted: false,
                isParticipantPrimaryCompleted: true,
            };
        case actionTypes.CURRENT_STEP_IDENTITY_CHECKS:
            return {
                ...state,
                currentStep: actionTypes.CURRENT_STEP_IDENTITY_CHECKS,
                isOnboardingCompleted: false,
                isParticipantPrimaryCompleted: true,
            };
        case actionTypes.CURRENT_STEP_IDENTITY_COMPLETED:
            return {
                ...state,
                currentStep: actionTypes.CURRENT_STEP_IDENTITY_COMPLETED,
                isOnboardingCompleted: true,
                isParticipantPrimaryCompleted: true,
            };
        default:
            return state;
    }
};

export default reducer;
