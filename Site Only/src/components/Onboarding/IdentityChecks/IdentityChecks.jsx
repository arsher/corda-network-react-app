import React from 'react';
import { Link } from 'react-router-dom';
import './IdentityChecks.scss';
import { connect } from 'react-redux';
import { deleteCookie } from '../../../helpers/authorizationService';
import * as actionTypes from '../../../store/actions';

class IdentityChecks extends React.Component {
    logout() {
        this.props.onStartLoader();
        deleteCookie('authorizationKey');
        deleteCookie('userRole');
        localStorage.removeItem('email');
        this.props.onClearUserAuthorization();
        this.props.onRemoveUserRole();
        this.props.onStopLoader();
        this.props.history.push('/login');
    }

    render() {
        return (
            <div className="identity-checks bg-white">
                <div className="card">
                    <div className="card-body text-center">
                        <i className="mdi mdi-progress-clock"></i>
                        <p className="subtitle">
                            Please Wait, While We Run Identity Checks
                        </p>
                        <div className="h-splitter"></div>
                        <p className="px-10">
                            The Terms of Use agreement has been successfully
                            signed. Now we are running{' '}
                            <Link to="/policy/admission-criteria">
                                identity checks
                            </Link>{' '}
                            and will get back to you ASAP to proceed to your
                            account. We will inform you via the email address
                            which you have provided in the previous step.
                        </p>
                        <div className="form-group">
                            <label htmlFor="email" className="has-float-label">
                                <input
                                    name="email"
                                    type="email"
                                    id="email"
                                    placeholder=" "
                                    className="form-control"
                                    disabled={true}
                                    value={localStorage.getItem('email')}
                                />
                                <span>Work Email</span>
                            </label>
                        </div>
                        <div className="h-splitter"></div>
                        <div className="box--flex center--xXx">
                            <Link
                                to="/login"
                                className="solo-link m-0"
                                onClick={() => this.logout()}>
                                Save and Log Out
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        str: state.str,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onClearUserAuthorization: () =>
            dispatch(
                {
                    type: actionTypes.REMOVE_USER_AUTHORIZATION,
                },
                dispatch({
                    type: actionTypes.REMOVE_USER_ROLE,
                })
            ),
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
        onRemoveUserRole: () =>
            dispatch({
                type: actionTypes.REMOVE_USER_ROLE,
            }),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(IdentityChecks);
