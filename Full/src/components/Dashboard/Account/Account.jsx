import React, { Component } from 'react';
import './Acocount.scss';
import LoadingOverlay from 'react-loading-overlay';
import CompanyDetails from '../../../components/Dashboard/CompanyDetails/CompanyDetails';
import {
    axiosParticipantPrimaryGET,
    axiosBillingDetailsGET,
    axiosParticipantRetrievalTokenGET,
    axiosParticipantSignedTermsGET,
} from '../../../axios/axios';
import { handleApiError } from '../../../utils/utils';
import * as actionTypes from '../../../store/actions';
import { connect } from 'react-redux';
import AccountContacts from '../AccountContacts/AccountContacts';
import ActiveNetworks from '../ActiveNetworks/ActiveNetworks';

class Account extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            companyDetails: null,
            isAllDataLoaded: false,
        };
    }

    UNSAFE_componentWillMount() {
        axiosParticipantPrimaryGET()
            .then((response) => {
                this.setState({
                    companyDetails: response.data,
                });
                this.props.onSetParticipantType(response.data.type);
                this.props.onSetLegalEntity(response.data);
                axiosParticipantRetrievalTokenGET()
                    .then((response) => {
                        axiosParticipantSignedTermsGET(response.data.token)
                            .then((response) => {
                                this.props.onSetSignedTerms(response.data);
                                if (this.props.upr.role !== 'signer') {
                                    axiosBillingDetailsGET()
                                        .then((response) => {
                                            this.setState({
                                                billingDetails: response.data,
                                            });
                                            this.props.onSetBillingDetails(
                                                response.data
                                            );
                                            this.setState({
                                                isLoading: false,
                                                isAllDataLoaded: true,
                                            });
                                        })
                                        .catch((err) => {
                                            this.setState({
                                                isLoading: false,
                                            });
                                            handleApiError(err);
                                        });
                                } else {
                                    this.setState({
                                        isLoading: false,
                                        isAllDataLoaded: true,
                                    });
                                }
                            })
                            .catch((err) => {
                                handleApiError(err);
                                this.setState({
                                    isLoading: false,
                                });
                            });
                    })
                    .catch((err) => {
                        handleApiError(err);
                        this.setState({
                            isLoading: false,
                        });
                    });
            })
            .catch((err) => {
                handleApiError(err);
                this.setState({
                    isLoading: false,
                });
            });
    }

    isAllDataLoaded() {
        if (this.props.upr.role !== 'signer') {
            return !!this.state.billingDetails && !!this.state.companyDetails;
        } else {
            return !!this.state.companyDetails;
        }
    }

    render() {
        const { companyDetails, isAllDataLoaded } = this.state;

        return (
            <LoadingOverlay
                active={this.state.isLoading}
                spinner
                text="Loading...">
                <div className="container-fluid bg-ghost-white">
                    {isAllDataLoaded && (
                        <div className="row account-container">
                            <div className="col-6 offset-1">
                                <CompanyDetails
                                    companyDetails={companyDetails}
                                />
                                <ActiveNetworks />
                            </div>
                            <div className="col-4">
                                <AccountContacts />
                            </div>
                        </div>
                    )}
                </div>
            </LoadingOverlay>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        upr: state.upr,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
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
        onSetSignedTerms: (terms) =>
            dispatch({
                type: actionTypes.SET_SIGNED_TERMS,
                terms: terms,
            }),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Account);
