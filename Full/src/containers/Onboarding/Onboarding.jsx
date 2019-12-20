import React, { Component } from 'react';
import './Onboarding.scss';
import LoadingOverlay from 'react-loading-overlay';
import LegalEntity from '../../components/Onboarding/LegalEntity/LegalEntity';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions';
import LegalEntityConfirm from '../../components/Onboarding/LegalEntity/ConfirmLegalEntity/ConfirmLegalEntity';
import ParticipantType from '../../components/Onboarding/ParticipantType/ParticipantType';
import SponsorRole from '../../components/Onboarding/ParticipantType/SponsorRole/SponsorRole';
import BillingDetails from '../../components/Onboarding/BillingDetails/BillingDetails';
import ConfirmBillingDetails from '../../components/Onboarding/BillingDetails/ConfirmBillingDetails/ConfirmBillingDetails';
import Stepper from '../../components/Stepper/Stepper';
import TermsOfUse from '../../components/Onboarding/TermsOfUse/TermsOfUse';
import {
    axiosParticipantPrimaryGET,
    axiosBillingDetailsGET,
    axiosCountriesListGET,
    axiosIdentityCheckGET,
    axiosParticipantRetrievalTokenGET,
    axiosParticipantSignedTermsGET,
} from '../../axios/axios';
import IdentityChecks from '../../components/Onboarding/IdentityChecks/IdentityChecks';
import IdentityChecksFailed from '../../components/Onboarding/IdentityChecks/IdentityChecksFailed';

class Onboarding extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            countriesList: [],
            identityCheckStatus: '',
            identityCheckFailReason: null,
            isPageLoading: true,
        };
    }

    componentDidMount() {
        this._isMounted = true;
        // check if we have something on the api endpoint step by step
        axiosIdentityCheckGET()
            .then((response) => {
                if (response.data.status === 'SUCCESS') {
                    this.props.onCompleteIdentityChecks();
                    this.props.history.push({
                        pathname: 'dashboard',
                        state: {},
                    });
                    if (this._isMounted) {
                        this.setState({
                            isPageLoading: false,
                        });
                    }
                } else {
                    // in case of pending or missing
                    this.fetchInitialOnboardingData();
                }
            })
            .catch(() => {
                this.fetchInitialOnboardingData();
            });
    }

    fetchInitialOnboardingData() {
        axiosCountriesListGET()
            .then((response) => {
                if (this._isMounted) {
                    this.setState({
                        countriesList: response.data,
                    });
                }

                axiosParticipantPrimaryGET()
                    .then((response) => {
                        this.props.onSetParticipantType(response.data.type);
                        this.props.onSetLegalEntity(response.data);
                    })
                    .then(() => {
                        axiosBillingDetailsGET()
                            .then((response) => {
                                this.props.onSetBillingDetails(response.data);
                            })
                            .then(() => {
                                axiosParticipantRetrievalTokenGET()
                                    .then((response) => {
                                        axiosParticipantSignedTermsGET(
                                            response.data.token
                                        )
                                            .then((response) => {
                                                if (
                                                    response.data.length === 0
                                                ) {
                                                    this.props.onGoToTermsOfUse();
                                                    if (this._isMounted) {
                                                        this.setState({
                                                            isPageLoading: false,
                                                        });
                                                    }
                                                } else {
                                                    this.props.onSetSignedTerms(
                                                        response.data
                                                    );
                                                    this.props.onGoToIdentityChecks();
                                                    axiosIdentityCheckGET()
                                                        .then((response) => {
                                                            // PENDING,SUCCESS,FAILURE
                                                            if (
                                                                response.data
                                                                    .status ===
                                                                'SUCCESS'
                                                            ) {
                                                                this.props.history.push(
                                                                    {
                                                                        pathname:
                                                                            'dashboard',
                                                                        state: {},
                                                                    }
                                                                );
                                                                this.props.onCompleteIdentityChecks();
                                                            } else {
                                                                if (
                                                                    this
                                                                        ._isMounted
                                                                ) {
                                                                    this.setState(
                                                                        {
                                                                            identityCheckStatus:
                                                                                response
                                                                                    .data
                                                                                    .status,
                                                                            identityCheckFailReason:
                                                                                response
                                                                                    .data
                                                                                    .failReason,
                                                                            isPageLoading: false,
                                                                        }
                                                                    );
                                                                }
                                                            }
                                                        })
                                                        .catch((err) => {
                                                            this.handleAxiosError();
                                                        });
                                                }
                                            })
                                            .catch((err) => {
                                                this.handleAxiosError();
                                            });
                                    })
                                    .catch((err) => {
                                        this.handleAxiosError();
                                    });
                            })
                            .catch((err) => {
                                this.handleAxiosError();
                                this.props.onGoToBillingDetails();
                            });
                    })
                    .catch(() => {
                        this.props.setStartingStep();
                        this.handleAxiosError();
                    });
            })
            .catch(() => {
                this.handleAxiosError();
                this.props.history.push({
                    pathname: 'notfound',
                    state: {},
                });
            });
    }

    handleAxiosError() {
        if (this._isMounted) {
            this.setState({
                isPageLoading: false,
            });
        }
    }

    renderStep(stepName, countriesList) {
        switch (stepName) {
            case actionTypes.CURRENT_STEP_SELECT_PARTICIPANT_TYPE:
                return <ParticipantType />; /* falls through */
            case actionTypes.CURRENT_STEP_CONFIRM_PARTICIPANT_TYPE:
                return <SponsorRole />; /* falls through */
            case actionTypes.CURRENT_STEP_SELECT_LEGAL_ENTITY:
                return (
                    <LegalEntity countriesList={countriesList} />
                ); /* falls through */
            case actionTypes.CURRENT_STEP_CONFIRM_LEGAL_ENTITY:
                return <LegalEntityConfirm />; /* falls through */
            case actionTypes.CURRENT_STEP_ENTER_BILLING_DETAILS:
                return (
                    <BillingDetails countriesList={countriesList} />
                ); /* falls through */
            case actionTypes.CURRENT_STEP_REENTER_BILLING_DETAILS:
                return (
                    <BillingDetails countriesList={countriesList} />
                ); /* falls through */
            case actionTypes.CURRENT_STEP_CONFIRM_BILLING_DETAILS:
                return (
                    <ConfirmBillingDetails
                        startLoader={() => this.startLoader()}
                        stopLoader={() => this.stopLoader()}
                    />
                ); /* falls through */
            case actionTypes.CURRENT_STEP_SIGN_TERMS:
                return (
                    <TermsOfUse
                        startLoader={() => this.startLoader()}
                        stopLoader={() => this.stopLoader()}
                        history={this.props.history}
                    />
                ); /* falls through */
            case actionTypes.CURRENT_STEP_IDENTITY_CHECKS:
                if (
                    this.state.identityCheckStatus === '' ||
                    this.state.identityCheckStatus === 'PENDING'
                ) {
                    return (
                        <IdentityChecks history={this.props.history} />
                    ); /* falls through */
                } else if (
                    this.state.identityCheckStatus !== '' &&
                    this.state.identityCheckStatus === 'FAILURE'
                ) {
                    return (
                        <IdentityChecksFailed
                            failReason={this.state.identityCheckFailReason}
                        />
                    ); /* falls through */
                }
            /* falls through */
            default:
                return null;
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    startLoader() {
        this.setState({
            isPageLoading: true,
        });
    }

    stopLoader() {
        this.setState({
            isPageLoading: false,
        });
    }

    render() {
        const { countriesList } = this.state;
        return (
            <LoadingOverlay
                active={this.state.isPageLoading}
                spinner
                text="Loading...">
                <div className="container-fluid bg-ghost-white onboarding pt-60 pb-30">
                    <div className="row">
                        {/* CURRENT STEP */}
                        <div className="col-6 offset-1">
                            {this.renderStep(
                                this.props.csr.currentStep,
                                countriesList
                            )}
                        </div>
                        {/* ONBOARDING TIMELINE STEPS */}
                        <div className="col-4">
                            {this.props.csr.currentStep !== null && (
                                <Stepper
                                    identityCheckStatus={
                                        this.state.identityCheckStatus
                                    }
                                    currentStep={this.props.csr.currentStep}
                                />
                            )}
                        </div>
                    </div>
                </div>{' '}
            </LoadingOverlay>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        ler: state.ler.legalEntity,
        loader: state.loader,
        csr: state.csr,
        uar: state.uar,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setStartingStep: () =>
            dispatch({
                type: actionTypes.CURRENT_STEP_SELECT_PARTICIPANT_TYPE,
            }),
        onGoToTermsOfUse: () =>
            dispatch({
                type: actionTypes.CURRENT_STEP_SIGN_TERMS,
            }),
        onGoToBillingDetails: () =>
            dispatch({
                type: actionTypes.CURRENT_STEP_ENTER_BILLING_DETAILS,
            }),
        onGoToIdentityChecks: () =>
            dispatch({
                type: actionTypes.CURRENT_STEP_IDENTITY_CHECKS,
            }),
        onCompleteIdentityChecks: () =>
            dispatch({
                type: actionTypes.CURRENT_STEP_IDENTITY_COMPLETED,
            }),
        onStartLoader: () =>
            dispatch({
                type: actionTypes.START_LOADER,
                isLoading: true,
            }),
        onStopLoader: () =>
            dispatch({
                type: actionTypes.STOP_LOADER,
                isLoading: false,
            }),
        onSetLegalEntity: (legalEntity) =>
            dispatch({
                type: actionTypes.SET_LEGAL_ENTITY,
                legalEntity: legalEntity,
            }),
        onSetParticipantType: (type) =>
            dispatch({
                type: actionTypes.SET_PARTICIPANT_TYPE,
                participantType: type,
            }),
        onSetBillingDetails: (billingDetails) =>
            dispatch({
                type: actionTypes.SET_BILLING_DETAILS,
                billingDetails: billingDetails,
            }),
        onClearUserAuthorization: () =>
            dispatch({
                type: actionTypes.REMOVE_USER_AUTHORIZATION,
            }),
        onSetSignedTerms: (terms) =>
            dispatch({
                type: actionTypes.SET_SIGNED_TERMS,
                terms: terms,
            }),
        onRemoveUserRole: () =>
            dispatch({
                type: actionTypes.REMOVE_USER_ROLE,
            }),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Onboarding);
