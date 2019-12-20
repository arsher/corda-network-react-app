import React, { Component } from 'react';
import './DownloadNodeConfig.scss';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions';
import {
    nodeConfigGET,
    sponseeNodeConfigGET,
    nodeConfigDownload,
} from '../../axios/axios';
import { handleApiError, downloadNodeConfigFile } from '../../utils/utils';

class DownloadNodeConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nodeConfig: null,
            sponseeNodeConfig: null,
        };
    }

    componentDidMount() {
        if (
            this.props.sponsorCurrentStepReducer.currentStep ===
            actionTypes.DOWNLOAD_SPONSEE_NODE_CONFIG
        ) {
            sponseeNodeConfigGET(
                this.props.sponsorCurrentStepReducer.participantId,
                this.props.sponsorCurrentStepReducer.networkType
            )
                .then((response) => {
                    this.setState({
                        sponseeNodeConfig: new Blob([response.data], {
                            type: 'text/plain',
                        }),
                    });
                })
                .catch((err) => {
                    handleApiError(err);
                });
        } else {
            nodeConfigGET(this.props.cnr.networkType).then((response) => {
                const payload = response.data;
                if (this.props.cnr.networkType === 'UAT') {
                    this.props.onSetDirectUserUatNode(payload);
                } else {
                    this.props.onSetDirectUserCordanetworkNode(payload);
                }
            });
            nodeConfigDownload(this.props.cnr.networkType)
                .then((response) => {
                    this.setState({
                        nodeConfig: new Blob([response.data], {
                            type: 'text/plain',
                        }),
                    });
                })
                .catch((err) => {
                    handleApiError(err);
                });
        }
    }

    downloadNodeConfig() {
        if (
            this.props.sponsorCurrentStepReducer.currentStep ===
            actionTypes.DOWNLOAD_SPONSEE_NODE_CONFIG
        ) {
            downloadNodeConfigFile(this.state.sponseeNodeConfig);
        } else {
            downloadNodeConfigFile(this.state.nodeConfig);
        }
    }

    handleBackAction() {
        if (
            this.props.sponsorCurrentStepReducer.currentStep ===
            actionTypes.DOWNLOAD_SPONSEE_NODE_CONFIG
        ) {
            this.props.onBackSponsoredParticipants();
        } else {
            this.props.onBackCertificateDetails();
        }
    }

    render() {
        const { nodeConfig, sponseeNodeConfig } = this.state;

        return (
            <div className="conatiner-fluid download-node-config bg-ghost-white">
                <div className="box--flex">
                    <div className="col-6 offset-1">
                        <div className="bg-white download">
                            <h1 className="text-center h3">
                                Download{' '}
                                {(this.props.cnr.networkType === 'UAT' ||
                                    this.props.sponsorCurrentStepReducer
                                        .networkType === 'UAT') &&
                                    'Pre-'}
                                Production Node Config File
                            </h1>
                            <div className="h-splitter"></div>
                            <p className="text-center">
                                Please, save the node.conf file in{' '}
                                <span>location/location</span> folder. You can
                                read more on deploying your node in the{' '}
                                <a href="https://docs.corda.net/deploying-a-node.html">
                                    documentation
                                </a>
                                .
                            </p>

                            <div className="box--flex center--x">
                                <button
                                    onClick={() => this.downloadNodeConfig()}
                                    className="btn btn-download box box--flex center--y center--XxX mb-20">
                                    <div className="box box--flex center--y">
                                        <i className="mdi mdi-download"></i>
                                        <div className="template-name">
                                            node.conf
                                        </div>
                                    </div>
                                    {this.props.sponsorCurrentStepReducer
                                        .currentStep ===
                                    actionTypes.DOWNLOAD_SPONSEE_NODE_CONFIG ? (
                                        <div className="size">
                                            {sponseeNodeConfig
                                                ? sponseeNodeConfig.size
                                                : 0}{' '}
                                            Bytes
                                        </div>
                                    ) : (
                                        <div className="size">
                                            {nodeConfig ? nodeConfig.size : 0}{' '}
                                            Bytes
                                        </div>
                                    )}
                                </button>
                            </div>

                            <div className="h-splitter"></div>

                            <p className="text-center pl-30 pr-30">
                                You need to submit your CSR irure dolor in
                                reprehenderit in voluptate velit esse cillum
                                dolore eu fugiat nulla pariatur.
                            </p>
                            <div className="box--flex center--x">
                                <button
                                    type="button"
                                    data-toggle="button"
                                    aria-pressed="false"
                                    className="btn btn-link m-0 mb-20">
                                    submit csr
                                </button>
                            </div>
                            <div className="h-splitter"></div>
                            <div className="box--flex center--x">
                                <button
                                    onClick={() => this.handleBackAction()}
                                    type="button"
                                    data-toggle="button"
                                    aria-pressed="false"
                                    className="btn btn-link m-0 mt-10">
                                    back
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-4 info">
                        <div>
                            <i className="mdi mdi-alert-octagram-outline"></i>
                        </div>
                        <div className="info__text">
                            Corda Network runs an X509 certificate authority.
                            For a node's{' '}
                            <a href="https://corda.network/participation/legalentity.html">
                                X509 name
                            </a>
                            , there are 6 fields. 3 are mandatory fields:
                            Organisation (O), Locality (L), Country (C); and 3
                            additional fields you may fill out: Organisation
                            Unit (OU), State (S), and Common Name (CN) for every
                            node you wish to onboard.
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        ler: state.ler.legalEntity,
        loader: state.loader,
        csr: state.csr,
        uar: state.uar,
        cnr: state.cnr,
        ptr: state.ptr,
        sponsorCurrentStepReducer: state.sponsorCurrentStepReducer,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onBackCertificateDetails: () =>
            dispatch({
                type: actionTypes.SHOW_CERTIFICATES,
            }),
        onBackSponsoredParticipants: () =>
            dispatch({
                type: actionTypes.SHOW_SPONSORED_PARTICIPANTS,
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

export default connect(mapStateToProps, mapDispatchToProps)(DownloadNodeConfig);
