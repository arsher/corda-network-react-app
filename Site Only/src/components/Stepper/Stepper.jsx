import React from 'react';
import { Link } from 'react-router-dom';
import './Stepper.scss';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions';

class Stepper extends React.Component {
    handleBackToParticipantType() {
        if (
            this.props.currentStep ===
                actionTypes.CURRENT_STEP_SELECT_PARTICIPANT_TYPE ||
            this.props.currentStep ===
                actionTypes.CURRENT_STEP_CONFIRM_PARTICIPANT_TYPE ||
            this.props.currentStep ===
                actionTypes.CURRENT_STEP_SELECT_LEGAL_ENTITY ||
            this.props.currentStep ===
                actionTypes.CURRENT_STEP_CONFIRM_LEGAL_ENTITY ||
            this.props.currentStep ===
                actionTypes.CURRENT_STEP_ENTER_BILLING_DETAILS ||
            this.props.currentStep ===
                actionTypes.CURRENT_STEP_CONFIRM_BILLING_DETAILS
        ) {
            this.props.onBackToParticipantType();
        }
    }

    render() {
        let currentStep = this.props.currentStep;

        function determineClasses(step, optionalSecondStep = step) {
            let stepList = [
                actionTypes.CURRENT_STEP_SELECT_PARTICIPANT_TYPE,
                actionTypes.CURRENT_STEP_CONFIRM_PARTICIPANT_TYPE,
                actionTypes.CURRENT_STEP_SELECT_LEGAL_ENTITY,
                actionTypes.CURRENT_STEP_CONFIRM_LEGAL_ENTITY,
                actionTypes.CURRENT_STEP_ENTER_BILLING_DETAILS,
                actionTypes.CURRENT_STEP_CONFIRM_BILLING_DETAILS,
                actionTypes.CURRENT_STEP_SIGN_TERMS,
                actionTypes.CURRENT_STEP_CONFIRM_SIGN_TERMS,
                actionTypes.CURRENT_STEP_IDENTITY_CHECKS,
            ];
            let classString = 'step';
            if (
                stepList.indexOf(optionalSecondStep) <
                stepList.indexOf(currentStep)
            ) {
                classString += ' passed';
            } else if (
                currentStep === step ||
                currentStep === optionalSecondStep
            ) {
                classString += ' active';
            }
            return classString;
        }

        return (
            <div className="stepper">
                <div className="steps">
                    <div
                        className={determineClasses(
                            actionTypes.CURRENT_STEP_SELECT_PARTICIPANT_TYPE,
                            actionTypes.CURRENT_STEP_CONFIRM_PARTICIPANT_TYPE
                        )}>
                        <div
                            className="step-label standard-label"
                            onClick={() => this.handleBackToParticipantType()}>
                            {/* <span className="circle mdi mdi-radiobox-marked"></span> */}
                            Select participant type
                        </div>
                        <div className="step-info fs-13">
                            <p>
                                You may join Corda Network in one of two ways:
                            </p>
                            <p>
                                1. Directly: either you (and your node) may join
                                the Network directly, or{' '}
                            </p>
                            <p>
                                2. As a Sponsor: Sponsors can join the network
                                (they don’t have to run a node, but may). Once
                                joined, they can sponsor other nodes onto the
                                network{' '}
                            </p>
                        </div>
                    </div>
                    <div
                        className={determineClasses(
                            actionTypes.CURRENT_STEP_SELECT_LEGAL_ENTITY,
                            actionTypes.CURRENT_STEP_CONFIRM_LEGAL_ENTITY
                        )}>
                        <div className="step-label standard-label">
                            {/* <span className="circle mdi mdi-radiobox-blank"></span> */}
                            Confirm Legal Entity name
                        </div>
                        <div className="step-info fs-13">
                            <p>
                                It’s important to pick the correct{' '}
                                <Link to="/participation/legalentity">
                                    legal entity
                                </Link>{' '}
                                for your Corda Network identity (and not a
                                similar-sounding company). This will also be
                                used in the node X500 name, will be visible in
                                the network map - as well as in the legal
                                agreement for being a member of Corda Network.{' '}
                            </p>
                        </div>
                    </div>
                    <div
                        className={determineClasses(
                            actionTypes.CURRENT_STEP_ENTER_BILLING_DETAILS,
                            actionTypes.CURRENT_STEP_CONFIRM_BILLING_DETAILS
                        )}>
                        <div className="step-label standard-label">
                            {/* <span className="circle mdi mdi-radiobox-blank"></span> */}
                            Enter billing details
                        </div>
                        <div className="step-info fs-13">
                            <p>
                                There are two fees for using Corda Network which
                                we need to collect billing information for.
                                Invoices will be sent on a quarterly basis to
                                the email address provided and may be revised
                                depending on usage.{' '}
                                <Link to="/participation/membership-tiers">
                                    Learn about our fees.
                                </Link>
                            </p>
                        </div>
                    </div>
                    <div
                        className={determineClasses(
                            actionTypes.CURRENT_STEP_SIGN_TERMS,
                            actionTypes.CURRENT_STEP_CONFIRM_SIGN_TERMS
                        )}>
                        {this.props.csr.currentStep ===
                            actionTypes.CURRENT_STEP_IDENTITY_CHECKS && (
                            <div className="step-label standard-label sign-terms-label-completed">
                                {/* <span className="circle mdi mdi-radiobox-blank"></span> */}
                                Sign Terms Of use agreement
                            </div>
                        )}
                        {this.props.csr.currentStep !==
                            actionTypes.CURRENT_STEP_IDENTITY_CHECKS && (
                            <div className="step-label standard-label sign-terms-label">
                                {/* <span className="circle mdi mdi-radiobox-blank"></span> */}
                                Sign Terms Of use agreement
                            </div>
                        )}

                        <div className="step-info fs-13">
                            <p>
                                This is a non-commercial legal agreement, aimed
                                to clarify the services provided by the
                                Foundation to participants and under what terms,
                                as well as guide behaviour on Corda Network. If
                                you have any questions, check out the{' '}
                                <a href="">FAQ</a> or contact us on{' '}
                                <a
                                    href="https://cordaledger.slack.com"
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    Slack
                                </a>{' '}
                                - please join #corda-network{' '}
                            </p>
                        </div>
                    </div>
                    <div
                        className={determineClasses(
                            actionTypes.CURRENT_STEP_IDENTITY_CHECKS
                        )}>
                        <div
                            className={
                                this.props.identityCheckStatus === 'PENDING'
                                    ? 'step-label standard-label identity-checks--failed'
                                    : 'step-label standard-label identity-checks'
                            }>
                            {/* <span className="circle mdi mdi-progress-clock"></span> */}
                            Identity Checks
                        </div>
                        {/* <div className="step-info fs-13"></div> */}
                    </div>
                    {/* <div className="step">
                        <div className="step-label standard-label">
                            <span className="circle mdi mdi-radiobox-blank"></span>
                            Enter Node details
                        </div>
                        <div className="step-info fs-13">
                            <p>
                                Corda Network runs an X509 certificate
                                authority. For a node's <a href="">X509 name</a>
                                , there are 6 fields. 3 are mandatory fields:
                                Organisation (O), Locality (L), Country (C); and
                                3 additional fields you may fill out:
                                Organisation Unit (OU), State (S), and Common
                                Name (CN) for every node you wish to onboard.
                            </p>
                        </div>
                    </div> */}
                </div>
                <div className="info box--flex pt-25">
                    <i className="mdi mdi-content-save-outline"></i>
                    <p className="fs-13">
                        Your progress is saved. Feel free to exit and come back
                        to your onboarding at any time. If you have questions,
                        please email{' '}
                        <a href="mailto:info@corda.network">
                            info@corda.network
                        </a>
                    </p>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        csr: state.csr,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onBackToParticipantType: () =>
            dispatch({
                type: actionTypes.CURRENT_STEP_SELECT_PARTICIPANT_TYPE,
            }),
        onBackToConfirmLegalEntity: () =>
            dispatch({
                type: actionTypes.CURRENT_STEP_SELECT_LEGAL_ENTITY,
            }),
        onBackToTerms: () =>
            dispatch({
                type: actionTypes.CURRENT_STEP_SIGN_TERMS,
            }),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Stepper);
