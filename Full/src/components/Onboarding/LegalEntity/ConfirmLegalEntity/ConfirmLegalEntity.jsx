import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './ConfirmLegalEntity.scss';
import { connect } from 'react-redux';
import * as actionTypes from '../../../../store/actions';
import {
    axiosParticipantPrimaryPUT,
    axiosParticipantPrimaryPOST,
    axiosParticipantPUT,
} from '../../../../axios/axios';
import { handleApiError } from '../../../../utils/utils';

class ConfirmLegalEntity extends Component {
    submitParticipantPrimary() {
        this.props.onStartLoader();

        let legalEntityReducer;
        let participantType;
        if (!this.props.csr.isOnboardingCompleted) {
            legalEntityReducer = this.props.ler;
            participantType = this.props.ptr.participantType;
        } else {
            legalEntityReducer = this.props.sponsoredLegalEntityReducer;
            participantType = 'SPONSEE';
        }

        const name = legalEntityReducer.name;
        const signature = legalEntityReducer.signature;
        const country = legalEntityReducer.address.addressCountry
            ? legalEntityReducer.address.addressCountry.name
            : 'No country name';
        const isoAlpha2Code = legalEntityReducer.address.addressCountry
            ? legalEntityReducer.address.addressCountry.isoAlpha2Code
            : 'No IsoAlpha2Code';
        const postalCode = legalEntityReducer.address.postalCode
            ? legalEntityReducer.address.postalCode
            : 'No postal code';
        const addressLocality = legalEntityReducer.address.addressLocality
            ? legalEntityReducer.address.addressLocality.name
            : 'No locality';
        const addressRegion = legalEntityReducer.address.addressRegion;
        const streetAddress = legalEntityReducer.address.streetAddress;
        const type = participantType;
        const externalId = legalEntityReducer.externalId;

        const payload = {
            name,
            signature,
            country,
            isoAlpha2Code,
            addressLocality,
            addressRegion,
            postalCode,
            streetAddress,
            type,
            externalId,
        };

        if (
            this.props.csr.isParticipantPrimaryCompleted &&
            !this.props.csr.isOnboardingCompleted
        ) {
            axiosParticipantPrimaryPOST(payload)
                .then(() => {
                    this.setState({
                        submitInProgress: false,
                    });
                    this.props.onConfirmLegalEntity();
                    this.props.onStopLoader();
                })
                .catch((err) => {
                    handleApiError(err);
                    this.setState({
                        submitInProgress: false,
                    });
                    this.props.onStopLoader();
                });
        } else if (
            !this.props.csr.isParticipantPrimaryCompleted &&
            !this.props.csr.isOnboardingCompleted
        ) {
            axiosParticipantPrimaryPUT(payload)
                .then(() => {
                    this.setState({
                        submitInProgress: false,
                    });
                    this.props.onConfirmLegalEntity();
                    this.props.onStopLoader();
                })
                .catch((err) => {
                    handleApiError(err);
                    this.setState({
                        submitInProgress: false,
                    });
                    this.props.onStopLoader();
                });
        } else if (this.props.csr.isOnboardingCompleted) {
            axiosParticipantPUT(payload)
                .then(() => {
                    this.props.onConfirmSponsoredLegalEntity();
                    this.props.onStopLoader();
                })
                .catch((err) => {
                    handleApiError(err);
                    this.props.onStopLoader();
                });
        }
    }

    handleBackAction() {
        if (this.props.csr.isOnboardingCompleted) {
            this.props.onBackSponsoredParticipantsConfirmLegalEntity();
        } else {
            this.props.onBackConfirmLegalEntity();
        }
    }

    render() {
        let legalEntityReducer;
        if (!this.props.csr.isOnboardingCompleted) {
            legalEntityReducer = this.props.ler;
        } else {
            legalEntityReducer = this.props.sponsoredLegalEntityReducer;
        }

        return (
            <div className="confirm-legal-entity box--flex--column">
                <div className="confirm-wrapper box box--flex--column center--Xxx bg-white">
                    <h1 className="text-center h3">Create Account</h1>
                    <p className="text-center subtitle">
                        Confirm Legal Entity Name
                    </p>
                    <div className="h-splitter"></div>
                    <div className="mt-5">
                        <h2 className="h4 company-name text-center">
                            {legalEntityReducer.name
                                ? legalEntityReducer.name
                                : 'No name'}
                        </h2>
                    </div>
                    <div className="confirm-table">
                        {/* <div className="confirm-table-row odd box box--flex center--XxX">
                            <div className="name">External ID</div>
                            <div className="value">
                                {legalEntityReducer.externalId}
                            </div>
                        </div> */}
                        <div className="confirm-table-row odd box box--flex center--XxX">
                            <div className="name">Reg. Address</div>
                            <div className="value">
                                {legalEntityReducer.address &&
                                legalEntityReducer.address.streetAddress
                                    ? legalEntityReducer.address.streetAddress
                                          .line1
                                    : 'No address'}
                                {legalEntityReducer.address &&
                                legalEntityReducer.address.streetAddress
                                    ? legalEntityReducer.address.streetAddress
                                          .line2
                                    : ''}
                            </div>
                        </div>
                        <div className="confirm-table-row box box--flex center--XxX">
                            <div className="name">Locality</div>
                            {legalEntityReducer.address && (
                                <div className="value">
                                    {legalEntityReducer.address.addressCountry
                                        ? legalEntityReducer.address
                                              .addressCountry.name
                                        : 'No address'}{' '}
                                </div>
                            )}
                        </div>
                        <div className="confirm-table-row odd box box--flex center--XxX">
                            <div className="name">Postal Code</div>
                            <div className="value">
                                {legalEntityReducer.address && (
                                    <div className="value">
                                        {legalEntityReducer.address.postalCode
                                            ? legalEntityReducer.address
                                                  .postalCode
                                            : 'No postal code'}{' '}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="confirm-table-row box box--flex center--XxX">
                            <div className="name">Country</div>
                            {legalEntityReducer.address && (
                                <div className="value">
                                    {legalEntityReducer.address.addressLocality
                                        ? legalEntityReducer.address
                                              .addressLocality.name
                                        : 'No Locality'}{' '}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="h-splitter"></div>
                    <div className="confirm-explanation">
                        It’s important you pick the right legal entity here (and
                        not one which looks similar). This will be used in the
                        legal agreement for the onboarding process,{' '}
                        <Link to="/participation/distinguishedname">
                            node x500 name
                        </Link>{' '}
                        and therefore, the network map.
                    </div>
                    <div className="box box--flex center--XxX actions">
                        <button
                            type="button"
                            data-toggle="button"
                            aria-pressed="false"
                            className="btn btn-link btn-back"
                            onClick={() => this.handleBackAction()}>
                            Search again
                        </button>
                        <button
                            type="button"
                            data-toggle="button"
                            aria-pressed="false"
                            className="btn btn-primary btn-next"
                            onClick={() => this.submitParticipantPrimary()}>
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        ler: state.ler.legalEntity,
        ptr: state.ptr,
        csr: state.csr,
        sponsoredLegalEntityReducer:
            state.sponsoredLegalEntityReducer.legalEntity,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onConfirmLegalEntity: () => {
            dispatch({
                type: actionTypes.CURRENT_STEP_ENTER_BILLING_DETAILS,
            });
        },
        onConfirmSponsoredLegalEntity: () => {
            dispatch({
                type: actionTypes.SHOW_SPONSORED_PARTICIPANTS,
            });
        },
        onBackConfirmLegalEntity: () =>
            dispatch({
                type: actionTypes.CURRENT_STEP_SELECT_LEGAL_ENTITY,
            }),
        onBackSponsoredParticipantsConfirmLegalEntity: () =>
            dispatch({
                type: actionTypes.SPONSOR_SELECT_LEGAL_ENTITY,
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

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmLegalEntity);
