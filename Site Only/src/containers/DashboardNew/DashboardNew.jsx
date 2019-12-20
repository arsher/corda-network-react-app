import React, { Component } from 'react';
import './DashboardNew.scss';
import { Switch, Route, NavLink, Redirect } from 'react-router-dom';
import Networks from '../Networks/Networks';
import Account from '../../components/Dashboard/Account/Account';
import Billing from '../../components/Dashboard/Billing/Billing';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions';
import { axiosParticipantPrimaryGET } from '../../axios/axios';
import SponsoredParticipants from '../SponsoredParticipants/SponsoredParticipants';
import TermsOfUseAgreement from '../../components/TermsOfUseAgreement/TermsOfUseAgreement';
import ProductionTerms from '../../components/ProductionTerms/ProductionTerms';
import SignTerms from '../../components/Dashboard/SignTerms/SignTerms';

class DashboardNew extends Component {
    componentDidMount() {
        axiosParticipantPrimaryGET().then((response) => {
            this.props.onSetParticipantType(response.data.type);
        });
    }

    render() {
        const { match } = this.props;

        return (
            <div className="dashboard bg-ghost-white">
                <div className="container-fluid dashboard-links">
                    <div className="row">
                        <ul className="offset-1 px-15 box--flex center--y">
                            {this.props.upr.role !== 'signer' && (
                                <li>
                                    <NavLink
                                        to={`${match.url}/networks`}
                                        className="nav-link">
                                        Networks
                                    </NavLink>
                                </li>
                            )}
                            {this.props.ptr === 'SPONSOR' &&
                                this.props.upr.role !== 'signer' && (
                                    <li>
                                        <NavLink
                                            to={`${match.url}/participants`}
                                            className="nav-link">
                                            Participants
                                        </NavLink>
                                    </li>
                                )}
                            <li>
                                <NavLink
                                    to={`${match.url}/account`}
                                    className="nav-link">
                                    Account
                                </NavLink>
                            </li>
                            {this.props.upr.role !== 'signer' && (
                                <li>
                                    <NavLink
                                        to={`${match.url}/billing`}
                                        className="nav-link">
                                        Billing
                                    </NavLink>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
                <div className="dashboard-tabs">
                    <Switch>
                        {this.props.upr.role !== 'signer' && (
                            <Route
                                path={`${match.url}/networks`}
                                component={Networks}
                            />
                        )}
                        {this.props.ptr === 'SPONSOR' && (
                            <Route
                                path={`${match.url}/participants`}
                                component={SponsoredParticipants}
                            />
                        )}
                        <Route
                            path={`${match.url}/account/terms-of-use`}
                            component={TermsOfUseAgreement}
                        />
                        <Route
                            path={`${match.url}/account/production-terms`}
                            component={ProductionTerms}
                        />
                        {this.props.upr.role === 'signer' && (
                            <Route
                                path={`${match.url}/account/sign-terms`}
                                component={SignTerms}
                            />
                        )}
                        <Route
                            path={`${match.url}/account`}
                            component={Account}
                        />
                        {this.props.upr.role !== 'signer' && (
                            <Route
                                path={`${match.url}/billing`}
                                component={Billing}
                            />
                        )}
                        {this.props.upr.role !== 'signer' && (
                            <Redirect
                                from="/dashboard"
                                to="/dashboard/networks"
                            />
                        )}
                        {this.props.upr.role === 'signer' && (
                            <Redirect
                                from="/dashboard"
                                to="/dashboard/account"
                            />
                        )}
                    </Switch>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        ptr: state.ptr.participantType,
        upr: state.upr,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onSetParticipantType: (type) =>
            dispatch({
                type: actionTypes.SET_PARTICIPANT_TYPE,
                participantType: type,
            }),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardNew);
