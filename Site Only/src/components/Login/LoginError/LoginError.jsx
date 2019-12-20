import React from 'react';
import { Link } from 'react-router-dom';
import './LoginError.scss';
import { INVALID_MAIL_REGEX } from '../../../utils/constant';

const LoginError = (props) => {
    let message;
    let regex;
    let errorMessage;

    if (props.location.state) {
        message = props.location.state.error;
        regex = INVALID_MAIL_REGEX;
    }

    if (typeof message !== 'undefined') {
        errorMessage = message.replace(
            regex,
            '<span class="text-bold">$&</span>'
        );
    } else {
        errorMessage = 'Something went wrong';
    }

    return (
        <div className="container-fluid">
            <div className="row bg-ghost-white login-error center--y">
                <div className="col-6 offset-1">
                    <div className="login-completed bg-white">
                        <i className="mdi mdi-alert-outline"></i>
                        <h1 className="mb-30 mt-10">
                            Something isn’t working.
                        </h1>
                        <p
                            className="mb-20"
                            dangerouslySetInnerHTML={{
                                __html: errorMessage,
                            }}
                        />
                        <p>
                            Please <Link to="/login">go back</Link> and try
                            again.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginError;
