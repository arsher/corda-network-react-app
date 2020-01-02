import React from 'react';
import { Link } from 'react-router-dom';
import './LoginSuccess.scss';

const LoginSuccess = (props) => {
    return (
        <div className="container-fluid">
            <div className="row bg-ghost-white login-success center--y">
                <div className="login-completed bg-white col-6 offset-1">
                    <i className="mdi mdi-email-check-outline"></i>
                    <h1 className="mb-30 mt-10">Link sent!</h1>
                    <p className="mb-20">
                        We’ve emailed a log-in link to <br />
                        <span className="text-bold">
                            {props.location.state
                                ? props.location.state.email
                                : 'missing email'}
                        </span>
                    </p>
                    <p>
                        Didn’t get an email? Please, check your spam folder or{' '}
                        <Link to="/login">send an email again.</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginSuccess;
