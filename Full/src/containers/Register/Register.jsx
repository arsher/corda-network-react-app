import './Register.scss';
import React, { Component } from 'react';
import LoadingOverlay from 'react-loading-overlay';
import { Link } from 'react-router-dom';
import { axiosRegister } from '../../axios/axios';
import Recaptcha from 'react-google-invisible-recaptcha';
import { connect } from 'react-redux';
import { VALID_MAIL_REGEX } from '../../utils/constant';

class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {
                firstName: '',
                lastName: '',
                email: '',
                captchaResponse: '',
            },
            registrationInProcess: true,
            isEmailValid: false,
            isNamesValid: false,
        };

        this.onResolved = this.onResolved.bind(this);
    }

    componentDidMount() {
        this.setState({
            registrationInProcess: false,
        });

        if (this.props.uar.isUserAuthorized) {
            this.props.history.push({
                pathname: '/onboarding',
                state: {},
            });
        }
    }

    register(e) {
        e.preventDefault();
        this.recaptcha.execute();
    }

    handleRegisterFormChange(event) {
        const { name, value } = event.target;
        const { user } = this.state;
        if (name === 'names') {
            const names = value.split(' ');
            this.setState({
                user: {
                    ...user,
                    firstName: names[0],
                    lastName: names[1],
                },
            });

            if (this.validateNames(value)) {
                this.setState({
                    isNamesValid: true,
                });
            } else {
                this.setState({
                    isNamesValid: false,
                });
            }
        } else if (name === 'email') {
            const emailValidator = VALID_MAIL_REGEX;
            !emailValidator.test(event.target.value)
                ? this.setState({
                      user: {
                          ...user,
                          [name]: value,
                      },
                      isEmailValid: false,
                  })
                : this.setState({
                      user: {
                          ...user,
                          [name]: value,
                      },
                      isEmailValid: true,
                  });
        }
    }

    handleEmailInputBlur(event) {
        const emailValidator = VALID_MAIL_REGEX;
        emailValidator.test(event.target.value)
            ? (event.target.className = 'form-control is-valid')
            : (event.target.className = 'form-control is-invalid');
    }

    handleNamesBlur(event) {
        if (!this.validateNames(event.target.value)) {
            event.target.className = 'form-control is-invalid';
        } else {
            event.target.className = 'form-control is-valid';
        }
    }

    validateNames(inputNames) {
        const names = inputNames.trim().split(' ');

        if (names.length === 2) {
            return true;
        } else {
            return false;
        }
    }

    onResolved() {
        this.setState({
            registrationInProcess: true,
        });

        const { firstName, lastName, email } = this.state.user;
        const captchaResponse = this.recaptcha.getResponse();

        const payload = {
            firstName,
            lastName,
            email,
            captchaResponse,
        };

        axiosRegister(payload)
            .then((response) => {
                localStorage.setItem('email', this.state.user.email);
                this.setState({
                    registrationInProcess: false,
                });
                this.props.history.push({
                    pathname: 'register/success',
                    state: { email: this.state.user.email },
                });
            })
            .catch((err) => {
                this.setState({
                    registrationInProcess: false,
                });
                const message =
                    err.response && err.response.data.message
                        ? err.response.data.message
                        : 'Something went wrong';
                this.props.history.push({
                    pathname: 'register/error',
                    state: {
                        registrationError: message,
                    },
                });
            });
    }

    render() {
        const {
            registrationInProcess,
            isEmailValid,
            isNamesValid,
        } = this.state;

        return (
            <LoadingOverlay
                active={registrationInProcess}
                spinner
                text="Loading...">
                <div className="container-fluid">
                    <div className="row register center--y bg-ghost-white">
                        <div className="col-lg-6 offset-lg-1 col-md-6 offset-md-1 col-sm-12">
                            <div className="form-wrapper bg-white">
                                <h1 className="h2">Register</h1>
                                <form
                                    onSubmit={(e) => this.register(e)}
                                    className="register-form mt-16">
                                    <div className="form-group">
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
                                                    this.handleRegisterFormChange(
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
                                    <div className="form-group mb-40">
                                        <label
                                            htmlFor="names"
                                            className="has-float-label">
                                            <input
                                                name="names"
                                                type="text"
                                                id="names"
                                                placeholder=" "
                                                className="form-control"
                                                onChange={(e) => {
                                                    this.handleRegisterFormChange(
                                                        e
                                                    );
                                                }}
                                                onBlur={(e) => {
                                                    this.handleNamesBlur(e);
                                                }}
                                            />
                                            <span>First and Last Name</span>
                                        </label>
                                    </div>
                                    <button
                                        type="submit"
                                        aria-pressed="false"
                                        className="btn btn-primary m-0"
                                        disabled={
                                            !isEmailValid || !isNamesValid
                                        }>
                                        send
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
                            <div className="register-info">
                                <i className="mdi mdi-alert-octagram-outline"></i>
                                <p className="mt-10 mb-20">
                                    All nodes on Corda Network represent a legal
                                    entity.
                                </p>
                                <p className="mb-20">
                                    The domain name of your email address must
                                    belong to the legal entity you’re
                                    registering for.
                                </p>
                                <p className="mb-20">
                                    After submitting the form a confirmation
                                    link will be sent to this email. You don’t
                                    need to create a password, you’ll be able to
                                    log in with your email.
                                </p>
                                <Link
                                    className="solo-link"
                                    to="/participation/pre-joining"
                                    target="_blank">
                                    Learn about joining
                                </Link>
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

export default connect(mapStateToProps, mapDispatchToProps)(Register);
