import React, { Component, Fragment } from 'react';
import './TermsOfUse.scss';
import Terms from './Terms/Terms';
import { connect } from 'react-redux';
import * as actionTypes from '../../../store/actions';
import {
    axiosOnboardingTermsGET,
    axiosInviteSignerPOST,
    axiosSignatureRequestsGET,
    axiosCurrentAccountGET,
} from '../../../axios/axios';
import base64 from 'base-64';
import Modal from 'react-modal';
import { handleApiError } from '../../../utils/utils';
import { decode_utf8 } from '../../../utils/utils';
import { getCookie } from '../../../helpers/authorizationService';
import { Link } from 'react-router-dom';
import { deleteCookie } from '../../../helpers/authorizationService';
import {
    VALID_NAMES_REGEX,
    VALID_MAIL_REGEX,
    SPECIAL_CHARS_REGEX,
} from '../../../utils/constant';

class TermsOfUse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            productionTypes: ['production', 'preproduction'],
            selectedProductionType: '',
            isProductionTypeSelected: false,
            termsText: '',
            termsId: '',
            signinToken: '',
            showFeedbackModal: false,
            feedbackMail: '',
            isValidFeedbackMail: false,
            message: '',
            signerMail: '',
            isValidSignerMail: false,
            signerNames: '',
            isSignerNamesValid: false,
            signingExpiration: '',
            signingProductionType: '',
            signingInProcess: false,
            invitedMail: '',
        };
    }

    componentDidMount() {
        this.getSignaturesRequest();
    }

    getSignaturesRequest() {
        this.props.startLoader();
        axiosSignatureRequestsGET()
            .then((response) => {
                if (response.data.length > 0) {
                    this.setState({
                        signingInProcess: true,
                        signerMail: response.data[0].assignee.email,
                        signingExpiration: response.data[0].expiresAt,
                        signingProductionType:
                            response.data[0].agreementContext,
                    });
                }
            })
            .then(() => {
                if (
                    this.props.upr.names === '' ||
                    this.props.upr.email === ''
                ) {
                    axiosCurrentAccountGET()
                        .then((acc) => {
                            const names =
                                acc.data.firstName + ' ' + acc.data.lastName;
                            const role = getCookie('userRole');

                            this.props.onSetUserProfile(
                                names,
                                acc.data.email,
                                role
                            );
                            this.props.stopLoader();
                        })
                        .catch((err) => {
                            handleApiError(err);
                            this.props.stopLoader();
                        });
                }
            })
            .catch((err) => {
                handleApiError(err);
                this.props.stopLoader();
            });
    }

    handleProductionTypeChange(type) {
        this.props.startLoader();

        axiosOnboardingTermsGET(type, this.props.ptr)
            .then((response) => {
                this.setState({
                    selectedProductionType: type,
                    isProductionTypeSelected: true,
                    termsText: decode_utf8(
                        base64
                            .decode(response.data.content)
                            .replace(/<u>/g, '_')
                            .replace(/<\/u>/g, '_')
                    ),
                    termsId: response.data.id,
                });
                const headings = Array.from(
                    document.getElementsByTagName('h3')
                );
                headings[0].innerText = headings[0].innerText
                    .toLowerCase()
                    .replace(/\b(\w)/g, (firstLetter) => {
                        return firstLetter.toUpperCase();
                    });
                this.props.stopLoader();
            })
            .catch((err) => {
                handleApiError(err);

                this.setState({
                    selectedProductionType: '',
                    isProductionTypeSelected: false,
                    termsText: '',
                    termsId: '',
                });
                this.props.stopLoader();
            });
    }

    // SIGNER MAIL
    handleSignerMailChange(event) {
        this.setState({
            signerMail: event.target.value,
            isValidSignerMail: this.validateMail(event.target.value),
        });
    }

    handleSignerMailBlur(event) {
        this.validateMail(event.target.value)
            ? (event.target.className = 'form-control is-valid')
            : (event.target.className = 'form-control is-invalid');
    }

    validateMail(email) {
        const emailValidator = VALID_MAIL_REGEX;
        if (!emailValidator.test(email)) {
            return false;
        } else if (email === this.props.upr.email) {
            return false;
        }
        return true;
    }

    // SIGNER NAMES
    handleSignerNamesChange(event) {
        this.setState({
            signerNames: event.target.value,
            isSignerNamesValid: this.validateNames(event.target.value),
        });
    }

    handleSignerNamesBlur(event) {
        this.validateNames(event.target.value)
            ? (event.target.className = 'form-control is-valid')
            : (event.target.className = 'form-control is-invalid');
    }

    validateNames(name) {
        const namesRegex = VALID_NAMES_REGEX;

        if (!namesRegex.test(name)) {
            return false;
        } else if (!this.validateSpecialCharacters(name)) {
            return false;
        }
        return true;
    }

    // OVERALL FORM VALIDATIONS
    validateSpecialCharacters(formField) {
        const specialCharactersRegex = SPECIAL_CHARS_REGEX;

        if (typeof formField === 'string' && formField.trim().length < 2) {
            return false;
        } else if (
            formField[0] === ' ' ||
            formField[formField.length - 1] === ' '
        ) {
            return false;
        } else if (specialCharactersRegex.test(formField)) {
            return false;
        } else {
            return true;
        }
    }

    isFormValid() {
        return (
            this.state.isValidSignerMail &&
            this.state.isProductionTypeSelected &&
            this.state.isSignerNamesValid
        );
    }

    handleOpenFeedbackModal() {
        this.setState({ showFeedbackModal: true });
    }

    handleCloseFeedbackModal() {
        this.setState({ showFeedbackModal: false });
    }

    // FEEDBACK MAIL
    handleFeedbackMailChange(event) {
        this.setState({
            feedbackMail: event.target.value,
            isValidFeedbackMail: this.validateFeedbackMail(event.target.value),
        });
    }

    handleFeedbackMailBlur(event) {
        this.validateFeedbackMail(event.target.value)
            ? (event.target.className = 'form-control is-valid')
            : (event.target.className = 'form-control is-invalid');
    }

    validateFeedbackMail(email) {
        const emailValidator = VALID_MAIL_REGEX;
        if (!emailValidator.test(email)) {
            return false;
        }
        return true;
    }

    // FEEDBACK MESSAGE
    handleFeedBackMessageTextChange(event) {
        this.setState({
            message: event.target.value,
        });
    }

    validateFeedBackMessage(message) {
        if (!this.validateSpecialCharacters(message)) {
            return false;
        }
        return true;
    }

    handleSubmitAction() {
        this.props.startLoader();

        axiosInviteSignerPOST(this.state.termsId, this.state.signerMail)
            .then((response) => {
                this.setState({
                    signingInProcess: true,
                    invitedMail: response.config.data.email,
                });

                this.getSignaturesRequest();
                this.props.stopLoader();
            })
            .catch((err) => {
                this.setState({
                    signingInProcess: false,
                });
                this.props.stopLoader();
                handleApiError(err);
            });
    }

    handleBackAction() {
        this.props.onBackTerms();
    }

    logout() {
        this.props.onStartLoader();
        deleteCookie('authorizationKey');
        deleteCookie('userRole');
        localStorage.removeItem('email');
        this.props.onClearUserAuthorization();
        this.props.onRemoveUserRole();
        this.props.onStopLoader();
        this.props.history.push('/login');
    }

    render() {
        const {
            productionTypes,
            selectedProductionType,
            isProductionTypeSelected,
        } = this.state;
        return (
            <div className="terms-of-use box box--flex--column center--Xxx bg-white">
                {this.state.signingInProcess && (
                    <div className="awaiting-signer box--flex--column center--y">
                        <p className="text-center px-15">
                            We have sent an invitation to the authorised
                            signatory from your company. They will receive a
                            login link and have the option to sign the{' '}
                            <b>
                                {this.state.signingProductionType ===
                                'CORDANETWORK'
                                    ? 'Production'
                                    : 'Preproduction'}{' '}
                                Network
                            </b>{' '}
                            agreement.
                        </p>
                        <p className="text-center px-15">
                            The invitation will be valid until{' '}
                            <b>{this.state.signingExpiration.substr(11, 8)}</b>,
                            on{' '}
                            <b>{this.state.signingExpiration.substr(0, 10)}</b>.
                            After that, you will need to resend it.
                        </p>

                        {/* SET SIGNER FORM */}
                        <form className="box box--flex--column">
                            {/* EMAIL */}
                            <div className="form-group">
                                <label
                                    htmlFor="signerMail"
                                    className="has-float-label">
                                    <input
                                        name="signerMail"
                                        type="text"
                                        id="signerMail"
                                        placeholder=" "
                                        className="form-control"
                                        disabled={true}
                                        value={this.state.signerMail}
                                    />
                                    <span>authorised signatory email</span>
                                </label>
                            </div>
                        </form>
                        <div className="h-splitter"></div>
                        <div className="box--flex center--xXx">
                            <Link
                                to="/login"
                                className="solo-link m-0"
                                onClick={() => this.logout()}>
                                Save and Log Out
                            </Link>
                        </div>
                    </div>
                )}
                {!this.state.signingInProcess && (
                    <Fragment>
                        <h1 className="text-center h3">Sign Terms of Use</h1>
                        <p className="subtitle text-center">
                            Send Terms of Use Agreement to Authorised Assigner
                        </p>
                        <div className="h-splitter"></div>
                        <p className="text-center px-15 signer-form-description">
                            Enter the email of the authorised signatory from
                            your company. They will receive a login link and
                            have the option to sign this agreement.
                        </p>

                        {/* SET SIGNER FORM */}
                        <form className="box box--flex--column">
                            {/* EMAIL */}
                            <div className="form-group">
                                <label
                                    htmlFor="signerMail"
                                    className="has-float-label">
                                    <input
                                        name="signerMail"
                                        type="text"
                                        id="signerMail"
                                        placeholder=" "
                                        className="form-control"
                                        onChange={(e) => {
                                            this.handleSignerMailChange(e);
                                        }}
                                        onBlur={(e) => {
                                            this.handleSignerMailBlur(e);
                                        }}
                                    />
                                    <span>authorised signatory email*</span>
                                </label>
                            </div>
                            {/* NAMES */}
                            <div className="form-group">
                                <label
                                    htmlFor="signerNames"
                                    className="has-float-label">
                                    <input
                                        name="signerNames"
                                        type="text"
                                        id="signerNames"
                                        placeholder=" "
                                        className="form-control"
                                        onChange={(e) => {
                                            this.handleSignerNamesChange(e);
                                        }}
                                        onBlur={(e) => {
                                            this.handleSignerNamesBlur(e);
                                        }}
                                    />
                                    <span>
                                        authorised signatory first and last
                                        name*
                                    </span>
                                </label>
                            </div>
                        </form>

                        <div className="h-splitter"></div>

                        {/* PRODUCTION */}
                        <div
                            className={
                                selectedProductionType === productionTypes[0]
                                    ? 'production production__selected'
                                    : 'production'
                            }
                            onClick={() =>
                                this.handleProductionTypeChange(
                                    productionTypes[0]
                                )
                            }>
                            <div className="production__header ">
                                Pre-Production and Production{' '}
                                <span>(recommended)</span>
                            </div>
                            <div className="production__info">
                                Signing this agreement grants access to both the
                                test network and live network. We recommend
                                signing this agreement if you intend to go live
                                over the next 6-12 months.
                            </div>
                            <i className="mdi mdi-check-circle-outline"></i>
                        </div>
                        {/* PREPRODUCTION */}
                        <div
                            className={
                                selectedProductionType === productionTypes[1]
                                    ? 'pre-production pre-production__selected'
                                    : 'pre-production'
                            }
                            onClick={() =>
                                this.handleProductionTypeChange(
                                    productionTypes[1]
                                )
                            }>
                            <div className="pre-production__header">
                                pre-Production only
                            </div>
                            <div className="pre-production__info">
                                This agreement should be signed if you’re only
                                intending to do testing (i.e., no live business
                                transactions) over the next 6-12 months. If you
                                decide to join the production network later,
                                you’ll need to sign a second production-only
                                agreement before you can join it.
                            </div>
                            <i className="mdi mdi-check-circle-outline"></i>
                        </div>

                        {/* TERMS */}
                        {isProductionTypeSelected && (
                            <Terms
                                productionType={selectedProductionType}
                                text={this.state.termsText}
                            />
                        )}

                        {!isProductionTypeSelected && (
                            <div className="h-splitter"></div>
                        )}

                        {/* ACTION BUTTONS */}
                        <div className="box box--flex center--XxX actions">
                            <div>
                                {/* <button
                                    type="button"
                                    data-toggle="button"
                                    aria-pressed="false"
                                    className="btn btn-secondary btn-back m-0 mr-15"
                                    // disabled={!isProductionTypeSelected}
                                    onClick={() => this.props.onBackTerms()}>
                                    Back
                                </button> */}
                                <button
                                    type="button"
                                    data-toggle="button"
                                    aria-pressed="false"
                                    className="btn btn-secondary btn-back m-0"
                                    disabled={!isProductionTypeSelected}
                                    onClick={() =>
                                        this.handleOpenFeedbackModal()
                                    }>
                                    Any Questions?
                                </button>
                            </div>
                            <button
                                type="button"
                                data-toggle="button"
                                aria-pressed="false"
                                className="btn btn-primary btn-next m-0"
                                disabled={!this.isFormValid()}
                                onClick={() => this.handleSubmitAction()}>
                                Submit
                            </button>
                        </div>
                    </Fragment>
                )}
                <Modal
                    ariaHideApp={false}
                    isOpen={this.state.showFeedbackModal}
                    contentLabel="onRequestClose Example"
                    onRequestClose={() => this.handleCloseFeedbackModal()}
                    className="Modal Modal__feedback Modal__feedback--tou"
                    overlayClassName="Overlay Overlay__feedback">
                    <h1 className="text-center h3">Send Feedback</h1>
                    <div className="h-splitter"></div>
                    <p className="text-center">
                        If you have any questions or comments regarding this
                        Terms of Use agreement, send us a message here at{' '}
                        <a
                            href={
                                'mailto:info@corda.network?subject=Onboarding terms of use feedback'
                            }
                            className="text-red">
                            info@corda.network
                        </a>{' '}
                        and we'll get back to you.
                    </p>
                    <div className="h-splitter"></div>
                    <div className="box box--flex center--xXx actions">
                        <button
                            type="button"
                            data-toggle="button"
                            aria-pressed="false"
                            className="btn btn-link btn-back m-0"
                            onClick={() => this.handleCloseFeedbackModal()}>
                            Cancel
                        </button>
                    </div>
                    <i
                        onClick={() => this.handleCloseFeedbackModal()}
                        className="mdi mdi-close"></i>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        ler: state.ler.legalEntity,
        ptr: state.ptr.participantType,
        loader: state.loader,
        upr: state.upr,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onSetCurrentTerm: (currentTerm) =>
            dispatch(
                {
                    type: actionTypes.SET_CURRENT_TERMS,
                    currentTerm: currentTerm,
                },
                dispatch({
                    type: actionTypes.CURRENT_STEP_CONFIRM_SIGN_TERMS,
                })
            ),
        onBackTerms: () =>
            dispatch({
                type: actionTypes.CURRENT_STEP_REENTER_BILLING_DETAILS,
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
        onClearUserAuthorization: () =>
            dispatch({
                type: actionTypes.REMOVE_USER_AUTHORIZATION,
            }),
        onRemoveUserRole: () =>
            dispatch({
                type: actionTypes.REMOVE_USER_ROLE,
            }),
        onSetUserProfile: (names, email, role) =>
            dispatch({
                type: actionTypes.SET_USER_PROFILE,
                names: names,
                email: email,
                role: role,
            }),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TermsOfUse);
