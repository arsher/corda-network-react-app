import React, { Component, Fragment } from 'react';
import './CreateNodeConfig.scss';
import Tooltip from '../Tooltip/Tooltip';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions';
import { createNodeConfigPUT, createSponsееNodePUT } from '../../axios/axios';
import { handleApiError } from '../../utils/utils';
import { VALID_MAIL_REGEX, SPECIAL_CHARS_REGEX } from '../../utils/constant';
import { toast } from 'react-toastify';

class CreateNodeConfig extends Component {
    constructor(props) {
        super(props);

        this.state = {
            productionTypes: ['UAT', 'CORDANETWORK'],
            selectedType: '',
            isTypeSelected: false,
            organisationUnit: '',
            isOrganisationUnitValid: false,
            commonName: '',
            isCommonNameValid: true,
            state: '',
            isStateValid: true,
            nodeOperatorEmail: '',
            backupOperatorEmail: '',
            isEmailValid: false,
            isBackupEmailValid: false,
        };
    }

    // ORGANISATION UNIT
    handleOrganisationUnitChange(event) {
        this.setState({
            organisationUnit: event.target.value,
            isOrganisationUnitValid: this.validateOrganisationUnit(
                event.target.value
            ),
        });
    }

    handleOrganisationUnitBlur(event) {
        this.validateOrganisationUnit(event.target.value)
            ? (event.target.className = 'form-control is-valid')
            : (event.target.className = 'form-control is-invalid');
    }

    validateOrganisationUnit(organisationUnit) {
        if (!this.validateSpecialCharacters(organisationUnit)) {
            return false;
        }
        return true;
    }

    // COMMON NAME
    handleCommonNameChange(event) {
        this.setState({
            commonName: event.target.value,
            isCommonNameValid: this.validateCommonName(event.target.value),
        });
    }

    handleCommonNameBlur(event) {
        this.validateCommonName(event.target.value)
            ? (event.target.className = 'form-control is-valid')
            : (event.target.className = 'form-control is-invalid');
    }

    validateCommonName(commonName) {
        if (!this.validateSpecialCharacters(commonName)) {
            return false;
        } else if (commonName.length === 0) {
            return true;
        }
        return true;
    }

    // STATE
    handleStateChange(event) {
        this.setState({
            state: event.target.value,
            isStateValid: this.validateState(event.target.value),
        });
    }

    handleStateBlur(event) {
        this.validateState(event.target.value)
            ? (event.target.className = 'form-control is-valid')
            : (event.target.className = 'form-control is-invalid');
    }

    validateState(state) {
        if (!this.validateSpecialCharacters(state)) {
            return false;
        } else if (state.length === 0) {
            return true;
        }
        return true;
    }

    // NODE OPRATOR MAIL
    handleMailChange(event) {
        this.setState({
            nodeOperatorEmail: event.target.value,
            isEmailValid: this.validateMail(event.target.value),
        });
    }

    handleBackupMailChange(event) {
        this.setState({
            backupOperatorEmail: event.target.value,
            isBackupEmailValid: this.validateMail(event.target.value),
        });
    }

    handleMailBlur(event) {
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
        if (
            this.props.cnr.currentStep ===
            actionTypes.CURRENT_STEP_START_NODE_CREATION
        ) {
            return (
                this.state.isTypeSelected &&
                this.state.isOrganisationUnitValid &&
                this.state.isEmailValid &&
                this.state.isBackupEmailValid
            );
        } else {
            return (
                this.state.isOrganisationUnitValid &&
                this.state.isEmailValid &&
                this.state.isBackupEmailValid
                // && this.state.isStateValid &&
                // this.state.isEmailValid
            );
        }
    }

    getSelectedSponsee() {
        const sponsored = this.props.ler.sponsored;
        const selectedSponsee = sponsored.find(
            (sponsee) =>
                sponsee.id ===
                this.props.sponsorCurrentStepReducer.participantId
        );
        return selectedSponsee;
    }

    determineLegalEntityReducer() {
        let legalEntityReducer;
        if (
            this.props.sponsorCurrentStepReducer.currentStep ===
            actionTypes.CREATE_SPONSEE_NODE_CONFIG
        ) {
            legalEntityReducer = this.getSelectedSponsee();
        } else {
            legalEntityReducer = this.props.ler;
        }
        return legalEntityReducer;
    }

    submitNodeConfig() {
        const payload = {
            email: this.state.nodeOperatorEmail,
            backupEmail: this.state.backupOperatorEmail,
            state: this.state.state,
            organizationalUnit: this.state.organisationUnit,
            commonName: this.state.commonName,
        };

        if (
            this.determineLegalEntityReducer().name.length +
                payload.organizationalUnit.length +
                this.determineLegalEntityReducer().address.addressCountry
                    .isoAlpha2Code.length +
                this.determineLegalEntityReducer().address.addressLocality.name
                    .length +
                payload.state.length +
                payload.commonName.length >
            128
        ) {
            toast(
                <div>
                    The max number of characters in the whole x500 name should
                    be 128 characters in total (including spaces).
                </div>,
                {
                    type: 'error',
                }
            );
        } else {
            if (
                this.props.sponsorCurrentStepReducer.currentStep ===
                actionTypes.CREATE_SPONSEE_NODE_CONFIG
            ) {
                createSponsееNodePUT(
                    this.getSelectedSponsee().id,
                    this.props.sponsorCurrentStepReducer.networkType,
                    payload
                )
                    .then((response) => {
                        this.props.onSubmitSponseeNodeConfig();
                    })
                    .catch((err) => {
                        handleApiError(err);
                    });
            } else {
                createNodeConfigPUT(this.state.selectedType, payload)
                    .then((response) => {
                        this.props.onSubmitNodeConfig(this.state.selectedType);
                    })
                    .catch((err) => {
                        handleApiError(err);
                    });
            }
        }
    }

    handleBackAction() {
        if (
            this.props.sponsorCurrentStepReducer.currentStep ===
            actionTypes.CREATE_SPONSEE_NODE_CONFIG
        ) {
            this.props.onBackSponsoredParticipants();
        } else {
            this.props.onBackCertificateDetails();
        }
    }

    handleChange(e) {
        this.setState({ selectedType: e.target.value, isTypeSelected: true });
    }

    render() {
        const options = this.state.productionTypes.map((type, key) => {
            const isCurrent = this.state.selectedType === type;
            return (
                <div
                    key={key}
                    className={
                        Object.keys(this.props.dnr[type.toLowerCase()]).length
                            ? 'network-type box--flex--column center--y disabled'
                            : 'network-type box--flex--column center--y'
                    }>
                    <label
                        className={
                            isCurrent
                                ? 'network-type-wrapper selected'
                                : 'network-type-wrapper'
                        }>
                        <input
                            className="radio"
                            type="radio"
                            name="productionTypes"
                            id={type}
                            value={type}
                            onChange={this.handleChange.bind(this)}
                            disabled={
                                Object.keys(this.props.dnr[type.toLowerCase()])
                                    .length
                            }
                        />
                        {type === 'UAT' ? (
                            <span className="standard-label">
                                pre-production
                            </span>
                        ) : (
                            <span className="standard-label">production</span>
                        )}
                    </label>
                </div>
            );
        });

        return (
            <div className="container-fluid create-node-config bg-ghost-white">
                <div className="row">
                    <div className="col-10 offset-1">
                        <div
                            className="back"
                            onClick={() => this.handleBackAction()}>
                            <i className="mdi mdi-chevron-left"></i>
                            <button className="btn btn-secondary btn-link">
                                Back
                            </button>
                        </div>
                    </div>
                    <div className="col-6 offset-1">
                        <div className="bg-white form">
                            <div className="form__wrapper">
                                <h1 className="text-center h3">
                                    {this.props.sponsorCurrentStepReducer
                                        .currentStep ===
                                    actionTypes.CREATE_SPONSEE_NODE_CONFIG ? (
                                        <span>
                                            Create the{' '}
                                            {this.props.cnr.networkType ===
                                                'UAT' ||
                                                (this.props
                                                    .sponsorCurrentStepReducer
                                                    .networkType === 'UAT' &&
                                                    'Pre-')}
                                            Production Node Config File
                                        </span>
                                    ) : (
                                        <span>Create a Node Config File</span>
                                    )}
                                </h1>
                                <div className="h-splitter"></div>

                                {this.props.sponsorCurrentStepReducer
                                    .currentStep !==
                                actionTypes.CREATE_SPONSEE_NODE_CONFIG ? (
                                    <Fragment>
                                        <div className="fields__wrapper">
                                            <div className="fields__header mb-25">
                                                Select network type
                                            </div>
                                            <div className="network-options box--flex center--XxX">
                                                {options}
                                            </div>
                                        </div>
                                        <div className="h-splitter"></div>
                                    </Fragment>
                                ) : null}

                                <div className="fields__wrapper">
                                    {/* ORGANISATION */}
                                    <div className="fields__header">
                                        prefilled fields
                                    </div>
                                    <div className="form-group organisation">
                                        <label
                                            htmlFor="organisation"
                                            className="has-float-label">
                                            <input
                                                name="organisation"
                                                type="text"
                                                id="organisation"
                                                placeholder=" "
                                                className="form-control"
                                                value={
                                                    this.determineLegalEntityReducer()
                                                        .name
                                                }
                                                disabled={true}
                                            />
                                            <span>organisation (o)</span>
                                        </label>
                                    </div>
                                    {/* LOCALITY */}
                                    <div className="form-group locality">
                                        <label
                                            htmlFor="locality"
                                            className="has-float-label">
                                            <input
                                                name="locality"
                                                type="text"
                                                id="locality"
                                                placeholder=" "
                                                className="form-control"
                                                value={
                                                    this.determineLegalEntityReducer()
                                                        .address.addressLocality
                                                        .name
                                                }
                                                disabled={true}
                                            />
                                            <span>locality (l)</span>
                                        </label>
                                    </div>
                                    {/* COUNTRY */}
                                    <div className="form-group country">
                                        <label
                                            htmlFor="country"
                                            className="has-float-label">
                                            <input
                                                name="country"
                                                type="text"
                                                id="country"
                                                placeholder=" "
                                                className="form-control"
                                                value={
                                                    this.determineLegalEntityReducer()
                                                        .address.addressCountry
                                                        .name
                                                }
                                                disabled={true}
                                            />
                                            <span>country (c)</span>
                                        </label>
                                    </div>

                                    <div className="info-box">
                                        The node's 3 mandatory fields have been
                                        pre-filled based on information you've
                                        provided previously in the onboarding
                                        process.
                                    </div>
                                </div>
                            </div>

                            <div className="h-splitter"></div>

                            <div className="form__wrapper">
                                <div className="fields__wrapper">
                                    <div className="fields__header">
                                        Mandatory fields
                                    </div>
                                    {/* ORGANISATION UNIT */}
                                    <div className="form-group organisation-unit">
                                        <Tooltip message="This field is generally used to denote sub-divisions or units of the organisation (legal entity). It may be used by node operators for internal purposes to separate nodes used for different purposes by the same legal entity.">
                                            <label
                                                htmlFor="organisation-unit"
                                                className="has-float-label with-tooltip">
                                                <input
                                                    name="organisation-unit"
                                                    type="text"
                                                    id="organisation-unit"
                                                    placeholder=" "
                                                    maxLength="64"
                                                    className="form-control"
                                                    onChange={(e) => {
                                                        this.handleOrganisationUnitChange(
                                                            e
                                                        );
                                                    }}
                                                    onBlur={(e) => {
                                                        this.handleOrganisationUnitBlur(
                                                            e
                                                        );
                                                    }}
                                                />
                                                <span>
                                                    organisation unit (ou)*
                                                </span>
                                            </label>
                                        </Tooltip>
                                    </div>
                                    {/* NODE OPERATOR MAIL */}
                                    <div className="form-group nodeOperatorEmail">
                                        <Tooltip message="The email address used should be an actively monitored mailbox. We will use this email address for all communications with the node, including those involved in identity verification. We recommend this is an ‘admin@’ or ‘info@’ generic email associated with the legal entity, to avoid key man risk. As part of this, we will also check that you have access to this email inbox.">
                                            <label
                                                htmlFor="nodeOperatorEmail"
                                                className="has-float-label with-tooltip">
                                                <input
                                                    name="nodeOperatorEmail"
                                                    type="text"
                                                    id="nodeOperatorEmail"
                                                    placeholder=" "
                                                    className="form-control"
                                                    onChange={(e) => {
                                                        this.handleMailChange(
                                                            e
                                                        );
                                                    }}
                                                    onBlur={(e) => {
                                                        this.handleMailBlur(e);
                                                    }}
                                                />
                                                <span>
                                                    node operator email address*
                                                </span>
                                            </label>
                                        </Tooltip>
                                    </div>
                                    <div className="form-group backup-email">
                                        <label
                                            htmlFor="backup-email"
                                            className="has-float-label">
                                            <input
                                                name="backup-email"
                                                type="text"
                                                id="backup-email"
                                                placeholder=" "
                                                className="form-control"
                                                onChange={(e) => {
                                                    this.handleBackupMailChange(
                                                        e
                                                    );
                                                }}
                                                onBlur={(e) => {
                                                    this.handleMailBlur(e);
                                                }}
                                            />
                                            <span>
                                                Backup operator email address
                                            </span>
                                        </label>
                                    </div>
                                    <div className="fields__header mt-30">
                                        Optional fields
                                    </div>
                                    {/* COMMON NAME */}
                                    <div className="form-group common-name">
                                        <Tooltip message="Available for use by the node operator for their own internal purposes.">
                                            <label
                                                htmlFor="common-name"
                                                className="has-float-label with-tooltip">
                                                <input
                                                    name="common-name"
                                                    type="text"
                                                    id="common-name"
                                                    placeholder=" "
                                                    maxLength="64"
                                                    className="form-control"
                                                    onChange={(e) => {
                                                        this.handleCommonNameChange(
                                                            e
                                                        );
                                                    }}
                                                    onBlur={(e) => {
                                                        this.handleCommonNameBlur(
                                                            e
                                                        );
                                                    }}
                                                />
                                                <span>common name (cn)</span>
                                            </label>
                                        </Tooltip>
                                    </div>
                                    {/* STATE */}
                                    <div className="form-group state">
                                        <Tooltip message="If your country operates a State or Province system (e.g. USA and Canada) please add the State in which the registered head-office of the legal entity is located. For example, if the company operates from New York but is registered in Delaware, please use Delaware">
                                            <label
                                                htmlFor="state"
                                                className="has-float-label with-tooltip">
                                                <input
                                                    name="state"
                                                    type="text"
                                                    id="state"
                                                    placeholder=" "
                                                    maxLength="64"
                                                    className="form-control"
                                                    onChange={(e) => {
                                                        this.handleStateChange(
                                                            e
                                                        );
                                                    }}
                                                    onBlur={(e) => {
                                                        this.handleStateBlur(e);
                                                    }}
                                                />
                                                <span>state (s)</span>
                                            </label>
                                        </Tooltip>
                                    </div>
                                    <div className="info-box">
                                        <div>
                                            At the end of this step, you will be
                                            able to download a node.conf file
                                            which will enable you to do the
                                            'Configure the Node' step.
                                        </div>
                                        <div>
                                            It will include your{' '}
                                            {/* eslint-disable-next-line */}
                                            <a href="">x500 name</a>. An example
                                            for a x500 name is:{' '}
                                            <span>
                                                O=Lewis Ins , L=London, C=GB,
                                                OU=Lewis Legal
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-splitter"></div>
                                <div className="box box--flex center--XxX actions">
                                    <button
                                        onClick={() => this.handleBackAction()}
                                        type="button"
                                        data-toggle="button"
                                        aria-pressed="false"
                                        className="btn btn-link btn-back m-0">
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        data-toggle="button"
                                        aria-pressed="false"
                                        className="btn btn-primary btn-next m-0"
                                        onClick={() => this.submitNodeConfig()}
                                        disabled={!this.isFormValid()}>
                                        Download config file
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-4 info">
                        <div>
                            <i className="mdi mdi-alert-octagram-outline"></i>
                        </div>
                        <div className="info__text">
                            Corda Network runs an X509 certificate authority.
                            {/* eslint-disable-next-line */}
                            For a node's <a href="">X509 name</a>, there are 6
                            fields. 3 are mandatory fields: Organisation (O),
                            Locality (L), Country (C); and 3 additional fields
                            you may fill out: Organisation Unit (OU), State (S),
                            and Common Name (CN) for every node you wish to
                            onboard.
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
        loader: state.loader,
        csr: state.csr,
        uar: state.uar,
        cnr: state.cnr,
        ptr: state.ptr,
        upr: state.upr,
        dnr: state.dnr,
        str: state.str,
        sponsoredLegalEntityReducer:
            state.sponsoredLegalEntityReducer.legalEntity,
        sponsorCurrentStepReducer: state.sponsorCurrentStepReducer,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onSubmitNodeConfig: (networkType) =>
            dispatch({
                type: actionTypes.CURRENT_STEP_DOWNLOAD_NODE_CONFIG,
                networkType: networkType,
            }),
        onSubmitSponseeNodeConfig: () =>
            dispatch({
                type: actionTypes.DOWNLOAD_SPONSEE_NODE_CONFIG,
            }),
        onBackCertificateDetails: () =>
            dispatch({
                type: actionTypes.SHOW_CERTIFICATES,
            }),
        onBackSponsoredParticipants: () =>
            dispatch({
                type: actionTypes.SHOW_SPONSORED_PARTICIPANTS,
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
        onSetUserProfile: (userId, names, email, role) =>
            dispatch({
                type: actionTypes.SET_USER_PROFILE,
                names: names,
                email: email,
                role: role,
            }),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateNodeConfig);
