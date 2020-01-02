import React from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as API_ERRORS from '../helpers/api-erros';

export const encode_utf8 = (s) => {
    return unescape(encodeURIComponent(s));
};

export const decode_utf8 = (s) => {
    return decodeURIComponent(escape(s));
};

export const handleApiError = (apiError) => {
    let errorMessage;

    if (
        apiError.response &&
        apiError.response.data &&
        apiError.response.data.message
    ) {
        switch (apiError.response.data.message) {
            case API_ERRORS.MISSING_SANCTION_CHECK:
                errorMessage = 'User did not pass eligibity checks';
                break;

            case API_ERRORS.DNB_API_ERROR:
                errorMessage = 'We cannot connect to the database';
                break;

            case API_ERRORS.SIGNATURE_VALIDATION_FAILED:
                errorMessage = 'This legal entity is missing in our database';
                break;

            case API_ERRORS.AGREEMENT_NOT_SIGNED:
                errorMessage = 'This agreement has not been signed';

            case API_ERRORS.INVALID_TOKEN:
                errorMessage = 'Either your token is invalid or expired';
                break;

            case API_ERRORS.MISSING_WORK_TITLE:
                errorMessage = "The work title you've entered is invalid";
                break;

            case API_ERRORS.SIGNATURE_REQUEST_IN_USE:
                errorMessage =
                    'This signature request is already in progress or finished';
                break;

            case API_ERRORS.ALREADY_EXISTS:
                errorMessage = 'Already exist';
                break;

            case API_ERRORS.SIGNATURE_REQUEST_INVALID:
                errorMessage =
                    'The signature request is either exprired or signed';
                break;

            default:
                errorMessage = apiError.response.data.message;
                break;
        }
    } else {
        errorMessage = 'Something went wrong';
    }

    toast(<div>{errorMessage}</div>, {
        type: 'error',
    });
};

export const downloadNodeConfigFile = (file) => {
    const element = document.createElement('a');
    element.href = URL.createObjectURL(file);
    element.download = 'nodeconf.conf';
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
};
