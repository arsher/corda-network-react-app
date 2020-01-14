import React, { Component } from "react";
import "./SignIn.scss";
// import * as firebase from 'firebase';
import firebase from "firebase/app";
import "firebase/app";
import "firebase/auth";
import firebaseConfig from "../../utils/firebaseConfig";
import LoadingOverlay from "react-loading-overlay";
import * as actionTypes from "../../store/actions";
import { connect } from "react-redux";
import axios from "axios";
import { axiosCurrentAccountGET } from "../../axios/axios.jsx";
import { setCookie, getCookie } from "../../helpers/authorizationService";
import jwt_decode from "jwt-decode";
import { handleApiError } from "../../utils/utils";

firebase.initializeApp(firebaseConfig[process.env.ENVIRONMENT]);

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.props.onStartLoader();
  }

  componentDidMount() {
    let userEmail = localStorage.getItem("email");

    if (userEmail === null) {
      userEmail = "";
    }

    if (
      firebase.auth().isSignInWithEmailLink(
        // TODO: change in context
        `http://localhost:3000/corda_network${this.props.location.pathname}${this.props.location.search}`
      )
    ) {
      firebase
        .auth()
        .signInWithEmailLink(
          userEmail,
          // TODO: change in context
          `http://localhost:3000/corda_network${this.props.location.pathname}${this.props.location.search}`
        )
        .then(() => {
          firebase
            .auth()
            .currentUser.getIdToken()
            .then(token => {
              setCookie("authorizationKey", token, 0, 1);
              axios.defaults.headers.common = {
                Authorization: `bearer ${getCookie("authorizationKey")}`
              };
              this.props.onSetAuthorizationToken(token);

              const decodedToken = jwt_decode(token);
              let role;
              if (decodedToken.scope.includes("ROLE_ADMIN")) {
                role = "admin";
              } else if (decodedToken.scope.includes("ROLE_USER")) {
                role = "user";
              } else {
                role = "signer";
              }
              this.props.onSetUserProfile(role);
              setCookie("userRole", role, 0, 1);

              axiosCurrentAccountGET().then(account => {
                const names =
                  account.data.firstName + " " + account.data.lastName;
                this.props.onSetUserData(names, account.data.email);
                this.props.onStopLoader();
              });
            })
            .then(() => {
              if (this.props.upr.role === "user") {
                this.props.history.push("/onboarding");
              } else if (this.props.upr.role === "admin") {
                this.props.history.push("/admin/direct");
              } else if (this.props.upr.role === "signer") {
                this.props.history.push("/invitation");
              }
            })
            .catch(err => {
              handleApiError(err);
              this.props.history.push({
                pathname: "login",
                state: {}
              });
              this.props.onStopLoader();
            });
        })
        .catch(err => {
          if (this.props.uar.isUserAuthorized) {
            if (this.props.upr.role === "user") {
              this.props.history.push("/onboarding");
            } else if (this.props.upr.role === "admin") {
              this.props.history.push("/admin/direct");
            }
            this.props.onStopLoader();
          } else {
            this.props.history.push({
              pathname: "login/error",
              state: { error: err.message }
            });
            this.props.onStopLoader();
          }
        });
    } else {
      if (this.props.uar.isUserAuthorized) {
        if (this.props.upr.role === "user") {
          this.props.history.push("/onboarding");
        } else if (this.props.upr.role === "admin") {
          this.props.history.push("/admin/direct");
        }
        this.props.onStopLoader();
      } else {
        this.props.history.push({
          pathname: "login/error",
          state: { error: "ivalid token" }
        });
        this.props.onStopLoader();
      }
    }
  }

  render() {
    return (
      <LoadingOverlay active={this.props.loader.isLoading} spinner text="">
        <div className="sign-in"> </div>
      </LoadingOverlay>
    );
  }
}

const mapStateToProps = state => {
  return {
    uar: state.uar,
    upr: state.upr,
    loader: state.loader
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSetAuthorizationToken: token =>
      dispatch({
        type: actionTypes.SET_USER_AUTHORIZATION,
        authorizationToken: token
      }),
    onSetUserProfile: role =>
      dispatch({
        type: actionTypes.SET_USER_ROLE,
        role: role
      }),
    onSetUserData: (names, email) =>
      dispatch({
        type: actionTypes.SET_USER_PROFILE,
        names: names,
        email: email
      }),
    onStartLoader: () =>
      dispatch({
        type: actionTypes.START_LOADER,
        isLoading: true
      }),
    onStopLoader: () =>
      dispatch({
        type: actionTypes.STOP_LOADER,
        isLoading: false
      })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
