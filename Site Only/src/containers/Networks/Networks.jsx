import React, { Component } from 'react';
import './Networks.scss';
import LoadingOverlay from 'react-loading-overlay';
import { connect } from 'react-redux';
import * as actionTypes from './../../store/actions';
import { handleApiError } from '../../utils/utils';
import {
    axiosParticipantPrimaryGET,
    axiosBillingDetailsGET,
    axiosParticipantRetrievalTokenGET,
    axiosParticipantSignedTermsGET,
    nodeConfigGET,
} from '../../axios/axios';
import CertificatesTable from '../../components/CertificatesTable/CertificatesTable';
import CreateNodeJoinNetwork from '../../components/CreateNodeJoinNetwork/CreateNodeJoinNetwork';
import CreateNodeConfig from '../../components/CreateNodeConfig/CreateNodeConfig';
import DownloadNodeConfig from '../../components/DownloadNodeConfig/DownloadNodeConfig';

class Networks extends Component {
    constructor(props) {
        super(props);

        this.state = {
            companyDetails: null,
            billingDetails: null,
            isLoading: true,
        };
        this.props.setStartingStep();
    }

    componentDidMount() {
        axiosParticipantPrimaryGET()
            .then((response) => {
                this.setState({
                    companyDetails: response.data,
                });
                this.props.onSetParticipantType(response.data.type);
                this.props.onSetLegalEntity(response.data);
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
                                    })
                                    .catch((err) => {
                                        handleApiError(err);
                                        this.setState({ isLoading: false });
                                    });
                                // this.setState({ isLoading: false });
                            })
                            .catch((err) => {
                                handleApiError(err);
                                this.setState({ isLoading: false });
                            });
                        this.setState({ isLoading: false });
                    })
                    .catch((err) => {
                        handleApiError(err);
                        this.setState({ isLoading: false });
                    });
            })
            .catch((err) => {
                handleApiError(err);
                this.setState({ isLoading: false });
            });
    }

    isAllDataLoaded() {
        return !!this.state.companyDetails && !!this.state.billingDetails;
    }

    renderStep(stepName) {
        switch (stepName) {
            case actionTypes.SHOW_CERTIFICATES:
                return <CertificatesTable />;
            case actionTypes.NETWORKS_HOW_TO_SET_UP_A_NODE:
                return <CreateNodeJoinNetwork />;
            case actionTypes.CURRENT_STEP_START_NODE_CREATION:
                return <CreateNodeConfig />;
            case actionTypes.CURRENT_STEP_DOWNLOAD_NODE_CONFIG:
                return <DownloadNodeConfig />;
            default:
                return null;
        }
    }

    render() {
        const isAllDataLoaded = this.isAllDataLoaded();
        return (
            <div className="container-fluid networks bg-ghost-white">
                <div className="row networks-container">
                    <LoadingOverlay
                        active={this.state.isLoading}
                        spinner
                        text="Loading...">
                        {isAllDataLoaded &&
                            this.renderStep(this.props.cnr.currentStep)}
                    </LoadingOverlay>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        cnr: state.cnr,
        str: state.str,
        uar: state.uar,
        loader: state.loader,
        dnr: state.dnr,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setStartingStep: () =>
            dispatch({
                type: actionTypes.SHOW_CERTIFICATES,
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

export default connect(mapStateToProps, mapDispatchToProps)(Networks);
