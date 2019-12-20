import React, { Component } from 'react';
import './Invitation.scss';
import LoadingOverlay from 'react-loading-overlay';
import * as actionTypes from '../../store/actions';
import { connect } from 'react-redux';
import {
    axiosSignerFirebaseCodeGET,
    axiosCurrentAccountGET,
} from '../../axios/axios';
import { handleApiError } from '../../utils/utils';
import firebase from 'firebase/app';
import 'firebase/app';
import 'firebase/auth';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jwt_decode from 'jwt-decode';
import { setCookie, getCookie } from '../../helpers/authorizationService';
import axios from 'axios';

class Invitation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
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
        this.startLoader();

        if (!this.props.uar.isUserAuthorized) {
            const apiToken = this.props.location.search.substr(
                7,
                this.props.location.search.length - 1
            );

            axiosSignerFirebaseCodeGET(apiToken)
                .then((response) => {
                    firebase
                        .auth()
                        .signInWithCustomToken(response.data.token)
                        .then((response) => {
                            setCookie(
                                'authorizationKey',
                                response.user.ma,
                                0,
                                1
                            );
                            axios.defaults.headers.common = {
                                Authorization: `bearer ${getCookie(
                                    'authorizationKey'
                                )}`,
                            };
                            this.props.onSetAuthorizationToken(
                                response.user.ma
                            );

                            const decodedToken = jwt_decode(response.user.ma);

                            let role;
                            if (decodedToken.scope.includes('ROLE_ADMIN')) {
                                role = 'admin';
                            } else if (
                                decodedToken.scope.includes('ROLE_USER')
                            ) {
                                role = 'user';
                            } else {
                                role = 'signer';
                            }
                            this.props.onSetUserProfile(role);
                            setCookie('userRole', role, 0, 1);
                        })
                        .then(() => {
                            axiosCurrentAccountGET().then((account) => {
                                const names =
                                    account.data.firstName +
                                    ' ' +
                                    account.data.lastName;
                                this.props.onSetUserData(
                                    names,
                                    account.data.email
                                );
                            });
                        })
                        .then(() => {
                            this.props.history.push({
                                pathname: 'dashboard/account/sign-terms',
                                state: {},
                            });
                        })
                        .catch((error) => {
                            toast(<div>{error.message}</div>, {
                                type: 'error',
                            });
                            this.props.history.push({
                                pathname: 'notfound',
                                state: { error: error.message },
                            });
                            this.stopLoader();
                        });
                })
                .catch((err) => {
                    handleApiError(err);
                    this.props.history.push({
                        pathname: 'notfound',
                        state: { error: err.message },
                    });
                    this.stopLoader();
                });
        } else {
            this.props.history.push({
                pathname: 'dashboard/account/sign-terms',
                state: {},
            });
        }
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

    render() {
        return (
            <LoadingOverlay active={this.state.loading} spinner text="">
                <div className="invitation "></div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Invitation);
