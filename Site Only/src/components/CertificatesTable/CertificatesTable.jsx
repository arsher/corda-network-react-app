import React, { Fragment } from 'react';
import './CertificatesTable.scss';
import { NavLink } from 'react-router-dom';
import LoadingOverlay from 'react-loading-overlay';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions';
import { handleApiError } from '../../utils/utils';
import {
    nodeConfigDownload,
    axiosSignatureRequestsGET,
} from '../../axios/axios';
import { downloadNodeConfigFile } from '../../utils/utils';

class CertificatesTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            productionType: 'preproduction',
            nodeConfigPreprodFile: null,
            nodeConfigProdFile: null,
            pendingProductionTerms: false,
            isLoading: true,
        };

        this.setPreproduction = this.setPreproduction.bind(this);
        this.setProduction = this.setProduction.bind(this);
    }

    componentDidMount() {
        axiosSignatureRequestsGET()
            .then((response) => {
                console.log(response);
                if (response.data.length > 0) {
                    this.setState({
                        pendingProductionTerms: true,
                    });
                    this.setState({ isLoading: false });
                }
            })
            .then(() => {
                nodeConfigDownload('UAT').then((response) => {
                    this.setState({
                        nodeConfigPreprodFile: new Blob([response.data], {
                            type: 'text/plain',
                        }),
                    });
                });
                nodeConfigDownload('CORDANETWORK').then((response) => {
                    this.setState({
                        nodeConfigProdFile: new Blob([response.data], {
                            type: 'text/plain',
                        }),
                    });
                });
            })
            .catch((err) => {
                handleApiError(err);
                this.setState({ isLoading: false });
            });
        this.setState({ isLoading: false });
    }

    createNode() {
        this.props.sponsorCurrentStepReducer.currentStep =
            actionTypes.CURRENT_STEP_STOP_SPONSEE_NODE_CREATION;
        this.props.onStartCreateNodeConfig();
    }

    setPreproduction() {
        this.setState({
            productionType: 'preproduction',
        });
    }

    setProduction() {
        this.setState({
            productionType: 'production',
        });
    }

    downloadNodeConfig() {
        if (this.state.productionType === 'preproduction') {
            downloadNodeConfigFile(this.state.nodeConfigPreprodFile);
        } else {
            downloadNodeConfigFile(this.state.nodeConfigProdFile);
        }
    }

    upgradeToProductionNetwork() {
        this.props.onStartUpgradeToProductionNetwork();
    }

    renderCertificateDetails(type) {
        const { nodeConfigPreprodFile, nodeConfigProdFile } = this.state;
        const organization = this.props.dnr[type].organization;
        const organizationalUnit = this.props.dnr[type].organizationalUnit;
        const country = this.props.dnr[type].country;
        const locality = this.props.dnr[type].locality;
        const state = this.props.dnr[type].state;
        const commonName = this.props.dnr[type].commonName;
        const email = this.props.dnr[type].email;
        const backupEmail = this.props.dnr[type].backupEmail;

        return (
            <div className="certificate-details">
                <div className="field box box--flex center--y">
                    <div className="name">Organisation name:</div>
                    <div className="value">{organization}</div>
                </div>
                <div className="field box box--flex center--y">
                    <div className="name">Organisation unit:</div>
                    <div className="value">{organizationalUnit}</div>
                </div>
                <div className="field box box--flex center--y">
                    <div className="name">Country:</div>
                    <div className="value">{country}</div>
                </div>
                <div className="field box box--flex center--y">
                    <div className="name">Locality:</div>
                    <div className="value">{locality}</div>
                </div>
                {state && (
                    <Fragment>
                        <div className="field box box--flex center--y">
                            <div className="name">State:</div>
                            <div className="value text-right">{state}</div>
                        </div>
                    </Fragment>
                )}
                {commonName && (
                    <Fragment>
                        <div className="field box box--flex center--y">
                            <div className="name">Common name:</div>
                            <div className="value text-right">{commonName}</div>
                        </div>
                    </Fragment>
                )}
                <div className="field box box--flex center--y">
                    <div className="name">Node operator email address:</div>
                    <div className="value text-right">{email}</div>
                </div>
                <div className="field box box--flex center--y">
                    <div className="name">
                        Backup node operator email address:
                    </div>
                    <div className="value text-right">{backupEmail}</div>
                </div>
                <button
                    onClick={() => this.downloadNodeConfig()}
                    className="btn btn-download box box--flex center--y">
                    <div className="box box--flex center--y">
                        <i className="mdi mdi-download"></i>
                        <div className="template-name">node.conf</div>
                    </div>
                    {this.state.productionType === 'preproduction' ? (
                        <div className="size">
                            {nodeConfigPreprodFile
                                ? nodeConfigPreprodFile.size
                                : 0}{' '}
                            bytes
                        </div>
                    ) : (
                        <div className="size">
                            {nodeConfigProdFile ? nodeConfigProdFile.size : 0}{' '}
                            bytes
                        </div>
                    )}
                </button>
                <div className="info box--flex center--y">
                    <i className="mdi mdi-desktop-mac-dashboard"></i>
                    <p>
                        You can create only one config file per network, at the
                        moment. Lorem Ipsum dolor sit amet
                    </p>
                </div>
            </div>
        );
    }

    goToSetUpNodeInfo() {
        this.props.onGoToSetUpNodeInfo();
    }

    render() {
        let preproduction, production;

        if (this.props.str.terms[0].agreementContext === 'UAT') {
            if (
                this.props.str.terms[1] &&
                this.props.str.terms[1].agreementContext === 'CORDANETWORK'
            ) {
                if (
                    Object.entries(this.props.dnr.cordanetwork).length === 0 &&
                    this.props.dnr.cordanetwork.constructor === Object
                ) {
                    production = (
                        <div className="no-certificates">
                            <i className="mdi mdi-file-document-box-remove-outline"></i>
                            <div className="subtitle">
                                You have no certificates yet!
                            </div>
                            <p>
                                Please, select the “New config file” button
                                above, to create your first node config file.
                            </p>
                        </div>
                    );
                } else if (
                    Object.entries(this.props.dnr.cordanetwork).length !== 0
                ) {
                    production = this.renderCertificateDetails('cordanetwork');
                }
            } else {
                if (this.state.pendingProductionTerms) {
                    production = (
                        <div className="no-certificates join-production-network">
                            <i className="mdi mdi-account-clock-outline yellow"></i>
                            <div className="subtitle text-yellow mt-5">
                                Please Wait, for the Agreement to be Signed
                            </div>
                            <p className="text-center mb-25">
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua. Ut
                                enim ad minim veniam, quis nostrud.
                            </p>
                        </div>
                    );
                } else {
                    production = (
                        <div className="no-certificates join-production-network">
                            <i className="mdi mdi-alert-octagram-outline"></i>
                            <div className="subtitle text-red mt-5">
                                You are not part of the Production network
                            </div>
                            <p className="text-center mb-25">
                                Currently, you are participant only of the{' '}
                                <span className="text-bold">
                                    Pre-production network
                                </span>
                                , which is free. If you want to join the
                                Production network, an authorised person from
                                your company needs to sign the Terms of Use
                                agreement first.
                            </p>
                            <button
                                className="btn btn-secondary btn-link mt-0 mb-10"
                                onClick={() =>
                                    this.upgradeToProductionNetwork()
                                }>
                                <NavLink
                                    to="/dashboard/account/production-terms"
                                    className="btn btn-link link-secondary m-0">
                                    Join the production Network
                                </NavLink>
                            </button>
                        </div>
                    );
                }
            }
            if (
                Object.entries(this.props.dnr.uat).length === 0 &&
                this.props.dnr.cordanetwork.constructor === Object
            ) {
                preproduction = (
                    <div className="no-certificates">
                        <i className="mdi mdi-file-document-box-remove-outline"></i>
                        <div className="subtitle">
                            You have no certificates yet!
                        </div>
                        <p>
                            Please, select the “New config file” button above,
                            to create your first node config file.
                        </p>
                    </div>
                );
            } else if (Object.entries(this.props.dnr.uat).length !== 0) {
                preproduction = this.renderCertificateDetails('uat');
            }
        } else if (
            this.props.str.terms[0].agreementContext === 'CORDANETWORK'
        ) {
            if (
                Object.entries(this.props.dnr.uat).length === 0 &&
                this.props.dnr.cordanetwork.constructor === Object
            ) {
                preproduction = (
                    <div className="no-certificates">
                        <i className="mdi mdi-file-document-box-remove-outline"></i>
                        <div className="subtitle">
                            You have no certificates yet!
                        </div>
                        <p>
                            Please, select the “New config file” button above,
                            to create your first node config file.
                        </p>
                    </div>
                );
            } else if (Object.entries(this.props.dnr.uat).length !== 0) {
                preproduction = this.renderCertificateDetails('uat');
            }
            if (
                Object.entries(this.props.dnr.cordanetwork).length === 0 &&
                this.props.dnr.cordanetwork.constructor === Object
            ) {
                production = (
                    <div className="no-certificates">
                        <i className="mdi mdi-file-document-box-remove-outline"></i>
                        <div className="subtitle">
                            You have no certificates yet!
                        </div>
                        <p>
                            Please, select the “New config file” button above,
                            to create your first node config file.
                        </p>
                    </div>
                );
            } else if (
                Object.entries(this.props.dnr.cordanetwork).length !== 0
            ) {
                production = this.renderCertificateDetails('cordanetwork');
            }
        }

        return (
            <LoadingOverlay
                active={this.state.isLoading}
                spinner
                text="Loading...">
                <div className="col-10 offset-1">
                    <div className="create-node-buttons box--flex center--xxX">
                        <button
                            className="btn btn-secondary btn-set-up"
                            onClick={this.goToSetUpNodeInfo.bind(this)}>
                            How to set up a node
                        </button>
                        <button
                            className="btn btn-primary ml-30"
                            onClick={() => this.createNode()}
                            disabled={
                                (this.state.productionType ===
                                    'preproduction' &&
                                    Object.keys(this.props.dnr.uat).length) ||
                                (this.state.productionType === 'production' &&
                                    Object.keys(this.props.dnr.cordanetwork)
                                        .length)
                            }>
                            New config file
                        </button>
                    </div>
                    <div className="card certificates-data">
                        <header className="box--flex center--XxX center--y bg-white">
                            <h1 className="h3">Certificates</h1>
                            <div className="tab-slider">
                                <ul
                                    className={
                                        this.state.productionType ===
                                        'production'
                                            ? 'tab-slider-tabs slide'
                                            : 'tab-slider-tabs'
                                    }>
                                    <li
                                        className={
                                            this.state.productionType ===
                                            'preproduction'
                                                ? 'tab-slider-trigger active'
                                                : 'tab-slider-trigger'
                                        }
                                        onClick={this.setPreproduction}>
                                        pre-production
                                    </li>
                                    <li
                                        className={
                                            this.state.productionType ===
                                            'production'
                                                ? 'tab-slider-trigger active'
                                                : 'tab-slider-trigger'
                                        }
                                        onClick={this.setProduction}>
                                        production
                                    </li>
                                </ul>
                            </div>
                        </header>

                        <div className="certificates bg-white">
                            <div className="row certificates-header m-0 bg-ghost-white">
                                <div className="col-12 box--flex center--Xxx">
                                    Certificate details
                                </div>
                            </div>
                            <div className="certificates-body">
                                {this.state.productionType ===
                                    'preproduction' && preproduction}

                                {this.state.productionType === 'production' &&
                                    production}
                            </div>
                        </div>
                    </div>
                </div>
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
        str: state.str,
        dnr: state.dnr,
        cnr: state.cnr,
        sponsorCurrentStepReducer: state.sponsorCurrentStepReducer,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onGoToSetUpNodeInfo: () =>
            dispatch({
                type: actionTypes.NETWORKS_HOW_TO_SET_UP_A_NODE,
            }),
        onStartCreateNodeConfig: () =>
            dispatch({
                type: actionTypes.CURRENT_STEP_START_NODE_CREATION,
            }),
        onStartUpgradeToProductionNetwork: () =>
            dispatch({
                type: actionTypes.UPGRADE_TO_PRODUCTION_NETWORK,
            }),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CertificatesTable);
