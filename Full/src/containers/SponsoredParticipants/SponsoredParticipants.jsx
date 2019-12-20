import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import './SponsoredParticipants.scss';
import LoadingOverlay from 'react-loading-overlay';
import { connect } from 'react-redux';
import * as actionTypes from './../../store/actions';
import {
    axiosCountriesListGET,
    axiosParticipantPrimaryGET,
} from './../../axios/axios.jsx';
import SponsoredParticipantsTable from './../../components/SponsoredParticipantsTable/SponsoredParticipantsTable';
import LegalEntity from './../../components/Onboarding/LegalEntity/LegalEntity';
import LegalEntityConfirm from './../../components/Onboarding/LegalEntity/ConfirmLegalEntity/ConfirmLegalEntity';
import CreateNodeJoinNetwork from '../../components/CreateNodeJoinNetwork/CreateNodeJoinNetwork';
import CreateNodeConfig from '../../components/CreateNodeConfig/CreateNodeConfig';
import DownloadNodeConfig from '../../components/DownloadNodeConfig/DownloadNodeConfig';

class SponsoredParticipants extends Component {
    constructor(props) {
        super(props);

        this.state = {
            countriesList: [],
            isLoading: true,
        };
    }

    componentDidMount() {
        this.props.setStartingStep();
        axiosCountriesListGET().then((response) => {
            this.setState({
                countriesList: response.data,
            });
            axiosParticipantPrimaryGET().then((response) => {
                this.props.onSetLegalEntity(response.data);
                this.setState({ isLoading: false });
            });
        });
    }

    renderStep(stepName, countriesList) {
        switch (stepName) {
            case actionTypes.SHOW_SPONSORED_PARTICIPANTS:
                return <SponsoredParticipantsTable />;
            case actionTypes.SPONSOR_SELECT_LEGAL_ENTITY:
                return <LegalEntity countriesList={countriesList} />;
            case actionTypes.SPONSOR_CONFIRM_LEGAL_ENTITY:
                return <LegalEntityConfirm />;
            case actionTypes.SPONSEES_HOW_TO_SET_UP_A_NODE:
                return <CreateNodeJoinNetwork />;
            case actionTypes.CREATE_SPONSEE_NODE_CONFIG:
                return <CreateNodeConfig history={this.props.history} />;
            case actionTypes.DOWNLOAD_SPONSEE_NODE_CONFIG:
                return <DownloadNodeConfig history={this.props.history} />;
            default:
                return null;
        }
    }

    render() {
        const { countriesList } = this.state;
        return (
            <Fragment>
                {this.props.sponsorCurrentStepReducer.currentStep ===
                actionTypes.SHOW_SPONSORED_PARTICIPANTS ? (
                    <LoadingOverlay
                        active={this.state.isLoading}
                        spinner
                        text="Loading...">
                        <div className="container-fluid sponsored-participants bg-ghost-white">
                            <div className="row sponsored-participants-container">
                                <div className="col-10 offset-1">
                                    <SponsoredParticipantsTable />
                                </div>
                            </div>
                        </div>
                    </LoadingOverlay>
                ) : (
                    <div className="container-fluid sponsored-participants bg-ghost-white">
                        <div className="row sponsored-participants-container">
                            <div className="sponsored-participants-step box--flex">
                                {this.props.sponsorCurrentStepReducer
                                    .currentStep !==
                                    actionTypes.SPONSEES_HOW_TO_SET_UP_A_NODE &&
                                this.props.sponsorCurrentStepReducer
                                    .currentStep !==
                                    actionTypes.CREATE_SPONSEE_NODE_CONFIG &&
                                this.props.sponsorCurrentStepReducer
                                    .currentStep !==
                                    actionTypes.DOWNLOAD_SPONSEE_NODE_CONFIG ? (
                                    <Fragment>
                                        <div className="col-6 offset-1">
                                            {this.renderStep(
                                                this.props
                                                    .sponsorCurrentStepReducer
                                                    .currentStep,
                                                countriesList
                                            )}
                                        </div>
                                        <div className="col-4 sponsored-participants-step-text">
                                            <i className="mdi mdi-alert-octagram-outline"></i>
                                            <p>
                                                It’s important to pick the
                                                correct{' '}
                                                <Link to="/participation/legalentity">
                                                    legal entity
                                                </Link>{' '}
                                                for your participant’s Corda
                                                Network identity (and not a
                                                similar-sounding company). This
                                                will also be used in the node
                                                X500 name, will be visible in
                                                the network map.
                                            </p>
                                        </div>
                                    </Fragment>
                                ) : (
                                    <Fragment>
                                        {this.renderStep(
                                            this.props.sponsorCurrentStepReducer
                                                .currentStep,
                                            countriesList
                                        )}
                                    </Fragment>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        csr: state.csr.currentStep,
        ler: state.ler.legalEntity,
        loader: state.loader,
        str: state.str,
        ptr: state.ptr,
        sponsorCurrentStepReducer: state.sponsorCurrentStepReducer,
        sponsoredLegalEntityReducer:
            state.sponsoredLegalEntityReducer.legalEntity,
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
        setStartingStep: () =>
            dispatch({
                type: actionTypes.SHOW_SPONSORED_PARTICIPANTS,
            }),
        onSetLegalEntity: (legalEntity) =>
            dispatch({
                type: actionTypes.SET_SPONSOR_LEGAL_ENTITY,
                legalEntity: legalEntity,
            }),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SponsoredParticipants);
