import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import {
    axiosIdentityCheckPOST,
    axiosAccountByIdGET,
    axiosParticipantSignedTermsByIdGET,
    editSanctionPOST,
    axiosApproveSponsorPOST,
} from '../../axios/axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import LoadingOverlay from 'react-loading-overlay';
import Badge from '../Badge/Badge';
import './TableRow.scss';
import * as actionTypes from '../../store/actions';
import { handleApiError } from '../../utils/utils';

class TableRow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            userProfile: {},
            isBillingDetailsModalOpen: false,
            isTermsDetailsModalOpen: false,
            userTerms: [],
            isApproveUserModalOpen: false,
            isSponsoredParticipantsModalOpen: false,
            pendingSponseesCount: 0,
            isPageLoading: false,
        };
    }

    toggleRow(e) {
        if (!this.state.open) {
            this.startLoader();
            axiosAccountByIdGET(this.props.user.userId)
                .then((response) => {
                    this.setState({
                        open: !this.state.open,
                        userProfile: response.data,
                    });
                })
                .then(() => {
                    axiosParticipantSignedTermsByIdGET(this.props.user.id)
                        .then((response) => {
                            if (response.data.length === 1) {
                                this.setState({
                                    userTerms: response.data,
                                });
                                this.stopLoader();
                            } else if (response.data > 1) {
                                const productionTerms = response.data.filter(
                                    (term) => {
                                        return (
                                            term.agreementContext ===
                                            'CORDANETWORK'
                                        );
                                    }
                                );
                                this.setState({
                                    userTerms: productionTerms,
                                });
                                this.stopLoader();
                            } else {
                                this.stopLoader();
                            }
                        })
                        .catch((err) => {
                            this.stopLoader();
                        });
                })
                .catch((err) => {
                    handleApiError(err);
                    this.setState({
                        open: !this.state.open,
                    });
                    this.stopLoader();
                });
        } else {
            this.setState({
                open: !this.state.open,
            });
            this.stopLoader();
        }
    }

    openApproveUserModal() {
        this.setState({
            isApproveUserModalOpen: true,
        });
    }

    getSelectedSponsee(sponseeId) {
        const sponsored = this.props.user.sponsored;
        const selectedSponsee = sponsored.find(
            (sponsee) => sponsee.id === sponseeId
        );
        return selectedSponsee;
    }

    editEligibilitySanction(eligibilityId, id) {
        editSanctionPOST(eligibilityId, id)
            .then(() => {
                this.getSelectedSponsee(id).eligibilityCheck.status = 'SUCCESS';
                this.stopLoader();
            })
            .catch((err) => {
                handleApiError(err);
                this.props.onApproval();
                this.stopLoader();
            });
    }

    approveUser(id) {
        this.setState({
            isApproveUserModalOpen: false,
        });
        this.startLoader();

        if (
            this.props.user.eligibilityStatus === 'PENDING_REVIEW' ||
            this.props.user.eligibilityStatus === 'ERROR'
        ) {
            editSanctionPOST(this.props.user.eligibilityId, id)
                .then(() => {
                    axiosIdentityCheckPOST(id)
                        .then(() => {
                            if (this.props.user.type === 'SPONSOR') {
                                axiosApproveSponsorPOST(id).then(() => {
                                    this.handleApproval();
                                    toast(
                                        <div>User successfully approved</div>,
                                        {
                                            type: 'success',
                                        }
                                    );
                                    this.stopLoader();
                                });
                            } else {
                                this.handleApproval();
                                toast(<div>User successfully approved</div>, {
                                    type: 'success',
                                });
                                this.stopLoader();
                            }
                        })
                        .catch((err) => {
                            this.handleApproval();
                            handleApiError(err);
                        });
                })
                .catch((err) => {
                    handleApiError(err);
                    this.stopLoader();
                });
        } else {
            axiosIdentityCheckPOST(id)
                .then(() => {
                    this.handleApproval();
                    toast(<div>User successfully approved</div>, {
                        type: 'success',
                    });
                    this.stopLoader();
                })
                .catch((err) => {
                    this.handleApproval();
                    handleApiError(err);
                });
        }
    }

    directApproveUser(id) {
        this.startLoader();

        axiosIdentityCheckPOST(id)
            .then(() => {
                if (this.props.user.type === 'SPONSOR') {
                    axiosApproveSponsorPOST(id).then(() => {
                        this.handleApproval();
                        toast(<div>User successfully approved</div>, {
                            type: 'success',
                        });
                        this.stopLoader();
                    });
                } else {
                    this.handleApproval();
                    toast(<div>User successfully approved</div>, {
                        type: 'success',
                    });
                    this.stopLoader();
                }
            })
            .catch((err) => {
                this.handleApproval();
                handleApiError(err);
                this.stopLoader();
            });
    }

    handleApproval() {
        this.setState({ open: !this.state.open });
        this.props.onApproval();
    }

    showBillingDetails() {
        this.setState({
            isBillingDetailsModalOpen: true,
        });
    }

    showTermsDetails() {
        this.setState({
            isTermsDetailsModalOpen: true,
        });
    }

    showSponsoredParticipants() {
        this.setState({
            isSponsoredParticipantsModalOpen: true,
        });
    }

    handleCloseBillingDetailsModal() {
        this.setState({ isBillingDetailsModalOpen: false });
    }

    handleCloseTermsDetailsModal() {
        this.setState({ isTermsDetailsModalOpen: false });
    }

    handleCloseApproveUserModal() {
        this.setState({ isApproveUserModalOpen: false });
    }

    handleCloseSponsoredParticipants() {
        this.setState({
            isSponsoredParticipantsModalOpen: false,
        });
    }

    getUnapprovedSponseesCount(sponsees) {
        let counter = 0;

        sponsees.map((sponsee) => {
            if (
                sponsee.identityCheck.status !== 'SUCCESS' ||
                sponsee.eligibilityCheck.status !== 'SUCCESS'
            ) {
                counter += 1;
            }
        });
        return counter;
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
        let classes = 'participant-row';
        if (this.state.open) {
            classes += ' open';
        }
        return (
            <LoadingOverlay
                active={this.state.isPageLoading}
                spinner
                text="Loading...">
                <div className={classes}>
                    <div
                        className="participant-row--content box--flex"
                        onClick={this.toggleRow.bind(this)}>
                        {this.props.participantsType !== 'sponsor' && (
                            <Fragment>
                                <div className="col-5 company box--flex--column center--Xxx">
                                    <div className="company-name">
                                        {this.props.user.name}
                                    </div>

                                    <div className="company-number">
                                        {this.props.user.externalId}
                                    </div>
                                </div>

                                <div className="col-2 country center--Xxx">
                                    {this.props.user.country}
                                </div>

                                {this.props.currentlyShownType ===
                                    'pending' && (
                                    <div className="col-3 country center--Xxx">
                                        {this.props.user.billingInfo ===
                                            null && (
                                            <Badge theme="pending">
                                                onboarding in progress
                                            </Badge>
                                        )}

                                        {this.props.user.billingInfo !== null &&
                                            this.props.user.status ===
                                                'SUCCESS' && (
                                                <Badge theme="success">
                                                    Approved
                                                </Badge>
                                            )}

                                        {this.props.user.billingInfo !== null &&
                                            this.props.user.status !==
                                                'SUCCESS' &&
                                            this.props.user
                                                .eligibilityStatus ===
                                                'SUCCESS' && (
                                                <Badge theme="success">
                                                    awaiting approval
                                                </Badge>
                                            )}

                                        {this.props.user.billingInfo !== null &&
                                            this.props.user.status !==
                                                'SUCCESS' &&
                                            this.props.user
                                                .eligibilityStatus ===
                                                'PENDING_REVIEW' && (
                                                <Badge theme="error">
                                                    failed eligibility
                                                </Badge>
                                            )}

                                        {this.props.user.billingInfo !== null &&
                                            this.props.user.status !==
                                                'SUCCESS' &&
                                            this.props.user
                                                .eligibilityStatus ===
                                                'ERROR' && (
                                                <Badge theme="error">
                                                    failed eligibility
                                                </Badge>
                                            )}

                                        {this.props.user.billingInfo !== null &&
                                            this.props.user.status !==
                                                'SUCCESS' &&
                                            this.props.user
                                                .eligibilityStatus ===
                                                'missing' && (
                                                <Badge theme="error">
                                                    missing eligibility
                                                </Badge>
                                            )}
                                    </div>
                                )}
                                {this.props.currentlyShownType ===
                                    'pending' && (
                                    <div className="col-2 submitted-on center--xxX">
                                        {this.props.user.created}
                                    </div>
                                )}
                                {this.props.currentlyShownType !==
                                    'pending' && (
                                    <div className="col-5 submitted-on center--xxX">
                                        {this.props.user.created}
                                    </div>
                                )}
                            </Fragment>
                        )}
                        {this.props.participantsType === 'sponsor' &&
                            this.props.currentlyShownType === 'pending' && (
                                <Fragment>
                                    <div className="col-5 company box--flex--column center--Xxx">
                                        <div className="company-name">
                                            {this.props.user.name}
                                        </div>

                                        <div className="company-number">
                                            {this.props.user.externalId}
                                        </div>
                                    </div>

                                    <div className="col-2 country center--Xxx">
                                        {this.props.user.country}
                                    </div>

                                    <div className="col-3 country center--Xxx">
                                        {this.props.user.billingInfo ===
                                            null && (
                                            <Badge theme="pending">
                                                onboarding in progress
                                            </Badge>
                                        )}

                                        {this.props.user.billingInfo !== null &&
                                            this.props.user.status ===
                                                'SUCCESS' && (
                                                <Badge theme="success">
                                                    Approved
                                                </Badge>
                                            )}

                                        {this.props.user.billingInfo !== null &&
                                            this.props.user.status !==
                                                'SUCCESS' &&
                                            this.props.user
                                                .eligibilityStatus ===
                                                'SUCCESS' && (
                                                <Badge theme="success">
                                                    awaiting approval
                                                </Badge>
                                            )}

                                        {this.props.user.billingInfo !== null &&
                                            this.props.user.status !==
                                                'SUCCESS' &&
                                            this.props.user
                                                .eligibilityStatus ===
                                                'PENDING_REVIEW' && (
                                                <Badge theme="error">
                                                    failed eligibility
                                                </Badge>
                                            )}

                                        {this.props.user.billingInfo !== null &&
                                            this.props.user.status !==
                                                'SUCCESS' &&
                                            this.props.user
                                                .eligibilityStatus ===
                                                'ERROR' && (
                                                <Badge theme="error">
                                                    failed eligibility
                                                </Badge>
                                            )}

                                        {this.props.user.billingInfo !== null &&
                                            this.props.user.status !==
                                                'SUCCESS' &&
                                            this.props.user
                                                .eligibilityStatus ===
                                                'missing' && (
                                                <Badge theme="error">
                                                    missing eligibility
                                                </Badge>
                                            )}
                                    </div>

                                    <div className="col-2 submitted-on center--xxX">
                                        {this.props.user.created}
                                    </div>
                                </Fragment>
                            )}
                        {this.props.participantsType === 'sponsor' &&
                            this.props.currentlyShownType === 'active' && (
                                <Fragment>
                                    <div className="col-5 company box--flex--column center--Xxx">
                                        <div className="company-name">
                                            {this.props.user.name}
                                        </div>

                                        <div className="company-number">
                                            {this.props.user.externalId}
                                        </div>
                                    </div>

                                    <div className="col-2 country center--Xxx">
                                        {this.props.user.sponsored.length} (
                                        {this.getUnapprovedSponseesCount(
                                            this.props.user.sponsored
                                        )}{' '}
                                        failed)
                                    </div>

                                    <div className="col-2 country center--Xxx">
                                        {this.props.user.country}
                                    </div>

                                    <div className="col-3 submitted-on center--xxX">
                                        {this.props.user.created}
                                    </div>
                                </Fragment>
                            )}

                        <div className="open-row box--flex--column center--x center--y">
                            <i className="mdi mdi-chevron-down"></i>
                        </div>
                    </div>
                    <div
                        className="participant-row--details"
                        ref="expanderBody">
                        <div className="names">
                            <span>Names: </span>
                            {this.state.userProfile.firstName +
                                ' ' +
                                this.state.userProfile.lastName}
                        </div>
                        <div className="email">
                            <span>Email: </span>
                            {this.state.userProfile.email}
                        </div>
                        <div className="address">
                            <span>Reg. address: </span>
                            {this.props.user.address}
                        </div>
                        {this.props.user.status === 'SUCCESS' ? (
                            <div className="date">
                                <span>Data submitted on: </span>
                                {this.props.user.created}
                            </div>
                        ) : null}
                        {this.props.user.status === 'SUCCESS' && (
                            <div
                                className="x500"
                                style={
                                    this.props.user.status === 'PENDING'
                                        ? { color: '#919ebd' }
                                        : {}
                                }>
                                <span>x500 name: </span>
                                {this.props.user.x500Name}
                            </div>
                        )}
                        {this.props.user.status === 'SUCCESS' && (
                            <div
                                className="node-email:"
                                style={
                                    this.props.user.status === 'PENDING'
                                        ? { color: '#919ebd' }
                                        : {}
                                }>
                                <span>Node operator email: </span>
                                {this.props.user.nodeEmail}
                            </div>
                        )}
                        <div>
                            {this.props.user.status === 'SUCCESS' ? (
                                <Fragment>
                                    <button
                                        onClick={() =>
                                            this.showBillingDetails()
                                        }
                                        className="btn btn-secondary mt-24 mr-30 mb-16 px-30">
                                        Billing Details
                                    </button>
                                    <button
                                        onClick={() => this.showTermsDetails()}
                                        className="btn btn-secondary mt-24 mb-16 px-30 mr-30">
                                        Terms of use
                                    </button>
                                    {this.props.user.sponsored &&
                                        this.props.user.sponsored.length >
                                            0 && (
                                            <button
                                                onClick={() =>
                                                    this.showSponsoredParticipants()
                                                }
                                                className="btn btn-secondary mt-24 mb-16 px-30">
                                                sponsored participants
                                            </button>
                                        )}
                                </Fragment>
                            ) : (
                                <Fragment>
                                    <button
                                        onClick={() =>
                                            this.showBillingDetails()
                                        }
                                        className="btn btn-secondary mt-24 mr-30 mb-16 px-30">
                                        Billing Details
                                    </button>
                                    <button
                                        onClick={() => this.showTermsDetails()}
                                        className="btn btn-secondary mt-24 mb-16 px-30">
                                        Terms of use
                                    </button>
                                    {this.props.user.status === 'PENDING' &&
                                        this.props.user.billingInfo !== null &&
                                        !!this.state.userTerms.length &&
                                        this.props.user.eligibilityStatus !==
                                            'SUCCESS' && (
                                            <button
                                                onClick={() =>
                                                    this.openApproveUserModal()
                                                }
                                                className="btn btn-primary mt-24 mb-16 px-30 ml-30">
                                                Approve User
                                            </button>
                                        )}
                                    {this.props.user.status === 'PENDING' &&
                                        this.props.user.billingInfo !== null &&
                                        !!this.state.userTerms.length &&
                                        this.props.user.eligibilityStatus ===
                                            'SUCCESS' && (
                                            <button
                                                onClick={() =>
                                                    this.directApproveUser(
                                                        this.props.user.id
                                                    )
                                                }
                                                className="btn btn-primary mt-24 mb-16 px-30 ml-30">
                                                Approve User
                                            </button>
                                        )}
                                </Fragment>
                            )}

                            <div
                                className="close-details box--flex--column center--x center--y"
                                onClick={this.toggleRow.bind(this)}>
                                <i className="mdi mdi-chevron-up"></i>
                            </div>
                        </div>
                    </div>

                    <Modal
                        ariaHideApp={false}
                        isOpen={this.state.isBillingDetailsModalOpen}
                        contentLabel="onRequestClose Example"
                        onRequestClose={() =>
                            this.handleCloseBillingDetailsModal()
                        }
                        className="Modal Modal__admin-billing-details"
                        overlayClassName="Overlay Overlay__feedback">
                        <h1 className="text-center h3">Billing Details</h1>
                        <div className="h-splitter"></div>
                        {this.props.user.billingInfo === null && (
                            <div className="box box--flex--column center--xy no-bd">
                                <i className="mdi mdi-file-document-box-remove-outline"></i>
                                <p className="text-center">
                                    Sorry, there is no billing information about
                                    this user, yet.
                                </p>
                            </div>
                        )}
                        {this.props.user.billingInfo !== null && (
                            <div className="confirm-table">
                                <div className="confirm-table-row box box--flex center--XxX">
                                    <div className="name">
                                        Billing contact first and last name
                                    </div>
                                    <div className="value">
                                        {
                                            this.props.user.billingInfo
                                                .contactName
                                        }
                                    </div>
                                </div>
                                <div className="confirm-table-row box box--flex center--XxX">
                                    <div className="name">Country</div>
                                    <div className="value">
                                        {
                                            this.props.user.billingInfo.address
                                                .addressCountry.name
                                        }
                                    </div>
                                </div>
                                <div className="confirm-table-row box box--flex center--XxX">
                                    <div className="name">City</div>
                                    <div className="value">
                                        {
                                            this.props.user.billingInfo.address
                                                .addressLocality.name
                                        }
                                    </div>
                                </div>
                                <div className="confirm-table-row box box--flex center--XxX">
                                    <div className="name">Address</div>
                                    <div className="value">
                                        {this.props.user.billingInfo.address
                                            .streetAddress.line1 +
                                            ' ' +
                                            this.props.user.billingInfo.address
                                                .streetAddress.line2}{' '}
                                    </div>
                                </div>
                                <div className="confirm-table-row box box--flex center--XxX">
                                    <div className="name">Postcode</div>
                                    <div className="value">
                                        {
                                            this.props.user.billingInfo.address
                                                .postalCode
                                        }
                                    </div>
                                </div>
                                <div className="confirm-table-row box box--flex center--XxX">
                                    <div className="name">Email</div>
                                    <div className="value">
                                        {
                                            this.props.user.billingInfo
                                                .contactEmail
                                        }
                                    </div>
                                </div>
                                <div className="confirm-table-row box box--flex center--XxX">
                                    <div className="name">Phone number</div>
                                    <div className="value">
                                        {
                                            this.props.user.billingInfo
                                                .contactPhone
                                        }
                                    </div>
                                </div>
                            </div>
                        )}
                        <i
                            onClick={() =>
                                this.handleCloseBillingDetailsModal()
                            }
                            className="mdi mdi-close"></i>
                    </Modal>
                    <Modal
                        ariaHideApp={false}
                        isOpen={this.state.isTermsDetailsModalOpen}
                        contentLabel="onRequestClose Example"
                        onRequestClose={() =>
                            this.handleCloseTermsDetailsModal()
                        }
                        className="Modal Modal__admin-tou"
                        overlayClassName="Overlay Overlay__feedback">
                        <h1 className="text-center h3">Terms of use</h1>
                        <div className="h-splitter"></div>
                        {!this.state.userTerms[0] && (
                            <div className="box box--flex--column center--xy no-terms">
                                <i className="mdi mdi-file-document-box-remove-outline"></i>
                                <p>
                                    User has not signed the Terms of Use
                                    agreement, yet.
                                </p>
                                <i
                                    onClick={() =>
                                        this.handleCloseTermsDetailsModal()
                                    }
                                    className="mdi mdi-close"></i>
                            </div>
                        )}
                        {this.state.userTerms[0] && (
                            <div className="confirm-table">
                                <div className="confirm-table-row box box--flex center--XxX center--y">
                                    <div className="name">Network type</div>
                                    {this.state.userTerms[0]
                                        .agreementContext ===
                                        'CORDANETWORK' && (
                                        <div className="value">Production</div>
                                    )}
                                    {this.state.userTerms[0]
                                        .agreementContext === 'UAT' && (
                                        <div className="value">
                                            Pre-production
                                        </div>
                                    )}
                                </div>
                                <div className="confirm-table-row box box--flex center--XxX">
                                    <div className="name">
                                        Terms signer first and last name
                                    </div>
                                    <div className="value">
                                        {this.state.userTerms[0].signatureData
                                            .firstName +
                                            ' ' +
                                            this.state.userTerms[0]
                                                .signatureData.lastName}
                                    </div>
                                </div>
                                <div className="confirm-table-row box box--flex center--XxX">
                                    <div className="name">Email</div>
                                    <div className="value">
                                        {
                                            this.state.userTerms[0]
                                                .signatureData.email
                                        }
                                    </div>
                                </div>
                                <div className="confirm-table-row box box--flex center--XxX">
                                    <div className="name">Signed on</div>
                                    <div className="value">
                                        {this.state.userTerms[0].created.substr(
                                            0,
                                            10
                                        )}
                                    </div>
                                </div>
                                <div className="confirm-table-row box box--flex center--XxX">
                                    <div className="name">Job title</div>
                                    <div className="value">
                                        {
                                            this.state.userTerms[0]
                                                .signatureData.workTitle
                                        }
                                    </div>
                                </div>
                                <i
                                    onClick={() =>
                                        this.handleCloseTermsDetailsModal()
                                    }
                                    className="mdi mdi-close"></i>
                            </div>
                        )}
                    </Modal>
                    <Modal
                        ariaHideApp={false}
                        isOpen={this.state.isApproveUserModalOpen}
                        contentLabel="onRequestClose Example"
                        onRequestClose={() =>
                            this.handleCloseApproveUserModal()
                        }
                        className="Modal Modal__approve-user box--flex--column center--xy"
                        overlayClassName="Overlay Overlay__feedback">
                        <h1 className="text-center h3">Approve user</h1>
                        <div className="h-splitter"></div>
                        <p>
                            Warning: If the participant has rejected or
                            pendinding eligibility status, by approving the user
                            you also change the eligibility status to approved!
                        </p>
                        <button
                            onClick={() => this.approveUser(this.props.user.id)}
                            className="btn btn-primary">
                            Confirm user approval
                        </button>
                        <i
                            onClick={() => this.handleCloseApproveUserModal()}
                            className="mdi mdi-close"></i>
                    </Modal>
                    <Modal
                        ariaHideApp={false}
                        isOpen={this.state.isSponsoredParticipantsModalOpen}
                        contentLabel="onRequestClose Example"
                        onRequestClose={() =>
                            this.handleCloseSponsoredParticipants()
                        }
                        className="Modal Modal__sponsored-participants participants box--flex--column"
                        overlayClassName="Overlay Overlay__feedback">
                        <h1 className="text-center h3 text-left">
                            Sponsored Participants
                        </h1>
                        <h3>{this.props.user.name}</h3>
                        <div className="row participants__header">
                            <div className="col-3 participants__header--item box--flex center--y">
                                company
                            </div>
                            <div className="col-4 participants__header--item box--flex center--y">
                                address
                            </div>
                            <div className="col-2 participants__header--item box--flex center--y">
                                status
                            </div>
                            <div className="col-2 participants__header--item box--flex center--y">
                                confirmed on
                            </div>
                            <div className="col-1 participants__header--item box--flex center--y"></div>
                        </div>
                        <div className="participants__body">
                            {this.props.participantsType === 'sponsor' &&
                                this.props.user.sponsored &&
                                this.props.user.sponsored.length &&
                                this.props.user.sponsored.map(
                                    (sponsoredParticipant, i) => {
                                        return (
                                            <div
                                                key={sponsoredParticipant.name}
                                                className="row participants__body--participant">
                                                <div className="col-3 box--flex--column center--Yyy">
                                                    <div className="name">
                                                        {
                                                            sponsoredParticipant.name
                                                        }
                                                    </div>
                                                    <div className="externalId">
                                                        {
                                                            sponsoredParticipant.externalId
                                                        }
                                                    </div>
                                                </div>
                                                <div className="col-4 box--flex--column center--Yyy">
                                                    <div className="country">
                                                        {
                                                            sponsoredParticipant
                                                                .address
                                                                .addressCountry
                                                                .name
                                                        }
                                                    </div>
                                                    <div className="address">
                                                        {
                                                            sponsoredParticipant
                                                                .address
                                                                .streetAddress
                                                                .line1
                                                        }
                                                    </div>
                                                    <div className="address">
                                                        {sponsoredParticipant
                                                            .address
                                                            .streetAddress.line2
                                                            ? sponsoredParticipant
                                                                  .address
                                                                  .streetAddress
                                                                  .line2
                                                            : null}
                                                    </div>
                                                </div>
                                                <div className="col-2 box--flex center--Yyy">
                                                    {sponsoredParticipant
                                                        .eligibilityCheck
                                                        .status ===
                                                        'SUCCESS' && (
                                                        <Badge theme="success">
                                                            approved
                                                        </Badge>
                                                    )}

                                                    {/* {sponsoredParticipant
                                                        .eligibilityCheck
                                                        .status ===
                                                        'PENDING_REVIEW' && (
                                                        <Badge theme="pending">
                                                            pending
                                                        </Badge>
                                                    )} */}

                                                    {(sponsoredParticipant
                                                        .eligibilityCheck
                                                        .status ===
                                                        'PENDING_REVIEW' ||
                                                        sponsoredParticipant
                                                            .eligibilityCheck
                                                            .status ===
                                                            'ERROR') && (
                                                        <Badge theme="error">
                                                            failed
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="col-2 box--flex center--Yyy">
                                                    <div className="confirmed">
                                                        {sponsoredParticipant.identityCheck.updated.substr(
                                                            0,
                                                            10
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="col-1 box--flex center--Yyy">
                                                    {sponsoredParticipant
                                                        .eligibilityCheck
                                                        .status ===
                                                        'PENDING_REVIEW' && (
                                                        <i
                                                            onClick={() =>
                                                                this.editEligibilitySanction(
                                                                    this.props
                                                                        .user
                                                                        .sponsored[
                                                                        i
                                                                    ]
                                                                        .eligibilityCheck
                                                                        .id,
                                                                    this.props
                                                                        .user
                                                                        .sponsored[
                                                                        i
                                                                    ].id
                                                                )
                                                            }
                                                            className="mdi mdi-account-check-outline"></i>
                                                    )}

                                                    {sponsoredParticipant
                                                        .eligibilityCheck
                                                        .status === 'ERROR' && (
                                                        <i
                                                            onClick={() =>
                                                                this.editEligibilitySanction(
                                                                    this.props
                                                                        .user
                                                                        .sponsored[
                                                                        i
                                                                    ]
                                                                        .eligibilityCheck
                                                                        .id,
                                                                    this.props
                                                                        .user
                                                                        .sponsored[
                                                                        i
                                                                    ].id
                                                                )
                                                            }
                                                            className="mdi mdi-account-check-outline"></i>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    }
                                )}
                            <div className="row participants__body--participan closer box box--flex text-center center--x center--y">
                                <span
                                    onClick={() =>
                                        this.handleCloseSponsoredParticipants()
                                    }>
                                    close
                                </span>
                            </div>
                        </div>
                        <i
                            onClick={() =>
                                this.handleCloseSponsoredParticipants()
                            }
                            className="mdi mdi-close"></i>
                    </Modal>
                </div>
            </LoadingOverlay>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        uar: state.uar,
        loader: state.loader,
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
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableRow);
