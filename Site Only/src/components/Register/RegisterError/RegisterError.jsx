import React from 'react';
import { Link } from 'react-router-dom';
import './RegisterError.scss';
import { INVALID_MAIL_REGEX } from '../../../utils/constant';

const RegisterError = (props) => {
    let message;
    let regex;
    let errorMessage;

    if (props.location.state) {
        message = props.location.state.registrationError;
        regex = INVALID_MAIL_REGEX;
        errorMessage = message.replace(
            regex,
            '<span class="text-bold">$&</span>'
        );
    }

    return (
        <div className="container-fluid">
            <div className="row bg-ghost-white register-error center--y">
                <div className="col-6 offset-1">
                    <div className="registration-completed bg-white">
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
                            Please <Link to="/register">go back</Link> and try
                            again.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterError;
