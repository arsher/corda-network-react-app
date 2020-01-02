import React, { Component } from 'react';
import {
    // BrowserRouter as Router,
    BrowserRouter,
    Route,
    Switch,
    withRouter,
} from 'react-router-dom';
import './App.scss';
import Navigation from './components/Navigation/Navigation';
import Header from './components/Header/Header';
import BottomBar from './components/BottomBar/BottomBar';
import Search from './containers/Search/Search';
import Register from './containers/Register/Register';
import Login from './containers/Login/Login';
// import Dashboard from './containers/Dashboard/Dashboard';
import LoginSuccess from './components/Login/LoginSuccess/LoginSuccess';
import loginError from './components/Login/LoginError/LoginError';
import RegisterError from './components/Register/RegisterError/RegisterError';
import RegisterSuccess from './components/Register/RegisterSuccess/RegisterSuccess';
import Onboarding from './containers/Onboarding/Onboarding';
import SignIn from './components/SignIn/SignIn';
import { connect } from 'react-redux';
import * as actionTypes from './store/actions';
import Home from './containers/Site/Home/Home';
import { ToastContainer } from 'react-toastify';
import {
    getCookie,
    setCookie,
    deleteCookie,
} from './helpers/authorizationService';
import ManageDirectUsers from './components/ManageUsers/ManageDirectUsers/ManageDirectUsers';
import ManageSponsorUsers from './components/ManageUsers/ManageSponsorUsers/ManageSponsorUsers';
import Profile from './components/Profile/Profile';
import About from './containers/Site/About/About';
import Governance from './containers/Site/Governance/Governance';
import Participation from './containers/Site/Participation/Participation';
import Policy from './containers/Site/Policy/Policy';
import TrustRoot from './containers/Site/TrustRoot/TrustRoot';
import {
    axiosIdentityCheckGET,
    axiosParticipantPrimaryGET,
    axiosCurrentAccountGET,
} from './axios/axios';
import CreateNode from './containers/CreateNode/CreateNode';
import NotFound from './containers/NotFound/NotFound';
import LoadingOverlay from 'react-loading-overlay';
// import * as firebase from 'firebase';
import firebase from 'firebase/app';
import 'firebase/app';
import 'firebase/auth';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import { handleApiError } from './utils/utils';
import Invitation from './components/Invitation/Invitation';
import DashboardNew from './containers/DashboardNew/DashboardNew';
import Minutes from './containers/Site/Minutes/Minutes';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initialLoading: null,
        };
    }

    componentDidMount() {
        if (!this.state.initialLoading) {
            this.setState({
                initialLoading: true,
            });
        }
        this.loadInitialData();

        setInterval(() => {
            this.loadInitialData();
        }, 3550000); // < 1hr mark

        this.scrollToIdLinks();
    }

    componentWillUpdate() {
        this.scrollToIdLinks();
    }

    scrollToIdLinks() {
        setTimeout(() => {
            document
                .querySelectorAll("a[href^='#']:not([href^='#/'])")
                .forEach((it) => {
                    it.addEventListener('click', (event) => {
                        event.preventDefault();
                        let elementID = event.target.getAttribute('href');
                        let targetElement = document.querySelector(
                            "[id='" + elementID.replace('#', '') + "']"
                        );
                        if (!targetElement) {
                            let headingText = elementID
                                .replace(/#\d+-/, '')
                                .replace(/-/g, ' ');
                            targetElement = this.findHeadingElementByText(
                                headingText,
                                ['h6', 'h5', 'h4', 'h3', 'h2', 'h1']
                            );
                        }
                        if (targetElement) targetElement.scrollIntoView();
                    });
                });
        }, 1000);
    }

    findHeadingElementByText(text, headingTags) {
        let headingTag = headingTags.pop();
        if (!headingTag) {
            return null;
        }

        let xpath =
            '//' +
            headingTag +
            "[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '" +
            text +
            "')]";
        let targetElement = document.evaluate(
            xpath,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;
        if (targetElement) return targetElement;
        else return this.findHeadingElementByText(text, headingTags);
    }

    loadInitialData() {
        if (getCookie('authorizationKey') === '') {
            // firebase.initializeApp(firebaseConfig);
            this.setState({
                initialLoading: false,
            });
        } else {
            deleteCookie('authorizationKey');
            deleteCookie('userRole');

            firebase.apps[0].INTERNAL.getToken(true)
                .then((token) => {
                    setCookie('authorizationKey', token.accessToken, 0, 1);
                    axios.defaults.headers.common = {
                        Authorization: `bearer ${getCookie(
                            'authorizationKey'
                        )}`,
                    };
                    this.props.onSetAuthorizationToken(token.accessToken);

                    const decodedToken = jwt_decode(token.accessToken);

                    let role;
                    if (decodedToken.scope.includes('ROLE_ADMIN')) {
                        role = 'admin';
                    } else if (decodedToken.scope.includes('ROLE_USER')) {
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
                        this.props.onSetUserData(names, account.data.email);
                        this.setState({
                            initialLoading: false,
                        });
                    });
                })
                .catch((err) => {
                    handleApiError(err);

                    this.props.history.push({
                        pathname: 'login',
                        state: {},
                    });
                    this.setState({
                        initialLoading: false,
                    });
                });
        }

        if (
            this.props.upr.role === 'user' ||
            this.props.upr.role === 'signer'
        ) {
            axiosIdentityCheckGET()
                .then((response) => {
                    if (response.data.status === 'SUCCESS') {
                        this.props.onCompleteIdentityChecks();
                    }
                })
                .catch(() => {});
        }

        axiosParticipantPrimaryGET().then((response) => {
            this.props.onSetParticipantType(response.data.type);
        });
    }

    render() {
        return (
            <div className="App">
                <LoadingOverlay
                    active={this.state.initialLoading}
                    spinner
                    text="Loading...">
                    <BrowserRouter basename="/">
                        <Navigation />
                        <Header />
                        <Switch>
                            {/* STATIC PAGES */}
                            <Route exact path="/" component={Home} />
                            <Route path="/about" component={About} />
                            <Route path="/minutes" component={Minutes} />
                            <Route path="/governance" component={Governance} />
                            <Route
                                path="/participation"
                                component={Participation}
                            />
                            <Route path="/policy" component={Policy} />
                            <Route path="/trust-root" component={TrustRoot} />
                            {/* LOGIN REGISTER */}
                            {!this.props.uar.isUserAuthorized && (
                                <Route exact path="/login" component={Login} />
                            )}
                            {!this.props.uar.isUserAuthorized && (
                                <Route
                                    exact
                                    path="/login/success"
                                    component={LoginSuccess}
                                />
                            )}
                            {!this.props.uar.isUserAuthorized && (
                                <Route
                                    exact
                                    path="/login/error"
                                    component={loginError}
                                />
                            )}
                            {!this.props.uar.isUserAuthorized && (
                                <Route
                                    exact
                                    path="/register"
                                    component={Register}
                                />
                            )}
                            {!this.props.uar.isUserAuthorized && (
                                <Route
                                    exact
                                    path="/register/success"
                                    component={RegisterSuccess}
                                />
                            )}
                            {!this.props.uar.isUserAuthorized && (
                                <Route
                                    exact
                                    path="/register/error"
                                    component={RegisterError}
                                />
                            )}
                            <Route
                                exact
                                path="/signIn/:mode?/:oobCode?/:apiKey?/"
                                component={SignIn}
                            />
                            {/* SEARCH */}
                            <Route exact path="/search" component={Search} />
                            {/* ADMIN PAGES */}
                            {this.props.uar.isUserAuthorized &&
                                this.props.upr.role === 'admin' && (
                                    <Route
                                        exact
                                        path="/admin/direct"
                                        component={ManageDirectUsers}
                                    />
                                )}
                            {this.props.uar.isUserAuthorized &&
                                this.props.upr.role === 'admin' && (
                                    <Route
                                        exact
                                        path="/admin/sponsor"
                                        component={ManageSponsorUsers}
                                    />
                                )}
                            {/* USER PAGES */}
                            {this.props.uar.isUserAuthorized &&
                                this.props.upr.role === 'user' &&
                                this.props.csr.currentStep ===
                                    actionTypes.CURRENT_STEP_IDENTITY_COMPLETED && (
                                    <Route
                                        exact
                                        path="/create-node"
                                        component={CreateNode}
                                    />
                                )}
                            {this.props.uar.isUserAuthorized &&
                                this.props.upr.role === 'user' &&
                                this.props.csr.currentStep ===
                                    actionTypes.CURRENT_STEP_IDENTITY_COMPLETED && (
                                    <Route
                                        path="/dashboard"
                                        component={DashboardNew}
                                    />
                                )}
                            {this.props.uar.isUserAuthorized &&
                                this.props.upr.role === 'signer' && (
                                    <Route
                                        path="/dashboard"
                                        component={DashboardNew}
                                    />
                                )}
                            {this.props.uar.isUserAuthorized &&
                                this.props.upr.role === 'user' &&
                                this.props.csr.currentStep ===
                                    actionTypes.CURRENT_STEP_IDENTITY_COMPLETED && (
                                    <Route
                                        exact
                                        path="/profile"
                                        component={Profile}
                                    />
                                )}
                            {this.props.uar.isUserAuthorized &&
                                this.props.upr.role === 'user' &&
                                this.props.csr.currentStep !==
                                    actionTypes.CURRENT_STEP_IDENTITY_COMPLETED && (
                                    <Route
                                        exact
                                        path="/onboarding"
                                        component={Onboarding}
                                    />
                                )}
                            {/* SIGNER */}
                            <Route
                                exact
                                path="/invitation"
                                component={Invitation}
                                history={this.props.history}
                            />
                            {!this.state.initialLoading && (
                                <Route
                                    path="*"
                                    exact={true}
                                    component={NotFound}
                                />
                            )}
                        </Switch>
                        <BottomBar />
                    </BrowserRouter>
                    <ToastContainer
                        position="top-right"
                        autoClose={5000}
                        hideProgressBar={true}
                        newestOnTop={true}
                        closeOnClick={true}
                        rtl={false}
                        draggable={false}
                        pauseOnHover={true}
                    />
                </LoadingOverlay>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        uar: state.uar,
        upr: state.upr,
        csr: state.csr,
        cnr: state.cnr,
        ler: state.ler,
        ptr: state.ptr,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onClearUserAuthorization: () =>
            dispatch({
                type: actionTypes.REMOVE_USER_AUTHORIZATION,
            }),
        onCompleteIdentityChecks: () =>
            dispatch({
                type: actionTypes.CURRENT_STEP_IDENTITY_COMPLETED,
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
        onSetUserData: (names, email) =>
            dispatch({
                type: actionTypes.SET_USER_PROFILE,
                names: names,
                email: email,
            }),
        onRemoveUserRole: () =>
            dispatch({
                type: actionTypes.REMOVE_USER_ROLE,
            }),
        onSetParticipantType: (type) =>
            dispatch({
                type: actionTypes.SET_PARTICIPANT_TYPE,
                participantType: type,
            }),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
