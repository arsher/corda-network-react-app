import React, { Component } from 'react';
import './AccountContacts.scss';
import { connect } from 'react-redux';

class AccountContacts extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uatSignerNames: '',
            uatSignerEmail: '',
            cordanetworkSignerNames: '',
            cordaNetworkSignerEmail: '',
        };
    }

    componentDidMount() {
        this.props.str.map((signedTerm) => {
            if (signedTerm.agreementContext === 'UAT') {
                this.setState({
                    uatSignerNames:
                        signedTerm.signatureData.firstName +
                        ' ' +
                        signedTerm.signatureData.lastName,
                    uatSignerEmail: signedTerm.signatureData.email,
                });
            } else if (signedTerm.agreementContext === 'CORDANETWORK') {
                this.setState({
                    cordanetworkSignerNames:
                        signedTerm.signatureData.firstName +
                        ' ' +
                        signedTerm.signatureData.lastName,
                    cordanetworkSignerEmail: signedTerm.signatureData.email,
                });
            }
        });
    }

    render() {
        return (
            <div className="account-contacts">
                <div className="contact">
                    <div className="type">registered user</div>
                    <div className="names box box--flex center--y center--xXX">
                        <i className="mdi mdi-account-outline"></i>
                        <span>
                            {this.props.upr.names ? this.props.upr.names : '-'}
                        </span>
                    </div>
                    <div className="email box box--flex center--y center--xXX">
                        <i className="mdi mdi-email-outline"></i>
                        <span>
                            {this.props.upr.email ? this.props.upr.email : '-'}
                        </span>
                    </div>
                </div>
                <div className="contact">
                    <div className="type">pre-production tou signer</div>
                    <div className="names box box--flex center--y center--xXX">
                        <i className="mdi mdi-account-outline"></i>
                        <span>
                            {this.state.uatSignerNames
                                ? this.state.uatSignerNames
                                : this.state.cordanetworkSignerNames
                                ? this.state.cordanetworkSignerNames
                                : '-'}
                        </span>
                    </div>
                    <div className="email box box--flex center--y center--xXX">
                        <i className="mdi mdi-email-outline"></i>
                        <span>
                            {this.state.uatSignerEmail
                                ? this.state.uatSignerEmail
                                : this.state.cordanetworkSignerEmail
                                ? this.state.cordanetworkSignerEmail
                                : '-'}
                        </span>
                    </div>
                </div>
                <div className="contact">
                    <div className="type">production tou signer</div>
                    <div className="names box box--flex center--y center--xXX">
                        <i className="mdi mdi-account-outline"></i>
                        <span>
                            {this.state.cordanetworkSignerNames
                                ? this.state.cordanetworkSignerNames
                                : '-'}
                        </span>
                    </div>
                    <div className="email box box--flex center--y center--xXX">
                        <i className="mdi mdi-email-outline"></i>
                        <span>
                            {this.state.cordanetworkSignerEmail
                                ? this.state.cordanetworkSignerEmail
                                : '-'}
                        </span>
                    </div>
                </div>
                <div className="contact">
                    <div className="type">billing contact</div>
                    <div className="names box box--flex center--y center--xXX">
                        <i className="mdi mdi-account-outline"></i>
                        <span>
                            {this.props.bdr.contactName
                                ? this.props.bdr.contactName
                                : '-'}
                        </span>
                    </div>
                    <div className="email box box--flex center--y center--xXX">
                        <i className="mdi mdi-email-outline"></i>
                        <span>
                            {this.props.bdr.contactEmail
                                ? this.props.bdr.contactEmail
                                : '-'}
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        upr: state.upr,
        bdr: state.bdr.billingDetails,
        str: state.str.terms,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountContacts);
