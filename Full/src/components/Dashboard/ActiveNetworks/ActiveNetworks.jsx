import React, { Component, Fragment } from 'react';
import './ActiveNetworks.scss';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { axiosSignatureRequestsGET } from '../../../axios/axios';
import { handleApiError } from '../../../utils/utils.jsx';
import * as actionTypes from '../../../store/actions';
import { Link } from 'react-router-dom';

class ActiveNetworks extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pendingProductionTerms: false,
        };
    }

    componentDidMount() {
        this.props.onStartLoader();

        axiosSignatureRequestsGET()
            .then((response) => {
                if (response.data.length > 0) {
                    this.setState({
                        pendingProductionTerms: true,
                    });
                    this.props.onStopLoader();
                }
            })
            .catch((err) => {
                handleApiError(err);
                this.props.onStopLoader();
            });
    }

    render() {
        let preProduction, production, signerPreProduction, signerProduction;

        signerPreProduction = (
            <div className="network">
                <div className="type box">
                    <div className="production-pending box--flex center--y center--xXX">
                        <i className="mdi mdi-account-clock-outline mr-10"></i>
                        <div>
                            Please wait, for the Pre-production Agreement to be
                            signed
                        </div>
                    </div>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam, quis nostrud.
                    </p>
                </div>
            </div>
        );
        signerProduction = (
            <div className="network">
                <div className="type box">
                    <div className="production-pending box--flex center--y center--xXX">
                        <i className="mdi mdi-account-clock-outline mr-10"></i>
                        <div>
                            Please wait, for the Production Agreement to be
                            signed
                        </div>
                    </div>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam, quis nostrud.
                    </p>
                </div>
            </div>
        );

        this.state.pendingProductionTerms
            ? (production = (
                  <div className="network">
                      <div className="type box">
                          <div className="production-pending box--flex center--y center--xXX">
                              <i className="mdi mdi-account-clock-outline mr-10"></i>
                              <div>
                                  Please wait, for the Production Agreement to
                                  be signed
                              </div>
                          </div>
                          <p>
                              Lorem ipsum dolor sit amet, consectetur adipiscing
                              elit, sed do eiusmod tempor incididunt ut labore
                              et dolore magna aliqua. Ut enim ad minim veniam,
                              quis nostrud.
                          </p>
                      </div>
                  </div>
              ))
            : (production = (
                  <div className="network">
                      <p>
                          If you whant to join the <b>Production network</b>, an
                          authorised person from your company needs to sign the
                          Terms of Use agreement first.
                      </p>
                      <NavLink
                          to="/dashboard/account/production-terms"
                          className="upgrade-link">
                          upgrade to production network
                      </NavLink>
                  </div>
              ));

        this.props.str.map((signedTerm) => {
            // PREPRODUCTION ONLY
            if (signedTerm.agreementContext === 'UAT') {
                preProduction = (
                    <div className="network">
                        <div className="type box box--flex center--y center--XxX">
                            <div className="name">Pre-Production (UAT)</div>
                        </div>
                        <div className="date box box--flex center--y center--XxX">
                            <div>
                                TOU signed on {signedTerm.created.substr(0, 10)}
                            </div>
                        </div>
                        <div className="author box box--flex center--y center--XxX">
                            <div>
                                TOU signed by{' '}
                                {signedTerm.signatureData.firstName +
                                    ' ' +
                                    signedTerm.signatureData.lastName}
                            </div>
                        </div>
                        <div className="view box box--flex center--y center--XxX">
                            <Link
                                to={{
                                    pathname: '/dashboard/account/terms-of-use',
                                    state: {
                                        type: 'UAT',
                                    },
                                }}
                                className="solo-link link-secondary link-back">
                                view terms of use agreement
                            </Link>
                        </div>
                    </div>
                );
                signerPreProduction = (
                    <div className="network">
                        <div className="type box box--flex center--y center--XxX">
                            <div className="name">Pre-Production (UAT)</div>
                        </div>
                        <div className="date box box--flex center--y center--XxX">
                            <div>
                                TOU signed on {signedTerm.created.substr(0, 10)}
                            </div>
                        </div>
                        <div className="author box box--flex center--y center--XxX">
                            <div>
                                TOU signed by{' '}
                                {signedTerm.signatureData.firstName +
                                    ' ' +
                                    signedTerm.signatureData.lastName}
                            </div>
                        </div>
                        <div className="view box box--flex center--y center--XxX">
                            <Link
                                to={{
                                    pathname: '/dashboard/account/terms-of-use',
                                    state: {
                                        type: 'UAT',
                                    },
                                }}
                                className="solo-link link-secondary link-back">
                                view terms of use agreement
                            </Link>
                        </div>
                    </div>
                );
                // BOTH
            } else if (signedTerm.agreementContext === 'CORDANETWORK') {
                preProduction = (
                    <div className="network">
                        <div className="type box box--flex center--y center--XxX">
                            <div className="name">Pre-Production (UAT)</div>
                        </div>
                        <div className="date box box--flex center--y center--XxX">
                            <div>
                                TOU signed on {signedTerm.created.substr(0, 10)}
                            </div>
                        </div>
                        <div className="author box box--flex center--y center--XxX">
                            <div>
                                TOU signed by{' '}
                                {signedTerm.signatureData.firstName +
                                    ' ' +
                                    signedTerm.signatureData.lastName}
                            </div>
                        </div>
                        <div className="view box box--flex center--y center--XxX">
                            <Link
                                to={{
                                    pathname: '/dashboard/account/terms-of-use',
                                    state: {
                                        type: 'UAT',
                                    },
                                }}
                                className="solo-link link-secondary link-back">
                                view terms of use agreement
                            </Link>
                        </div>
                    </div>
                );
                signerPreProduction = (
                    <div className="network">
                        <div className="type box box--flex center--y center--XxX">
                            <div className="name">Pre-Production (UAT)</div>
                        </div>
                        <div className="date box box--flex center--y center--XxX">
                            <div>
                                TOU signed on {signedTerm.created.substr(0, 10)}
                            </div>
                        </div>
                        <div className="author box box--flex center--y center--XxX">
                            <div>
                                TOU signed by{' '}
                                {signedTerm.signatureData.firstName +
                                    ' ' +
                                    signedTerm.signatureData.lastName}
                            </div>
                        </div>
                        <div className="view box box--flex center--y center--XxX">
                            <Link
                                to={{
                                    pathname: '/dashboard/account/terms-of-use',
                                    state: {
                                        type: 'UAT',
                                    },
                                }}
                                className="solo-link link-secondary link-back">
                                view terms of use agreement
                            </Link>
                        </div>
                    </div>
                );
                production = (
                    <div className="network">
                        <div className="type box box--flex center--y center--XxX">
                            <div className="name">Production</div>
                        </div>
                        <div className="date box box--flex center--y center--XxX">
                            <div>
                                Signed on {signedTerm.created.substr(0, 10)}
                            </div>
                        </div>
                        <div className="author box box--flex center--y center--XxX">
                            <div>
                                Signed by{' '}
                                {signedTerm.signatureData.firstName +
                                    ' ' +
                                    signedTerm.signatureData.lastName}
                            </div>
                        </div>
                        <div className="view box box--flex center--y center--XxX">
                            <Link
                                to={{
                                    pathname: '/dashboard/account/terms-of-use',
                                    state: {
                                        type: 'CORDANETWORK',
                                    },
                                }}
                                className="solo-link link-secondary link-back">
                                view terms of use agreement
                            </Link>
                        </div>
                    </div>
                );
                signerProduction = (
                    <div className="network">
                        <div className="type box box--flex center--y center--XxX">
                            <div className="name">Production</div>
                        </div>
                        <div className="date box box--flex center--y center--XxX">
                            <div>
                                Signed on {signedTerm.created.substr(0, 10)}
                            </div>
                        </div>
                        <div className="author box box--flex center--y center--XxX">
                            <div>
                                Signed by{' '}
                                {signedTerm.signatureData.firstName +
                                    ' ' +
                                    signedTerm.signatureData.lastName}
                            </div>
                        </div>
                        <div className="view box box--flex center--y center--XxX">
                            <Link
                                to={{
                                    pathname: '/dashboard/account/terms-of-use',
                                    state: {
                                        type: 'CORDANETWORK',
                                    },
                                }}
                                className="solo-link link-secondary link-back">
                                view terms of use agreement
                            </Link>
                        </div>
                    </div>
                );
            }
            return null;
        });

        return (
            <div className="active-networks bg-white">
                <div className="dsh-header box box--flex center--XxX center--y">
                    <div className="heading box--flex center--y">
                        <i className="hidden mdi mdi-lan"></i>
                        <i className="mdi mdi-clipboard-check-outline"></i>
                        <span>Terms of Use</span>
                    </div>
                </div>
                {this.props.upr.role === 'signer' &&
                    this.state.pendingProductionTerms && (
                        <Fragment>
                            <NavLink
                                to="/dashboard/account/sign-terms"
                                className="upgrade-link">
                                You have pending signature request
                            </NavLink>
                        </Fragment>
                    )}
                {this.props.upr.role === 'signer' &&
                    !this.state.pendingProductionTerms && (
                        <Fragment>
                            <div className="h-splitter first"></div>
                            {signerPreProduction}
                            <div className="h-splitter"></div>
                            {signerProduction}
                        </Fragment>
                    )}
                {this.props.upr.role === 'user' && (
                    <Fragment>
                        <div className="h-splitter first"></div>
                        {preProduction}
                        <div className="h-splitter"></div>
                        {production}
                    </Fragment>
                )}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        str: state.str.terms,
        upr: state.upr,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
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
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ActiveNetworks);
