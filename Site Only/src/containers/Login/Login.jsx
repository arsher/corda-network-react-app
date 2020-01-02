import React, { Component } from 'react';
import './Login.scss';
import LoadingOverlay from 'react-loading-overlay';
import { axiosLogin } from '../../axios/axios';
import Recaptcha from 'react-google-invisible-recaptcha';
import { connect } from 'react-redux';
import { VALID_MAIL_REGEX } from '../../utils/constant';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userEmail: '',
            loginInProcess: true,
            loginResult: null,
            isEmailValid: false,
            captchaResponse: '',
        };

        this.onResolved = this.onResolved.bind(this);
    }

    componentDidMount() {
        this.setState({
            loginInProcess: false,
        });

        if (this.props.uar.isUserAuthorized) {
            this.props.history.push({
                pathname: '/onboarding',
                state: {},
            });
        }
    }

    login(e) {
        e.preventDefault();
        this.recaptcha.execute();
    }

    handleLoginFormChange(event) {
        const { value } = event.target;

        const emailValidator = VALID_MAIL_REGEX;
        !emailValidator.test(value)
            ? this.setState({
                  userEmail: value,
                  isEmailValid: false,
              })
            : this.setState({
                  userEmail: value,
                  isEmailValid: true,
              });
    }

    handleEmailInputBlur(event) {
        const emailValidator = VALID_MAIL_REGEX;
        emailValidator.test(event.target.value)
            ? (event.target.className = 'form-control is-valid')
            : (event.target.className = 'form-control is-invalid');
    }

    onResolved() {
        this.setState({
            loginInProcess: true,
        });

        const email = this.state.userEmail;
        const captchaResponse = this.recaptcha.getResponse();

        const payload = {
            email: email,
            captchaResponse: captchaResponse,
        };

        axiosLogin(payload)
            .then(() => {
                localStorage.setItem('email', this.state.userEmail);
                this.setState({
                    loginInProcess: false,
                });
                this.recaptcha.reset();
                this.props.history.push({
                    pathname: 'login/success',
                    state: { email: this.state.userEmail },
                });
            })
            .catch((err) => {
                this.setState({
                    loginInProcess: false,
                });
                const message =
                    err.response && err.response.data.message
                        ? err.response.data.message
                        : 'Something went wrong';
                this.props.history.push({
                    pathname: 'login/error',
                    state: { error: message },
                });
            });
    }

    render() {
        const { loginInProcess, isEmailValid } = this.state;

        return (
            <LoadingOverlay active={loginInProcess} spinner text="Logging...">
                <div className="container-fluid">
                    <div className="row login center--y bg-ghost-white">
                        <div className="col-lg-6 offset-lg-1 col-md-6 offset-md-1 col-sm-12">
                            <div className="form-wrapper bg-white">
                                <h1 className="h2">Log in</h1>
                                <form
                                    onSubmit={(e) => this.login(e)}
                                    className="login-form mt-16">
                                    <div className="form-group mb-40">
                                        <label
                                            htmlFor="email"
                                            className="has-float-label">
                                            <input
                                                name="email"
                                                type="email"
                                                id="email"
                                                placeholder=" "
                                                className="form-control"
                                                onChange={(e) => {
                                                    this.handleLoginFormChange(
                                                        e
                                                    );
                                                }}
                                                onBlur={(e) => {
                                                    this.handleEmailInputBlur(
                                                        e
                                                    );
                                                }}
                                            />
                                            <span>Work Email</span>
                                        </label>
                                    </div>
                                    <button
                                        type="submit"
                                        aria-pressed="false"
                                        className="btn btn-primary m-0"
                                        disabled={!isEmailValid}>
                                        Send Log In Link
                                    </button>
                                    <Recaptcha
                                        ref={(ref) => (this.recaptcha = ref)}
                                        sitekey="6LdGFLkUAAAAAB8NA09Ld9vXLz4KjCEBpWB3ECIj"
                                        onResolved={() => this.onResolved()}
                                    />
                                </form>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-12">
                            <div className="login-info">
                                <i className="mdi mdi-email-check-outline"></i>
                                <p className="mt-10">
                                    Enter the email you are registered with, and
                                    we will send you a link that will sign you
                                    in instantly. The link will be valid for 30
                                    minutes.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </LoadingOverlay>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        uar: state.uar,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
