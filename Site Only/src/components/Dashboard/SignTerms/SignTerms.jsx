import React, { Component } from 'react';
import './SignTerms.scss';
import LoadingOverlay from 'react-loading-overlay';
import * as actionTypes from '../../../store/actions';
import { connect } from 'react-redux';
import {
    axiosSignatureRequestsGET,
    axiosOnboardingTermsGET,
    axiosParticipantPrimaryGET,
} from '../../../axios/axios';
import { handleApiError } from '../../../utils/utils';
import 'firebase/app';
import 'firebase/auth';
import 'react-toastify/dist/ReactToastify.css';
import Terms from '../../Onboarding/TermsOfUse/Terms/Terms';
import base64 from 'base-64';
import { decode_utf8 } from '../../../utils/utils';
import ConfirmTermsOfUse from '../../Onboarding/TermsOfUse/ConfirmTermsOfUse/ConfirmTermsOfUse';
import Modal from 'react-modal';
import { determineTextareaClasses } from '../../../helpers/determineSelectClasses';
import Aux from '../../../hoc/Auxillary/Auxillary';
import { Link } from 'react-router-dom';
import { deleteCookie } from '../../../helpers/authorizationService';
import {
    VALID_NAMES_REGEX,
    VALID_MAIL_REGEX,
    SPECIAL_CHARS_REGEX,
} from '../../../utils/constant';

class SignTerms extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            awaitingSigning: false,
            alreadySigned: false,
            legalEntity: '',
            names: '',
            isNamesValid: false,
            jobTitle: '',
            isJobTitleValid: false,
            workMail: '',
            isWorkMailValid: true,
            isAgreementCheckboxChecked: false,
            isAuthorizedCheckboxChecked: false,
            productionType: '',
            agreementId: '',
            termsText: '',
            isReadyToConfirm: false,
            showFeedbackModal: false,
            feedbackMail: '',
            isValidFeedbackMail: false,
            message: '',
            noCurrentInvites: false,
        };
    }

    componentDidMount() {
        axiosSignatureRequestsGET()
            .then((response) => {
                if (response.data.length > 0) {
                    let productionType;
                    response.data[0].agreementContext === 'CORDANETWORK'
                        ? (productionType = 'production')
                        : (productionType = 'preproduction');

                    let participantType;
                    response.data[0].agreementName === 'tou'
                        ? (participantType = 'direct')
                        : (participantType = 'sponsor');

                    this.setState({
                        signatureRequestId: response.data[0].id,
                        workMail: response.data[0].assignee.email,
                    });
                    axiosOnboardingTermsGET(productionType, participantType)
                        .then((response) => {
                            this.stopLoader();
                            this.setState({
                                awaitingSigning: true,
                                alreadySigned: false,
                                productionType: response.data.context,
                                agreementId: response.data.id,
                                termsText: decode_utf8(
                                    base64
                                        .decode(response.data.content)
                                        .replace(/<u>/g, '_')
                                        .replace(/<\/u>/g, '_')
                                        .replace(/[\u0080-\uffff]/g, '')
                                ),
                            });
                        })
                        .catch((err) => {
                            handleApiError(err);
                        });
                } else {
                    this.stopLoader();
                    this.setState({
                        awaitingSigning: false,
                        alreadySigned: true,
                        noCurrentInvites: true,
                    });
                }
            })
            .then(() => {
                axiosParticipantPrimaryGET()
                    .then((response) => {
                        this.props.onSetLegalEntity(response.data);
                        this.props.onSetParticipantType(response.data.type);
                    })
                    .catch((err) => {
                        handleApiError(err);
                    });
            })
            .catch((err) => {
                handleApiError(err);
                this.stopLoader();
            });
    }

    // NAMES
    handleTermsNamesChange(event) {
        this.setState({
            names: event.target.value,
            isNamesValid: this.validateNames(event.target.value),
        });
    }

    handleTermsNamesBlur(event) {
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

    // JOB
    handleTermsJobChange(event) {
        this.setState({
            jobTitle: event.target.value,
            isJobTitleValid: this.validateJob(event.target.value),
        });
    }

    handleTermsJobBlur(event) {
        this.validateJob(event.target.value)
            ? (event.target.className = 'form-control is-valid')
            : (event.target.className = 'form-control is-invalid');
    }

    validateJob(job) {
        if (!this.validateSpecialCharacters(job)) {
            return false;
        }
        return true;
    }

    // MAIL
    handleTermsMailChange(event) {
        this.setState({
            workMail: event.target.value,
            isWorkMailValid: this.validateMail(event.target.value),
        });
    }

    handleTermsMailBlur(event) {
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

    // CHECKBOX
    handleCheckboxChange(event) {
        this.setState({
            isAgreementCheckboxChecked: event.target.checked,
        });
    }

    // CHECKBOX
    handleCheckboxChange2(event) {
        this.setState({
            isAuthorizedCheckboxChecked: event.target.checked,
        });
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
            this.state.isNamesValid &&
            this.state.isJobTitleValid &&
            this.state.isWorkMailValid &&
            this.state.isAgreementCheckboxChecked &&
            this.state.isAuthorizedCheckboxChecked
        );
    }

    handleSubmitAction() {
        const payload = {
            firstName: this.state.names.split(' ')[0],
            lastName: this.state.names.split(' ')[1],
            email: this.state.workMail,
            workTitle: this.state.jobTitle,
            // phoneNumber: 'phoneNumber',
            termsId: this.state.agreementId,
            networkType: this.state.productionType,
        };
        this.props.onSetCurrentTerm(payload);
        this.setState({
            isReadyToConfirm: true,
        });
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

    backToPreview() {
        this.setState({
            awaitingSigning: true,
            isReadyToConfirm: false,
        });
    }

    backAfterConfirm() {
        this.setState({
            alreadySigned: true,
        });
    }

    startLoader() {
        this.setState({
            loading: true,
        });
    }

    stopLoader() {
        this.setState({
            loading: false,
        });
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
            awaitingSigning,
            alreadySigned,
            isReadyToConfirm,
            noCurrentInvites,
        } = this.state;
        return (
            <LoadingOverlay active={this.state.loading} spinner text="">
                <div className="row sign-terms-back">
                    <div className="col-11 offset-1 px-0">
                        <div className="back-btn ">
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
                        </div>
                    </div>
                </div>

                <div className="sign-terms">
                    <div className="row">
                        {/* TERMS BOX AND FORM */}
                        {awaitingSigning &&
                            !isReadyToConfirm &&
                            !alreadySigned && (
                                <div className="col-6 offset-1 sign-terms-form bg-white">
                                    {/* FORM FIELDS */}
                                    <h1 className="text-center h3">
                                        Sign Terms of Use Agreement
                                    </h1>

                                    <Terms text={this.state.termsText} />

                                    <form className="box box--flex--column">
                                        <div className="form-group">
                                            <label
                                                htmlFor="legalEntity"
                                                className="has-float-label">
                                                <input
                                                    name="legalEntity"
                                                    type="text"
                                                    id="legalEntity"
                                                    placeholder=" "
                                                    value={this.props.ler.name}
                                                    disabled={true}
                                                    className="form-control entity-name"
                                                />
                                                <span>Legal Entity name</span>
                                            </label>
                                        </div>
                                        {/* <div className="legal-entity-more">
                                                This legal entity name has been
                                                pre-filled from the previous step.
                                                If you need to change this, please
                                                go back a step.
                                            </div> */}
                                        <div className="form-group">
                                            <label
                                                htmlFor="workMail"
                                                className="has-float-label">
                                                <input
                                                    name="workMail"
                                                    type="text"
                                                    id="workMail"
                                                    placeholder=" "
                                                    disabled={true}
                                                    value={this.state.workMail}
                                                    className="form-control"
                                                    onChange={(e) => {
                                                        this.handleTermsMailChange(
                                                            e
                                                        );
                                                    }}
                                                    onBlur={(e) => {
                                                        this.handleTermsMailBlur(
                                                            e
                                                        );
                                                    }}
                                                />
                                                <span>work email</span>
                                            </label>
                                        </div>
                                        <div className="form-group">
                                            {/* <Tooltip message="You must have authority to sign on behalf of the legal entity which you are registering. If you’re not sure, check with your legal team. If you don’t have authority, stop this process and ask your authorised signatory to re-start this onboarding process."> */}
                                            <label
                                                htmlFor="names"
                                                className="has-float-label">
                                                <input
                                                    name="names"
                                                    type="text"
                                                    id="names"
                                                    placeholder=" "
                                                    className="form-control"
                                                    value={this.state.names}
                                                    onChange={(e) => {
                                                        this.handleTermsNamesChange(
                                                            e
                                                        );
                                                    }}
                                                    onBlur={(e) => {
                                                        this.handleTermsNamesBlur(
                                                            e
                                                        );
                                                    }}
                                                />
                                                <span>First and Last Name</span>
                                            </label>
                                            {/* </Tooltip> */}
                                        </div>
                                        <div className="form-group">
                                            <label
                                                htmlFor="jobTitle"
                                                className="has-float-label">
                                                <input
                                                    name="jobTitle"
                                                    type="text"
                                                    id="jobTitle"
                                                    placeholder=" "
                                                    className="form-control"
                                                    value={this.state.jobTitle}
                                                    onChange={(e) => {
                                                        this.handleTermsJobChange(
                                                            e
                                                        );
                                                    }}
                                                    onBlur={(e) => {
                                                        this.handleTermsJobBlur(
                                                            e
                                                        );
                                                    }}
                                                />
                                                <span>Job title</span>
                                            </label>
                                        </div>

                                        <div className="form-group">
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    value=""
                                                    id="defaultCheck1"
                                                    onChange={(e) => {
                                                        this.handleCheckboxChange(
                                                            e
                                                        );
                                                    }}
                                                />
                                                <label
                                                    className="form-check-label"
                                                    htmlFor="defaultCheck1">
                                                    I acknowledge that I have
                                                    read and agree to the above
                                                    Terms of Use.
                                                </label>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    value=""
                                                    id="defaultCheck2"
                                                    onChange={(e) => {
                                                        this.handleCheckboxChange2(
                                                            e
                                                        );
                                                    }}
                                                />
                                                <label
                                                    className="form-check-label"
                                                    htmlFor="defaultCheck2">
                                                    I acknowledge that I am an
                                                    authorised signatory on
                                                    behalf of this legal entity.
                                                </label>
                                            </div>
                                        </div>
                                    </form>

                                    <div className="h-splitter"></div>

                                    {/* ACTION BUTTONS */}
                                    <div className="box box--flex center--XxX actions">
                                        <div>
                                            <button
                                                type="button"
                                                data-toggle="button"
                                                aria-pressed="false"
                                                className="btn btn-secondary btn-back m-0"
                                                // disabled={!isProductionTypeSelected}
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
                                            onClick={() =>
                                                this.handleSubmitAction()
                                            }>
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            )}
                        {/* CONFIRM SINING STEP */}
                        {awaitingSigning && isReadyToConfirm && !alreadySigned && (
                            <div className="col-6 offset-1 sign-terms-form bg-white">
                                <ConfirmTermsOfUse
                                    onBackToPreview={() => this.backToPreview()}
                                    backAfterConfirm={() =>
                                        this.backAfterConfirm()
                                    }
                                    signatureRequestId={
                                        this.state.signatureRequestId
                                    }
                                    startLoader={() => this.startLoader()}
                                    stopLoader={() => this.stopLoader()}
                                />
                            </div>
                        )}
                        {/* TERMS SIGNED SCREEN */}
                        {alreadySigned && (
                            <div className="col-6 offset-1 sign-terms-completed bg-white box--flex--column center--x center--y">
                                {!noCurrentInvites && (
                                    <Aux>
                                        <i className="mdi mdi-checkbox-marked-circle-outline"></i>
                                        <p className="subtitle">
                                            Terms of use signed.
                                        </p>
                                        <div className="h-splitter"></div>
                                        <div className="text-center mx-30 my-10 text-black-coral">
                                            You have successfuly accepted and
                                            signed <b>{this.props.ler.name}</b>
                                            's invitation to sign their terms of
                                            use agreement of use.
                                        </div>
                                        <div className="h-splitter"></div>
                                    </Aux>
                                )}
                                {noCurrentInvites && (
                                    <Aux>
                                        <i className="mdi mdi-alert-circle-outline"></i>
                                        <p className="subtitle">
                                            No current invites to sign terms of
                                            use.
                                        </p>
                                        <div className="h-splitter"></div>
                                        <div className="text-center mx-30 my-10 text-black-coral">
                                            You don't have any ongoing invites
                                            from <b>{this.props.ler.name}</b> to
                                            sign their terms of use agreement of
                                            use.
                                        </div>
                                        <div className="h-splitter"></div>
                                    </Aux>
                                )}
                                <div className="box--flex center--xXx">
                                    <Link
                                        to="/login"
                                        className="solo-link m-0"
                                        onClick={() => this.logout()}>
                                        Log Out
                                    </Link>
                                </div>
                            </div>
                        )}
                        {/* RIGHT SIDE TEXT */}
                        {awaitingSigning && !alreadySigned && (
                            <div className="col-4 sign-terms-description">
                                <div>
                                    <i className="mdi mdi-alert-octagram-outline"></i>
                                </div>
                                <div className="sign-terms-description__text">
                                    This will send a non-commercial legal
                                    agreement, aimed to clarify the services
                                    provided by the Foundation to participants
                                    and under what terms, as well as guide
                                    behaviour on Corda Network. If you have any
                                    questions, check out the <a href="">FAQ</a>{' '}
                                    or contact us on <a href="">Slack</a> -
                                    please join #corda-network
                                </div>
                            </div>
                        )}
                        {/* RIGHT SIDE TEXT */}
                        {alreadySigned && (
                            <div className="col-4 sign-terms-description">
                                <div>
                                    <i className="mdi mdi-alert-octagram-outline"></i>
                                </div>
                                <div className="sign-terms-description__text">
                                    This will send a non-commercial legal
                                    agreement, aimed to clarify the services
                                    provided by the Foundation to participants
                                    and under what terms, as well as guide
                                    behaviour on Corda Network. If you have any
                                    questions, check out the <a href="">FAQ</a>{' '}
                                    or contact us on <a href="">Slack</a> -
                                    please join #corda-network
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <Modal
                    ariaHideApp={false}
                    isOpen={this.state.showFeedbackModal}
                    contentLabel="onRequestClose Example"
                    onRequestClose={() => this.handleCloseFeedbackModal()}
                    className="Modal Modal__feedback"
                    overlayClassName="Overlay Overlay__feedback">
                    <h1 className="text-center h3">Send Feedback</h1>
                    <div className="h-splitter"></div>
                    <p className="text-center">
                        If you have any questions or comments regarding this
                        Terms of Use agreement, send us a message here and we’ll
                        get back to you.
                    </p>
                    <form className="box box--flex--column">
                        <div className="form-group">
                            <label
                                htmlFor="feedbackMail"
                                className="has-float-label">
                                <input
                                    name="feedbackMail"
                                    type="text"
                                    id="feedbackMail"
                                    placeholder=" "
                                    className="form-control"
                                    onChange={(e) => {
                                        this.handleFeedbackMailChange(e);
                                    }}
                                    onBlur={(e) => {
                                        this.handleFeedbackMailBlur(e);
                                    }}
                                />
                                <span>email</span>
                            </label>
                        </div>
                        <div className="form-group">
                            <label
                                className="has-float-label"
                                htmlFor="message">
                                <textarea
                                    id="message"
                                    name="message"
                                    className={determineTextareaClasses(
                                        this.state.message
                                    )}
                                    rows={3}
                                    placeholder=" "
                                    value={this.state.message}
                                    onChange={(e) => {
                                        this.handleFeedBackMessageTextChange(e);
                                    }}></textarea>
                                <span>Your Message</span>
                            </label>
                        </div>
                    </form>
                    <div className="box box--flex center--XxX actions">
                        <button
                            type="button"
                            data-toggle="button"
                            aria-pressed="false"
                            className="btn btn-link btn-back m-0"
                            onClick={() => this.handleCloseFeedbackModal()}>
                            Cancel
                        </button>
                        <a
                            href={
                                'mailto:info@corda.network?subject=Onboarding terms of use feedback&body=' +
                                this.state.message
                            }
                            type="button"
                            data-toggle="button"
                            className="btn btn-primary btn-next m-0"
                            // disabled={!this.state.isValidFeedbackMail}
                            onClick={() => this.handleCloseFeedbackModal()}>
                            Send
                        </a>
                    </div>
                    <i
                        onClick={() => this.handleCloseFeedbackModal()}
                        className="mdi mdi-close"></i>
                </Modal>
            </LoadingOverlay>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        uar: state.uar,
        upr: state.upr,
        loader: state.loader,
        ler: state.ler.legalEntity,
        ptr: state.ptr.participantType,
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
        onSetLegalEntity: (legalEntity) =>
            dispatch({
                type: actionTypes.SET_LEGAL_ENTITY,
                legalEntity: legalEntity,
            }),

        onSetParticipantType: (type) =>
            dispatch({
                type: actionTypes.SET_PARTICIPANT_TYPE,
                participantType: type,
            }),
        onSetAuthorizationToken: (token) =>
            dispatch({
                type: actionTypes.SET_USER_AUTHORIZATION,
                authorizationToken: token,
            }),
        onSetUserProfile: (role) =>
            dispatch({
                type: actionTypes.SET_USER_ROLE,
                role: role,
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
        onSetUserData: (names, email) =>
            dispatch({
                type: actionTypes.SET_USER_PROFILE,
                names: names,
                email: email,
            }),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignTerms);
