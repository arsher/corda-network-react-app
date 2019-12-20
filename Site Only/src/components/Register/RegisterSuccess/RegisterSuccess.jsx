import React from 'react';
import { Link } from 'react-router-dom';
import './RegisterSuccess.scss';

const RegisterSuccess = (props) => {
    return (
        <div className="container-fluid">
            <div className="row bg-ghost-white register-success center--y">
                <div className="col-6 offset-1">
                    <div className="registration-completed bg-white">
                        <i className="mdi mdi-email-check-outline"></i>
                        <h1 className="mb-30 mt-10">Link sent!</h1>
                        <p className="mb-20">
                            We’ve emailed a confirmation link to{' '}
                            <span className="text-bold">
                                {props.location.state
                                    ? props.location.state.email
                                    : 'missing email'}
                            </span>
                            . Check your email for a link to sign in and create
                            your account.
                        </p>
                        <p>
                            Didn’t get an email? Please, check your spam folder
                            or <Link to="/register">send an email again.</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterSuccess;
