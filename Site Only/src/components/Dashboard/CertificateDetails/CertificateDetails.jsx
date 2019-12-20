import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import * as actionTypes from '../../../store/actions';
import './CertificateDetails.scss';
import { Link } from 'react-router-dom';
import { nodeConfigDownload } from '../../../axios/axios';
import { downloadNodeConfigFile } from '../../../utils/utils';

class CertificateDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            productionType: 'preproduction',
            nodeConfigPreprodFile: null,
            nodeConfigProdFile: null,
        };

        this.setPreproduction = this.setPreproduction.bind(this);
        this.setProduction = this.setProduction.bind(this);
    }

    componentDidMount() {
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
    }

    createNode() {
        if (this.state.productionType === 'preproduction') {
            this.props.onStartCreateNodeConfig('UAT');
        } else if (this.state.productionType === 'production') {
            this.props.onStartCreateNodeConfig('CORDANETWORK');
        }
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
            <Fragment>
                <div className="field box box--flex center--y center--XxX">
                    <div>Organisation name</div>
                    <div className="value">{organization}</div>
                </div>
                <div className="h-splitter"></div>
                <div className="field box box--flex center--y center--XxX">
                    <div>Organisation unit</div>
                    <div className="value">{organizationalUnit}</div>
                </div>
                <div className="h-splitter"></div>
                <div className="field box box--flex center--y center--XxX">
                    <div>Country</div>
                    <div className="value">{country}</div>
                </div>
                <div className="h-splitter"></div>
                <div className="field box box--flex center--y center--XxX">
                    <div>Locality</div>
                    <div className="value">{locality}</div>
                </div>
                <div className="h-splitter"></div>
                <div className="field box box--flex center--y center--XxX">
                    <div>State</div>
                    <div className="value text-right">{state}</div>
                </div>
                <div className="h-splitter"></div>
                <div className="field box box--flex center--y center--XxX">
                    <div>Common name</div>
                    <div className="value text-right">{commonName}</div>
                </div>
                <div className="h-splitter"></div>
                <div className="field box box--flex center--y center--XxX">
                    <div>Node operator email address</div>
                    <div className="value text-right">{email}</div>
                </div>
                <div className="h-splitter"></div>
                <div className="field box box--flex center--y center--XxX">
                    <div>Backup node operator email address</div>
                    <div className="value text-right">{backupEmail}</div>
                </div>
                <div className="h-splitter"></div>
                <button
                    onClick={() => this.downloadNodeConfig()}
                    className="btn btn-download box box--flex center--y center--XxX">
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
            </Fragment>
        );
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
                        <div>
                            <i className="mdi mdi-alert-octagram-outline"></i>
                            <p className="text-center">
                                Press below to start the technical onboarding
                                steps - including initiating your CSR
                                (Certificate Signing Request).
                            </p>
                            <button className="btn btn-secondary box--flex center--y center--x mx-30">
                                <Link
                                    onClick={() => this.createNode()}
                                    to="create-node">
                                    Create a Node and Join the Network
                                </Link>
                            </button>
                        </div>
                    );
                } else if (
                    Object.entries(this.props.dnr.cordanetwork).length !== 0
                ) {
                    production = this.renderCertificateDetails('cordanetwork');
                }
            } else {
                production = (
                    <div>
                        <i className="mdi mdi-alert-octagram-outline"></i>
                        <p className="text-center mb-60">
                            You need to sign the Terms of Use Agreement for the
                            production network to be able to create a node. You
                            can find the link to the agreement in the section
                            bellow.
                        </p>
                    </div>
                );
            }
            if (
                Object.entries(this.props.dnr.uat).length === 0 &&
                this.props.dnr.cordanetwork.constructor === Object
            ) {
                preproduction = (
                    <div>
                        <i className="mdi mdi-alert-octagram-outline"></i>
                        <p className="text-center">
                            Press below to start the technical onboarding steps
                            - including initiating your CSR (Certificate Signing
                            Request).
                        </p>
                        <button className="btn btn-secondary box--flex center--y center--x mx-30">
                            <Link
                                onClick={() => this.createNode()}
                                to="create-node">
                                Create a Node and Join the Network
                            </Link>
                        </button>
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
                    <div>
                        <i className="mdi mdi-alert-octagram-outline"></i>
                        <p className="text-center">
                            Press below to start the technical onboarding steps
                            - including initiating your CSR (Certificate Signing
                            Request).
                        </p>
                        <button className="btn btn-secondary box--flex center--y center--x mx-30">
                            <Link
                                onClick={() => this.createNode()}
                                to="create-node">
                                Create a Node and Join the Network
                            </Link>
                        </button>
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
                    <div>
                        <i className="mdi mdi-alert-octagram-outline"></i>
                        <p className="text-center">
                            Press below to start the technical onboarding steps
                            - including initiating your CSR (Certificate Signing
                            Request).
                        </p>
                        <button className="btn btn-secondary box--flex center--y center--x mx-30">
                            <Link
                                onClick={() => this.createNode()}
                                to="create-node">
                                Create a Node and Join the Network
                            </Link>
                        </button>
                    </div>
                );
            } else if (
                Object.entries(this.props.dnr.cordanetwork).length !== 0
            ) {
                production = this.renderCertificateDetails('cordanetwork');
            }
        }

        return (
            <div className="certificate-details bg-white">
                <div className="dsh-header box box--flex center--XxX center--y">
                    <div className="heading box--flex center--y">
                        <i className="mdi mdi-file-document-box-outline"></i>
                        <span>Certificate Details</span>
                    </div>
                </div>
                <div className="tab-slider">
                    <ul
                        className={
                            this.state.productionType === 'production'
                                ? 'tab-slider-tabs slide'
                                : 'tab-slider-tabs'
                        }>
                        <li
                            className={
                                this.state.productionType === 'preproduction'
                                    ? 'tab-slider-trigger active'
                                    : 'tab-slider-trigger'
                            }
                            onClick={this.setPreproduction}>
                            pre-production
                        </li>
                        <li
                            className={
                                this.state.productionType === 'production'
                                    ? 'tab-slider-trigger active'
                                    : 'tab-slider-trigger'
                            }
                            onClick={this.setProduction}>
                            production
                        </li>
                    </ul>
                </div>

                {this.state.productionType === 'preproduction' && preproduction}

                {this.state.productionType === 'production' && production}
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
        str: state.str,
        dnr: state.dnr,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onStartCreateNodeConfig: (networkType) =>
            dispatch({
                type: actionTypes.CURRENT_STEP_START_NODE_CREATION,
                networkType: networkType,
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
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CertificateDetails);
