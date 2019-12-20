import React, { Component, Fragment } from 'react';
import Badge from './../Badge/Badge';
import * as actionTypes from './../../store/actions';
import { connect } from 'react-redux';
import { sponseeNodeConfigGET } from './../../axios/axios';
import { handleApiError, downloadNodeConfigFile } from './../../utils/utils';
import Modal from 'react-modal';

class SponsoredParticipantsTableRow extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            sponsoredParticipantData: {
                preproductionDetails: null,
                productionDetails: null,
            },
            isPreproductionModalOpen: false,
            isProductionModalOpen: false,
            preproductionConfigFile: null,
            productionConfigFile: null,
        };
    }

    toggleRow() {
        this.setState({
            open: !this.state.open,
            sponsoredParticipantData: {
                preproductionDetails: this.getPreproductionDetails(),
                productionDetails: this.getProductionDetails(),
            },
        });
    }

    getPreproductionDetails() {
        let preproductionDetails;
        if (this.props.participant.identities.length) {
            preproductionDetails = this.props.participant.identities.find(
                (identity) => identity.context === 'UAT'
            );
            return preproductionDetails;
        } else {
            return null;
        }
    }

    getProductionDetails() {
        let productionDetails;
        if (this.props.participant.identities.length) {
            productionDetails = this.props.participant.identities.find(
                (identity) => identity.context === 'CORDANETWORK'
            );
            return productionDetails;
        } else {
            return null;
        }
    }

    setUpPreproduction() {
        this.props.cnr.currentStep =
            actionTypes.CURRENT_STEP_STOP_NODE_CREATION;
        this.props.onCreateSponseeNode('UAT', this.props.participant.id);
    }

    setUpProduction() {
        this.props.cnr.currentStep =
            actionTypes.CURRENT_STEP_STOP_NODE_CREATION;
        this.props.onCreateSponseeNode(
            'CORDANETWORK',
            this.props.participant.id
        );
    }

    showPreproductionDetails() {
        this.setState({
            isPreproductionModalOpen: true,
        });
        sponseeNodeConfigGET(this.props.participant.id, 'UAT')
            .then((response) => {
                this.setState({
                    preproductionConfigFile: new Blob([response.data], {
                        type: 'text/plain',
                    }),
                });
            })
            .catch((err) => {
                handleApiError(err);
            });
    }

    showProductionDetails() {
        this.setState({
            isProductionModalOpen: true,
        });
        sponseeNodeConfigGET(this.props.participant.id, 'CORDANETWORK')
            .then((response) => {
                this.setState({
                    productionConfigFile: new Blob([response.data], {
                        type: 'text/plain',
                    }),
                });
            })
            .catch((err) => {
                handleApiError(err);
            });
    }

    handleCloseModal() {
        this.setState({
            isPreproductionModalOpen: false,
            isProductionModalOpen: false,
        });
    }

    downloadPreproductionNodeConfig() {
        downloadNodeConfigFile(this.state.preproductionConfigFile);
    }

    downloadProductionNodeConfig() {
        downloadNodeConfigFile(this.state.productionConfigFile);
    }

    render() {
        const {
            open,
            sponsoredParticipantData,
            preproductionConfigFile,
            productionConfigFile,
        } = this.state;

        let classes = 'table-row';
        if (open) {
            classes += ' open';
        }

        let sponsoredParticipant = this.props.participant;

        let dateSubmittedOn = new Date(sponsoredParticipant.created)
            .toLocaleDateString()
            .split('/')
            .join('-');

        let sponsoredParticipantStatus;

        if (!sponsoredParticipant.identities.length) {
            if (sponsoredParticipant.eligibilityCheck.status === 'SUCCESS') {
                sponsoredParticipantStatus = (
                    <Badge theme="success">approved</Badge>
                );
            } else if (
                sponsoredParticipant.eligibilityCheck.status === 'PENDING' ||
                'PENDING_REVIEW'
            ) {
                sponsoredParticipantStatus = (
                    <Badge theme="pending">pending</Badge>
                );
            } else if (
                sponsoredParticipant.eligibilityCheck.status === 'ERROR'
            ) {
                sponsoredParticipantStatus = (
                    <Badge theme="error">denied</Badge>
                );
            }
        } else {
            if (
                sponsoredParticipant.identities.length === 1 &&
                sponsoredParticipant.identities[0].context === 'UAT'
            ) {
                sponsoredParticipantStatus = (
                    <Badge theme="preprod">pre-production</Badge>
                );
            } else if (
                sponsoredParticipant.identities.length === 1 &&
                sponsoredParticipant.identities[0].context === 'CORDANETWORK'
            ) {
                sponsoredParticipantStatus = (
                    <Badge theme="prod">production</Badge>
                );
            } else if (sponsoredParticipant.identities.length === 2) {
                sponsoredParticipantStatus = (
                    <Badge theme="both">both networks</Badge>
                );
            }
        }

        let preproductionContent;
        if (
            !sponsoredParticipant.identities.length ||
            (sponsoredParticipant.identities.length === 1 &&
                sponsoredParticipant.identities[0].context === 'CORDANETWORK')
        ) {
            preproductionContent = (
                <button
                    className="btn btn-secondary btn-set-up mt-24 mb-16 px-30"
                    onClick={() => this.setUpPreproduction()}>
                    Set up preproduction
                </button>
            );
        } else if (
            sponsoredParticipant.identities.length &&
            (sponsoredParticipant.identities[0].context === 'UAT' ||
                sponsoredParticipant.identities[1].context === 'UAT')
        ) {
            preproductionContent = (
                <button
                    className="btn btn-secondary btn-details mt-24 mb-16 px-30"
                    onClick={() => this.showPreproductionDetails()}>
                    Pre-production node details
                </button>
            );
        }

        let productionContent;
        if (
            !sponsoredParticipant.identities.length ||
            (sponsoredParticipant.identities.length === 1 &&
                sponsoredParticipant.identities[0].context === 'UAT')
        ) {
            productionContent = (
                <button
                    className="btn btn-secondary btn-set-up mt-24 mb-16 px-30"
                    onClick={() => this.setUpProduction()}>
                    Set up production
                </button>
            );
        } else if (
            sponsoredParticipant.identities.length &&
            (sponsoredParticipant.identities[0].context === 'CORDANETWORK' ||
                sponsoredParticipant.identities[1].context === 'CORDANETWORK')
        ) {
            productionContent = (
                <button
                    className="btn btn-secondary btn-details mt-24 mb-16 px-30"
                    onClick={() => this.showProductionDetails()}>
                    Production Node Details
                </button>
            );
        }

        return (
            <div className={classes}>
                <div
                    className="table-row--content box--flex"
                    onClick={this.toggleRow.bind(this)}>
                    <div className="col-4 company box--flex--column center--Xxx">
                        <div className="company-name">
                            {sponsoredParticipant.name}
                        </div>
                        <div className="company-number">
                            {sponsoredParticipant.externalId}{' '}
                        </div>
                    </div>
                    <div className="col-3 country box--flex center--Xxx">
                        {sponsoredParticipant.address.addressCountry.name}
                    </div>
                    <div className="col-2 status box--flex center--Xxx mt-1">
                        {sponsoredParticipantStatus}
                    </div>
                    <div className="col-3 date box--flex center--xxX">
                        {dateSubmittedOn}
                    </div>

                    <div className="open-row box--flex--column center--x center--y">
                        <i className="mdi mdi-chevron-down"></i>
                    </div>
                </div>
                <div className="table-row--details" ref="expanderBody">
                    <div>
                        <span>Reg. address: </span>
                        {sponsoredParticipant.address.streetAddress.line1 +
                            ' ' +
                            sponsoredParticipant.address.streetAddress.line2}
                    </div>
                    {/* <div>
                        <span>Data submitted on:</span>
                        {dateSubmittedOn}
                    </div> */}
                    {sponsoredParticipant.eligibilityCheck.status ===
                        'SUCCESS' && (
                        <div>
                            {preproductionContent}
                            {productionContent}
                        </div>
                    )}

                    <div
                        className="close-details box--flex--column center--x center--y"
                        onClick={this.toggleRow.bind(this)}>
                        <i className="mdi mdi-chevron-up"></i>
                    </div>
                </div>
                {sponsoredParticipantData.preproductionDetails && (
                    <Modal
                        ariaHideApp={false}
                        isOpen={this.state.isPreproductionModalOpen}
                        contentLabel="onRequestClose Example"
                        onRequestClose={() => this.handleCloseModal()}
                        className="Modal Modal__node-config"
                        overlayClassName="Overlay Overlay__feedback">
                        <h1 className="text-center h3">
                            Pre-production Node Details
                        </h1>
                        <div className="h-splitter"></div>
                        <div className="field box box--flex center--y center--XxX">
                            <div>Organisation name</div>
                            <div className="value">
                                {
                                    sponsoredParticipantData
                                        .preproductionDetails.identity
                                        .organization
                                }
                            </div>
                        </div>
                        <div className="h-splitter"></div>
                        <div className="field box box--flex center--y center--XxX">
                            <div>Organisation unit</div>
                            <div className="value">
                                {
                                    sponsoredParticipantData
                                        .preproductionDetails.identity
                                        .organizationalUnit
                                }
                            </div>
                        </div>
                        <div className="h-splitter"></div>
                        <div className="field box box--flex center--y center--XxX">
                            <div>Country</div>
                            <div className="value">
                                {
                                    sponsoredParticipantData
                                        .preproductionDetails.identity.country
                                }
                            </div>
                        </div>
                        <div className="h-splitter"></div>
                        <div className="field box box--flex center--y center--XxX">
                            <div>Locality</div>
                            <div className="value">
                                {
                                    sponsoredParticipantData
                                        .preproductionDetails.identity.locality
                                }
                            </div>
                        </div>
                        <div className="h-splitter"></div>
                        {sponsoredParticipantData.preproductionDetails.identity
                            .state && (
                            <Fragment>
                                <div className="field box box--flex center--y center--XxX">
                                    <div>State</div>
                                    <div className="value text-right">
                                        {
                                            sponsoredParticipantData
                                                .preproductionDetails.identity
                                                .state
                                        }
                                    </div>
                                </div>
                                <div className="h-splitter"></div>
                            </Fragment>
                        )}
                        {sponsoredParticipantData.preproductionDetails.identity
                            .commonName && (
                            <Fragment>
                                <div className="field box box--flex center--y center--XxX">
                                    <div>Common name</div>
                                    <div className="value text-right">
                                        {
                                            sponsoredParticipantData
                                                .preproductionDetails.identity
                                                .commonName
                                        }
                                    </div>
                                </div>
                                <div className="h-splitter"></div>
                            </Fragment>
                        )}
                        <div className="field box box--flex center--y center--XxX">
                            <div>Node operator email address</div>
                            <div className="value text-right">
                                {
                                    sponsoredParticipantData
                                        .preproductionDetails.identity.email
                                }
                            </div>
                        </div>
                        <div className="h-splitter"></div>
                        <div className="field box box--flex center--y center--XxX">
                            <div>Backup operator email address</div>
                            <div className="value text-right">
                                {
                                    sponsoredParticipantData
                                        .preproductionDetails.identity
                                        .backupEmail
                                }
                            </div>
                        </div>
                        <div className="h-splitter"></div>
                        <button
                            onClick={() =>
                                this.downloadPreproductionNodeConfig()
                            }
                            className="btn btn-download box box--flex center--y center--XxX">
                            <div className="box box--flex center--y">
                                <i className="mdi mdi-download"></i>
                                <div className="template-name">node.conf</div>
                            </div>
                            <div className="size">
                                {preproductionConfigFile
                                    ? preproductionConfigFile.size
                                    : 0}{' '}
                                Bytes
                            </div>
                        </button>
                        <i
                            onClick={() => this.handleCloseModal()}
                            className="mdi mdi-close"></i>
                    </Modal>
                )}
                {sponsoredParticipantData.productionDetails && (
                    <Modal
                        ariaHideApp={false}
                        isOpen={this.state.isProductionModalOpen}
                        contentLabel="onRequestClose Example"
                        onRequestClose={() => this.handleCloseModal()}
                        className="Modal Modal__node-config"
                        overlayClassName="Overlay Overlay__feedback">
                        <h1 className="text-center h3">
                            Production Node Details
                        </h1>
                        <div className="h-splitter"></div>
                        <div className="field box box--flex center--y center--XxX">
                            <div>Organisation name</div>
                            <div className="value">
                                {
                                    sponsoredParticipantData.productionDetails
                                        .identity.organization
                                }
                            </div>
                        </div>
                        <div className="h-splitter"></div>
                        <div className="field box box--flex center--y center--XxX">
                            <div>Organisation unit</div>
                            <div className="value">
                                {
                                    sponsoredParticipantData.productionDetails
                                        .identity.organizationalUnit
                                }
                            </div>
                        </div>
                        <div className="h-splitter"></div>
                        <div className="field box box--flex center--y center--XxX">
                            <div>Country</div>
                            <div className="value">
                                {
                                    sponsoredParticipantData.productionDetails
                                        .identity.country
                                }
                            </div>
                        </div>
                        <div className="h-splitter"></div>
                        <div className="field box box--flex center--y center--XxX">
                            <div>Locality</div>
                            <div className="value">
                                {
                                    sponsoredParticipantData.productionDetails
                                        .identity.locality
                                }
                            </div>
                        </div>
                        <div className="h-splitter"></div>
                        {sponsoredParticipantData.productionDetails.identity
                            .state && (
                            <Fragment>
                                <div className="field box box--flex center--y center--XxX">
                                    <div>State</div>
                                    <div className="value text-right">
                                        {
                                            sponsoredParticipantData
                                                .productionDetails.identity
                                                .state
                                        }
                                    </div>
                                </div>
                                <div className="h-splitter"></div>
                            </Fragment>
                        )}
                        {sponsoredParticipantData.productionDetails.identity
                            .commonName && (
                            <Fragment>
                                <div className="field box box--flex center--y center--XxX">
                                    <div>Common name</div>
                                    <div className="value text-right">
                                        {
                                            sponsoredParticipantData
                                                .productionDetails.identity
                                                .commonName
                                        }
                                    </div>
                                </div>
                                <div className="h-splitter"></div>
                            </Fragment>
                        )}
                        <div className="field box box--flex center--y center--XxX">
                            <div>Node operator email address</div>
                            <div className="value text-right">
                                {
                                    sponsoredParticipantData.productionDetails
                                        .identity.email
                                }
                            </div>
                        </div>
                        <div className="h-splitter"></div>
                        <div className="field box box--flex center--y center--XxX">
                            <div>Backup operator email address</div>
                            <div className="value text-right">
                                {
                                    sponsoredParticipantData.productionDetails
                                        .identity.backupEmail
                                }
                            </div>
                        </div>
                        <div className="h-splitter"></div>
                        <button
                            onClick={() => this.downloadProductionNodeConfig()}
                            className="btn btn-download box box--flex center--y center--XxX">
                            <div className="box box--flex center--y">
                                <i className="mdi mdi-download"></i>
                                <div className="template-name">node.conf</div>
                            </div>
                            <div className="size">
                                {productionConfigFile
                                    ? productionConfigFile.size
                                    : 0}{' '}
                                Bytes
                            </div>
                        </button>
                        <i
                            onClick={() => this.handleCloseModal()}
                            className="mdi mdi-close"></i>
                    </Modal>
                )}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        csr: state.csr,
        uar: state.uar,
        str: state.str,
        ptr: state.ptr,
        ler: state.ler,
        cnr: state.cnr,
        sponsorCurrentStepReducer: state.sponsorCurrentStepReducer,
        sponsoredLegalEntityReducer:
            state.sponsoredLegalEntityReducer.legalEntity,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onCreateSponseeNode: (networkType, participantId) =>
            dispatch({
                type: actionTypes.CREATE_SPONSEE_NODE_CONFIG,
                networkType: networkType,
                participantId: participantId,
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

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SponsoredParticipantsTableRow);
