import React, { Component } from 'react';
import './Dashboard.scss';
import LoadingOverlay from 'react-loading-overlay';
import CompanyDetails from '../../components/Dashboard/CompanyDetails/CompanyDetails';
import BillingDetails from '../../components/Dashboard/BillingDetails/BillingDetails';
import Membership from '../../components/Dashboard/Membership/Membership';
import ActiveNetworks from '../../components/Dashboard/ActiveNetworks/ActiveNetworks';
import CertificateDetails from '../../components/Dashboard/CertificateDetails/CertificateDetails';
import { connect } from 'react-redux';
import {
    axiosParticipantPrimaryGET,
    axiosBillingDetailsGET,
    axiosParticipantRetrievalTokenGET,
    axiosParticipantSignedTermsGET,
    nodeConfigGET,
} from '../../axios/axios';
import * as actionTypes from '../../store/actions';
import Aux from '../../hoc/Auxillary/Auxillary';
import { handleApiError } from '../../utils/utils';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.props.onStartLoader();
        this.state = {
            companyDetails: null,
            billingDetails: null,
            allDataLoaded: false,
        };
    }

    isAllDataLoaded() {
        return !!this.state.companyDetails && !!this.state.billingDetails;
    }

    UNSAFE_componentWillMount() {
        axiosParticipantPrimaryGET()
            .then((response) => {
                this.setState({
                    companyDetails: response.data,
                });
                this.props.onSetParticipantType(response.data.type);
                this.props.onSetLegalEntity(response.data);
                this.props.onStopLoader();
            })
            .then(() => {
                axiosParticipantRetrievalTokenGET()
                    .then((response) => {
                        axiosParticipantSignedTermsGET(response.data.token)
                            .then((response) => {
                                this.props.onSetSignedTerms(response.data);
                                axiosBillingDetailsGET()
                                    .then((response) => {
                                        this.setState({
                                            billingDetails: response.data,
                                        });
                                        this.props.onSetBillingDetails(
                                            response.data
                                        );
                                    })
                                    .then(() => {
                                        nodeConfigGET('CORDANETWORK').then(
                                            (response) => {
                                                const payload = response.data;
                                                this.props.onSetDirectUserCordanetworkNode(
                                                    payload
                                                );
                                            }
                                        );
                                    })
                                    .then(() => {
                                        nodeConfigGET('UAT').then(
                                            (response) => {
                                                const payload = response.data;
                                                this.props.onSetDirectUserUatNode(
                                                    payload
                                                );
                                            }
                                        );
                                        this.props.onStopLoader();
                                    })
                                    .catch((err) => {
                                        this.props.onStopLoader();
                                        handleApiError(err);
                                    });
                            })
                            .catch((err) => {
                                handleApiError(err);
                                this.props.onStopLoader();
                            });
                    })
                    .catch((err) => {
                        handleApiError(err);
                        this.props.onStopLoader();
                    });
            })
            .catch((err) => {
                handleApiError(err);
                this.props.onStopLoader();
            });
    }

    render() {
        const { companyDetails, billingDetails } = this.state;
        const isAllDataLoaded = this.isAllDataLoaded();

        return (
            <LoadingOverlay
                active={this.props.loader.isLoading}
                spinner
                text="Loading...">
                <div className="conatiner-fluid dashboard bg-ghost-white">
                    {isAllDataLoaded && (
                        <Aux>
                            <div className="row">
                                <div className="col-1"></div>
                                <div className="col-10">
                                    <div className="box--flex center--y center--xxX status-message">
                                        <div>
                                            See Corda Network{' '}
                                            <a
                                                href="https://cordanetwork.statuspage.io/"
                                                target="_blank"
                                                rel="noopener noreferrer">
                                                Statuspage
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-1"></div>
                            </div>

                            <div className="row">
                                <div className="col-1"></div>
                                <div className="col-5">
                                    <CertificateDetails />
                                    <ActiveNetworks />
                                    <Membership />
                                </div>
                                <div className="col-5">
                                    <CompanyDetails
                                        companyDetails={companyDetails}
                                    />
                                    <BillingDetails
                                        companyDetails={companyDetails}
                                        billingDetails={billingDetails}
                                    />
                                </div>
                                <div className="col-1"></div>
                            </div>
                        </Aux>
                    )}
                </div>
            </LoadingOverlay>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        uar: state.uar,
        loader: state.loader,
        dnr: state.dnr,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
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
        onSetBillingDetails: (billingDetails) =>
            dispatch({
                type: actionTypes.SET_BILLING_DETAILS,
                billingDetails: billingDetails,
            }),
        onSetParticipantType: (type) =>
            dispatch({
                type: actionTypes.SET_PARTICIPANT_TYPE,
                participantType: type,
            }),
        onSetSignedTerms: (terms) =>
            dispatch({
                type: actionTypes.SET_SIGNED_TERMS,
                terms: terms,
            }),
        onSetDirectUserCordanetworkNode: (cordanetwork) =>
            dispatch({
                type: actionTypes.SET_DIRECT_USER_CORDANETWORK_NODECONFIG,
                cordanetwork: cordanetwork,
            }),
        onSetDirectUserUatNode: (uat) =>
            dispatch({
                type: actionTypes.SET_DIRECT_USER_UAT_NODECONFIG,
                uat: uat,
            }),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
