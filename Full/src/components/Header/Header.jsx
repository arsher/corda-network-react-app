import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import './Header.scss';
import { connect } from 'react-redux';
import { deleteCookie } from '../../helpers/authorizationService';
import * as actionTypes from '../../store/actions';
import Breadcrumbs from '../Breadcrumb/Breadcrumb';

class Header extends React.Component {
    logout() {
        this.props.onStartLoader();
        deleteCookie('authorizationKey');
        deleteCookie('userRole');
        localStorage.removeItem('email');

        setTimeout(() => {
            this.props.onClearUserAuthorization();
            this.props.onRemoveUserRole();
            this.props.onStopLoader();
            this.props.history.push('/login');
        }, 2000);
    }

    render() {
        const { location } = this.props;

        function determineClasses() {
            let classString = 'header container-fluid';
            if (location.pathname.match(/^\/$/)) {
                classString += ' transparent';
            }
            return classString;
        }
        return (
            <header className={determineClasses()}>
                <div className="row h-100">
                    <div className="col-12 box--flex center--y center--XxX">
                        <div className="offset-lg-1">
                            <Breadcrumbs />
                        </div>
                        {!this.props.uar.isUserAuthorized && (
                            <div className="nav-right">
                                <NavLink
                                    to="/login"
                                    className="nav-link"
                                    activeClassName="selected">
                                    Log in
                                </NavLink>
                                <NavLink
                                    to="/register"
                                    className="nav-link"
                                    activeClassName="selected">
                                    Register
                                </NavLink>
                            </div>
                        )}
                        {this.props.uar.isUserAuthorized && (
                            <div className="nav-right">
                                {this.props.upr.names &&
                                    this.props.upr.names !== ' ' && (
                                        <span className="user-name">
                                            {this.props.upr.names}
                                        </span>
                                    )}
                                <a
                                    className="nav-link logout-link"
                                    onClick={() => this.logout()}>
                                    log out
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </header>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        uar: state.uar,
        upr: state.upr,
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Header));
