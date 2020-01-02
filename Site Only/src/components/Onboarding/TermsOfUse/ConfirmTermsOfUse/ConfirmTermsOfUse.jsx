import React, { Component } from 'react';
import './ConfirmTermsOfUse.scss';
import { connect } from 'react-redux';
import * as actionTypes from '../../../../store/actions';
import {
    axiosOnboardingTermsPOST,
    axiosSigningTokenPOST_V2,
    axiosCurrentAccountPOST,
} from '../../../../axios/axios';
import { handleApiError } from '../../../../utils/utils';

class ConfirmTermsOfUse extends Component {
    handleSubmitAction() {
        this.props.startLoader();
        const payload = {
            firstName: this.props.str.currentTerm.firstName,
            lastName: this.props.str.currentTerm.lastName,
            email: this.props.str.currentTerm.email,
            workTitle: this.props.str.currentTerm.workTitle,
            phoneNumber: 'phoneNumber',
            termsId: this.props.str.currentTerm.termsId,
            signatureRequestId: this.props.signatureRequestId,
        };

        axiosCurrentAccountPOST(payload)
            .then(() => {
                axiosSigningTokenPOST_V2(payload)
                    .then((response) => {
                        return response.data.token;
                    })
                    .then((token) => {
                        axiosOnboardingTermsPOST(
                            this.props.str.currentTerm.termsId,
                            token
                        )
                            .then(() => {
                                this.props.backAfterConfirm();
                                this.props.stopLoader();
                            })
                            .catch((err) => {
                                this.props.backAfterConfirm();
                                handleApiError(err);
                                this.props.stopLoader();
                            });
                    })
                    .catch((err) => {
                        this.props.onBackToPreview();
                        handleApiError(err);
                        this.props.stopLoader();
                    });
            })
            .catch((err) => {
                handleApiError(err);
                this.props.stopLoader();
            });
    }

    render() {
        return (
            <div className="row">
                <div className="confirm-terms box box--flex--column center--Xxx bg-white">
                    <div className="card-body">
                        <h1 className="text-center h3">
                            Sign Terms of Use Agreement
                        </h1>
                        <p className="text-center subtitle">
                            Please, review the information below
                        </p>
                        <div className="h-splitter"></div>
                        <div className="confirm-table">
                            <div className="confirm-table-row box box--flex center--XxX">
                                <div className="name">Network Type</div>
                                <div className="value">
                                    {this.props.str.currentTerm.networkType ===
                                    'CORDANETWORK'
                                        ? 'Production'
                                        : 'Preproduction'}
                                </div>
                            </div>
                            <div className="confirm-table-row box box--flex center--XxX">
                                <div className="name">Legal entity name</div>
                                <div className="value">
                                    {this.props.ler.name}
                                </div>
                            </div>
                            <div className="confirm-table-row box box--flex center--XxX">
                                <div className="name">Names</div>
                                <div className="value">
                                    {this.props.str.currentTerm.firstName +
                                        ' ' +
                                        this.props.str.currentTerm.lastName}
                                </div>
                            </div>
                            <div className="confirm-table-row box box--flex center--XxX">
                                <div className="name">Job Title</div>
                                <div className="value">
                                    {this.props.str.currentTerm.workTitle}
                                </div>
                            </div>
                            <div className="confirm-table-row box box--flex center--XxX">
                                <div className="name">Work Mail</div>
                                <div className="value">
                                    {this.props.str.currentTerm.email}
                                </div>
                            </div>
                        </div>

                        <div className="h-splitter"></div>
                        <div className="box box--flex center--XxX actions">
                            <button
                                type="button"
                                className="btn btn-link m-0"
                                onClick={() => this.props.onBackToPreview()}>
                                Edit
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary m-0"
                                onClick={() => this.handleSubmitAction()}>
                                Confirm
                            </button>
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
        ptr: state.ptr.participantType,
        str: state.str,
        loader: state.loader,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onConfirmTerms: () =>
            dispatch({
                type: actionTypes.CURRENT_STEP_IDENTITY_CHECKS,
            }),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmTermsOfUse);
