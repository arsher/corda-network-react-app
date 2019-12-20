import React, { Component } from 'react';
import './ProductionTerms.scss';
import Modal from 'react-modal';
import {
    axiosOnboardingTermsGET,
    axiosParticipantPrimaryGET,
    axiosInviteSignerPOST,
} from '../../axios/axios';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions';
import LoadingOverlay from 'react-loading-overlay';
import base64 from 'base-64';
import ReactMarkdown from 'react-markdown';
import { handleApiError } from '../../utils/utils';
import {
    VALID_NAMES_REGEX,
    VALID_MAIL_REGEX,
    SPECIAL_CHARS_REGEX,
} from '../../utils/constant';
import { Link } from 'react-router-dom';

class ProductionTerms extends Component {
    constructor(props) {
        super(props);
        this.state = {
            signerMail: '',
            issignerMailValid: false,
            signerNames: '',
            isSignerNamesValid: '',
            showFeedbackModal: false,
            feedbackMail: '',
            isValidFeedbackMail: false,
            message: '',
            showSuccessfullySignedModal: false,
            termsId: '',
            termsText: '',
        };
    }

    componentDidMount() {
        this.props.onStartLoader();
        if (typeof this.props.participantType === 'undefined') {
            axiosParticipantPrimaryGET()
                .then((response) => {
                    this.props.onSetParticipantType(response.data.type);
                })
                .then(() => {
                    axiosOnboardingTermsGET(
                        'production',
                        this.props.ptr.participantType
                    )
                        .then((response) => {
                            this.setState({
                                termsText: base64
                                    .decode(response.data.content)
                                    .replace(/<u>/g, '_')
                                    .replace(/<\/u>/g, '_'),
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
                            this.props.onStopLoader();
                        })
                        .catch((err) => {
                            handleApiError(err);
                            this.props.onStopLoader();
                        });
                })
                .catch((err) => {
                    this.handleApiError(err);
                    this.props.onStopLoader();
                });
        } else {
            axiosOnboardingTermsGET(
                'production',
                this.props.ptr.participantType
            )
                .then((response) => {
                    this.setState({
                        termsText: base64
                            .decode(response.data.content)
                            .replace(/<u>/g, '_')
                            .replace(/<\/u>/g, '_'),
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
                    this.props.onStopLoader();
                })
                .catch((err) => {
                    handleApiError(err);
                    this.props.onStopLoader();
                });
        }
    }

    // MAIL
    handleSignerMailChange(event) {
        this.setState({
            signerMail: event.target.value,
            issignerMailValid: this.validateMail(event.target.value),
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
        }
        return true;
    }

    // NAMES
    handleNamesChange(event) {
        this.setState({
            names: event.target.value,
            isSignerNamesValid: this.validateNames(event.target.value),
        });
    }

    handleNamesBlur(event) {
        this.validateNames(event.target.value)
            ? (event.target.className = 'form-control is-valid')
            : (event.target.className = 'form-control is-invalid');
    }

    validateNames(names) {
        const namesRegex = VALID_NAMES_REGEX;

        if (!namesRegex.test(names)) {
            return false;
        } else if (!this.validateSpecialCharacters(names)) {
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
        return this.state.issignerMailValid && this.state.isSignerNamesValid;
    }

    askQuestion() {
        this.handleOpenFeedbackModal();
    }

    handleOpenFeedbackModal() {
        this.setState({ showFeedbackModal: true });
    }

    handleCloseFeedbackModal() {
        this.setState({ showFeedbackModal: false });
    }

    handleOpenSuccessfulySignedModal() {
        this.props.onStartLoader();

        axiosInviteSignerPOST(this.state.termsId, this.state.signerMail)
            .then(() => {
                this.setState({ showSuccessfullySignedModal: true });
                this.props.onStopLoader();
            })
            .catch((err) => {
                handleApiError(err);
                this.props.onStopLoader();
            });
    }

    handleCloseSuccessfulySignedModal() {
        this.setState({ showSuccessfullySignedModal: false });
        if (
            this.props.cnr.currentStep ===
            actionTypes.UPGRADE_TO_PRODUCTION_NETWORK
        ) {
            this.props.history.push({
                pathname: '/dashboard/networks',
                state: {},
            });
        } else {
            this.props.history.push({
                pathname: 'dashboard/account',
                state: {},
            });
        }
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

    render() {
        return (
            <LoadingOverlay
                active={this.props.loader.isLoading}
                spinner
                text="Loading...">
                <div className="production-terms bg-ghost-white container-fluid">
                    <div className="row">
                        <div className="col-11 offset-1 px-0">
                            <div className="back-btn ">
                                {this.props.cnr.currentStep ===
                                actionTypes.UPGRADE_TO_PRODUCTION_NETWORK ? (
                                    <Link
                                        to={{
                                            pathname: '/dashboard/networks',
                                            state: {
                                                type: 'UAT',
                                            },
                                        }}
                                        className="solo-link link-secondary box--flex center--y">
                                        <i className="mdi mdi-chevron-left"></i>
                                        back
                                    </Link>
                                ) : (
                                    <Link
                                        to={{
                                            pathname: '/dashboard/account',
                                            state: {
                                                type: 'UAT',
                                            },
                                        }}
                                        className="solo-link link-secondary box--flex center--y">
                                        <i className="mdi mdi-chevron-left"></i>
                                        back
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="production-terms__container col-6 offset-1 bg-white">
                            <h1 className="text-center h3">
                                Sign Production Terms of Use Agreement
                            </h1>
                            {/* <p className="subtitle text-center">
                                Send Terms of Use Agreement to Authorised
                                Assigner
                            </p> */}
                            <div className="h-splitter"></div>
                            <p className="px-15 text-center">
                                Enter the email of the authorised signatory from
                                your company. They will receive a login link and
                                have the option to sign this agreement.
                            </p>

                            <form className="box box--flex--column">
                                {/* SignerMail EMAIL */}
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
                                        <span>authorised signatory email</span>
                                    </label>
                                </div>
                                <div className="form-group">
                                    {/* <Tooltip message="You must have authority to sign on behalf of the legal entity which you are registering. If you’re not sure, check with your legal team. If you don’t have authority, stop this process and ask your authorised signatory to re-start this onboarding process."> */}
                                    <label
                                        htmlFor="signerNames"
                                        className="has-float-label">
                                        <input
                                            name="signerNames"
                                            type="text"
                                            id="signerNames"
                                            placeholder=" "
                                            className="form-control"
                                            // value={this.state.signerNames}
                                            onChange={(e) => {
                                                this.handleNamesChange(e);
                                            }}
                                            onBlur={(e) => {
                                                this.handleNamesBlur(e);
                                            }}
                                        />
                                        <span>
                                            authorised signatory first and last
                                            name
                                        </span>
                                    </label>
                                    {/* </Tooltip> */}
                                </div>
                            </form>

                            <div className="terms">
                                <div className="terms__wrapper">
                                    <ReactMarkdown
                                        source={this.state.termsText}
                                    />
                                </div>
                            </div>

                            {/* ACTION BUTTONS */}
                            <div className="box box--flex center--XxX actions">
                                <div>
                                    {this.props.cnr.currentStep ===
                                    actionTypes.UPGRADE_TO_PRODUCTION_NETWORK ? (
                                        <Link
                                            to={{
                                                pathname: '/dashboard/networks',
                                                state: {
                                                    type: 'UAT',
                                                },
                                            }}
                                            className="btn btn-link btn-back m-0">
                                            cancel
                                        </Link>
                                    ) : (
                                        <Link
                                            to={{
                                                pathname: '/dashboard/account',
                                                state: {
                                                    type: 'UAT',
                                                },
                                            }}
                                            className="btn btn-link btn-back m-0">
                                            cancel
                                        </Link>
                                    )}

                                    <a
                                        type="button"
                                        data-toggle="button"
                                        className="btn btn-secondary btn-ask m-0"
                                        onClick={() => this.askQuestion()}>
                                        Any Questions?
                                    </a>
                                </div>
                                <button
                                    type="button"
                                    data-toggle="button"
                                    aria-pressed="false"
                                    className="btn btn-primary btn-next m-0"
                                    onClick={() =>
                                        this.handleOpenSuccessfulySignedModal()
                                    }
                                    disabled={!this.isFormValid()}>
                                    sign
                                </button>
                            </div>
                        </div>
                        <div className="col-4 production-terms-description">
                            <div>
                                <i className="mdi mdi-alert-octagram-outline"></i>
                            </div>
                            <div className="production-terms-description__text">
                                This will send a non-commercial legal agreement,
                                aimed to clarify the services provided by the
                                Foundation to participants and under what terms,
                                as well as guide behaviour on Corda Network. If
                                you have any questions, check out the{' '}
                                <a href="">FAQ</a> or contact us on{' '}
                                <a href="">Slack</a> - please join
                                #corda-network
                            </div>
                        </div>
                        <Modal
                            ariaHideApp={false}
                            isOpen={this.state.showFeedbackModal}
                            contentLabel="onRequestClose Example"
                            onRequestClose={() =>
                                this.handleCloseFeedbackModal()
                            }
                            className="Modal Modal__feedback Modal__feedback--tou"
                            overlayClassName="Overlay Overlay__feedback">
                            <h1 className="text-center h3">Send Feedback</h1>
                            <div className="h-splitter"></div>
                            <p className="text-center">
                                If you have any questions or comments regarding
                                this Terms of Use agreement, send us a message
                                here at{' '}
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
                                    onClick={() =>
                                        this.handleCloseFeedbackModal()
                                    }>
                                    Cancel
                                </button>
                            </div>
                            <i
                                onClick={() => this.handleCloseFeedbackModal()}
                                className="mdi mdi-close"></i>
                        </Modal>
                        <Modal
                            ariaHideApp={false}
                            isOpen={this.state.showSuccessfullySignedModal}
                            contentLabel="onRequestClose Example"
                            onRequestClose={() =>
                                this.handleCloseSuccessfulySignedModal()
                            }
                            className="Modal Modal__terms-signed"
                            overlayClassName="Overlay Overlay__feedback">
                            <h1 className="text-center h3">
                                Terms of Use Agreement Invitation Successfully
                                Sent
                            </h1>
                            <div className="h-splitter"></div>
                            <p className="text-center">
                                Thank you for the invite for signing the Terms
                                of Use agreement. You should be able to join
                                production network once signed. If you have any
                                questions, please contact us at:{' '}
                                <a
                                    href={
                                        'mailto:info@corda.network?subject=Production terms signing feedback'
                                    }>
                                    info@corda.network
                                </a>
                                .
                            </p>
                            <div className="box box--flex center--x actions">
                                <button
                                    type="button"
                                    data-toggle="button"
                                    aria-pressed="false"
                                    className="btn btn-primary btn-next m-0"
                                    onClick={() =>
                                        this.handleCloseSuccessfulySignedModal()
                                    }>
                                    back to dashboard
                                </button>
                            </div>
                            <i
                                onClick={() =>
                                    this.handleCloseSuccessfulySignedModal()
                                }
                                className="mdi mdi-close"></i>
                        </Modal>
                    </div>
                </div>
            </LoadingOverlay>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        ler: state.ler.legalEntity,
        ptr: state.ptr,
        loader: state.loader,
        cnr: state.cnr,
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
        onSetParticipantType: (type) =>
            dispatch({
                type: actionTypes.SET_PARTICIPANT_TYPE,
                participantType: type,
            }),
        onClearUserAuthorization: () =>
            dispatch({
                type: actionTypes.REMOVE_USER_AUTHORIZATION,
            }),
        onRemoveUserRole: () =>
            dispatch({
                type: actionTypes.REMOVE_USER_ROLE,
            }),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductionTerms);
