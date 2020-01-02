import React from 'react';
import './ConfirmBillingDetails.scss';
import { connect } from 'react-redux';
import * as actionTypes from '../../../../store/actions';
import {
    axiosBillingDetailsPUT,
    axiosBillingDetailsPOST,
} from '../../../../axios/axios';
import { handleApiError } from '../../../../utils/utils';

class ConfirmBillingDetails extends React.Component {
    handleConfirmBillingDetails() {
        const payload = {
            contactName: this.props.bdr.contactName,
            contactEmail: this.props.bdr.contactEmail,
            contactPhone: this.props.bdr.contactPhone,
            address: this.props.bdr.address,
        };
        this.props.startLoader();
        if (this.props.csr.isBliingDetailsCompleted) {
            axiosBillingDetailsPOST(payload)
                .then(() => {
                    this.props.onConfirmBillingDetails();
                    this.props.stopLoader();
                })
                .catch((err) => {
                    handleApiError(err);
                    this.props.stopLoader();
                });
        } else {
            axiosBillingDetailsPUT(payload)
                .then(() => {
                    this.props.onConfirmBillingDetails();
                    this.props.stopLoader();
                })
                .catch((err) => {
                    handleApiError(err);
                    this.props.stopLoader();
                });
        }
    }

    render() {
        return (
            <div className="card confirm-billing-details">
                <div className="card-body">
                    <h1 className="text-center h3">Create Account</h1>
                    <p className="text-center subtitle">
                        Enter Billing Details
                    </p>
                    <div className="h-splitter"></div>
                    <div className="confirm-table">
                        <div className="confirm-table-row box box--flex center--XxX">
                            <div className="name">
                                Billing contact first and last name
                            </div>
                            <div className="value">
                                {this.props.bdr.contactName}
                            </div>
                        </div>
                        <div className="confirm-table-row box box--flex center--XxX">
                            <div className="name">Legal entity name</div>
                            <div className="value">{this.props.ler.name}</div>
                        </div>
                        <div className="confirm-table-row box box--flex center--XxX">
                            <div className="name">Country</div>
                            <div className="value">
                                {this.props.bdr.address.addressCountry.name}
                            </div>
                        </div>
                        <div className="confirm-table-row box box--flex center--XxX">
                            <div className="name">City</div>
                            <div className="value">
                                {this.props.bdr.address.addressLocality.name}
                            </div>
                        </div>
                        <div className="confirm-table-row box box--flex center--XxX">
                            <div className="name">Address</div>
                            <div className="value">
                                {this.props.bdr.address.streetAddress.line1}
                            </div>
                        </div>
                        <div className="confirm-table-row box box--flex center--XxX">
                            <div className="name">Postcode</div>
                            <div className="value">
                                {this.props.bdr.address.postalCode}
                            </div>
                        </div>
                        <div className="confirm-table-row box box--flex center--XxX">
                            <div className="name">Email</div>
                            <div className="value">
                                {this.props.bdr.contactEmail}
                            </div>
                        </div>
                        <div className="confirm-table-row box box--flex center--XxX">
                            <div className="name">Phone number</div>
                            <div className="value">
                                {this.props.bdr.contactPhone}
                            </div>
                        </div>
                        {/* <div className="confirm-table-row box box--flex center--XxX">
                            <div className="name">External ID</div>
                            <div className="value">
                                {this.props.ler.externalId}
                            </div>
                        </div> */}
                    </div>

                    <div className="h-splitter"></div>
                    <div className="box box--flex center--XxX actions">
                        <button
                            type="button"
                            className="btn btn-link m-0"
                            onClick={() =>
                                this.props.onBackConfirmBillingDetails()
                            }>
                            Edit
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary m-0"
                            onClick={() => this.handleConfirmBillingDetails()}>
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
        bdr: state.bdr.billingDetails,
        csr: state.csr,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onBackConfirmBillingDetails: () =>
            dispatch({
                type: actionTypes.CURRENT_STEP_ENTER_BILLING_DETAILS,
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
        onConfirmBillingDetails: () =>
            dispatch({
                type: actionTypes.CURRENT_STEP_SIGN_TERMS,
            }),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ConfirmBillingDetails);
