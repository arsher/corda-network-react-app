import React, { Component } from 'react';
import './Profile.scss';
import {
    axiosCurrentAccountGET,
    axiosParticipantPrimaryGET,
} from '../../axios/axios';
import * as actionTypes from '../../store/actions';
import { connect } from 'react-redux';
import { getCookie } from '../../helpers/authorizationService';
import LoadingOverlay from 'react-loading-overlay';
import Modal from 'react-modal';
import { handleApiError } from '../../utils/utils';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = { authenticationInProcess: false, showModal: false };

        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
    }

    componentDidMount() {
        this.setState({
            authenticationInProcess: true,
        });
        if (this.props.upr.names === '' || this.props.upr.email === '') {
            axiosCurrentAccountGET()
                .then((acc) => {
                    const names = acc.data.firstName + ' ' + acc.data.lastName;
                    const role = getCookie('userRole');

                    this.props.onSetUserProfile(names, acc.data.email, role);
                    this.setState({
                        authenticationInProcess: false,
                    });
                })
                .then(() => {
                    axiosParticipantPrimaryGET()
                        .then((response) => {
                            this.props.onSetParticipantType(response.data.type);
                            this.props.onSetLegalEntity(response.data);
                        })
                        .catch((err) => {
                            this.props.setStartingStep();
                            this.handleAxiosError(err);
                        });
                })
                .catch((err) => {
                    this.setState({
                        authenticationInProcess: false,
                    });
                    handleApiError(err);
                });
        } else {
            this.setState({
                authenticationInProcess: false,
            });
        }
    }

    handleOpenModal() {
        this.setState({ showModal: true });
    }

    handleCloseModal() {
        this.setState({ showModal: false });
    }

    deleteAccount() {
        this.handleOpenModal();
    }

    render() {
        const { authenticationInProcess } = this.state;
        return (
            <LoadingOverlay
                active={authenticationInProcess}
                spinner
                text="Loading...">
                <div className="container-fluid bg-ghost-white pt-60 profile">
                    <div className="row ">
                        <div className="col-6 offset-3 bg-white p-30 profile__wrapper">
                            <div className="box--flex center--y profile__header">
                                <i className="mdi mdi-account-outline"></i>
                                <div>Profile Details</div>
                            </div>
                            <div className="h-splitter"></div>
                            <div className="field box--flex center--y center--XxX">
                                <div className="name">Legal Entity Name </div>
                                <div className="value">
                                    {this.props.ler.name}
                                </div>
                            </div>
                            <div className="h-splitter"></div>
                            <div className="field box--flex center--y center--XxX">
                                <div className="name">Name </div>
                                <div className="value">
                                    {this.props.upr.names}
                                </div>
                            </div>
                            <div className="h-splitter"></div>
                            <div className="field box--flex center--y center--XxX">
                                <div className="name">Email</div>
                                <div className="value">
                                    {this.props.upr.email}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="box--flex center--x mt-30">
                        <div
                            onClick={() => this.deleteAccount()}
                            className="delete">
                            delete account
                        </div>
                    </div>
                </div>
                <Modal
                    ariaHideApp={false}
                    isOpen={this.state.showModal}
                    contentLabel="onRequestClose Example"
                    onRequestClose={() => this.handleCloseModal()}
                    className="Modal Modal__delete-account"
                    overlayClassName="Overlay Overlay__feedback">
                    <h1 className="text-center h3">Delete Account</h1>
                    <div className="h-splitter"></div>
                    <p>
                        If you wish to delete your account, please contact us at{' '}
                        <a
                            href={
                                'mailto:info@corda.network?subject=Request to delete account'
                            }>
                            info@corda.network
                        </a>{' '}
                    </p>
                    <div
                        onClick={() => this.handleCloseModal()}
                        className="close-btn">
                        close
                    </div>
                    <i
                        onClick={() => this.handleCloseModal()}
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
        ler: state.ler.legalEntity,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onSetUserProfile: (names, email, role) =>
            dispatch({
                type: actionTypes.SET_USER_PROFILE,
                names: names,
                email: email,
                role: role,
            }),
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
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
