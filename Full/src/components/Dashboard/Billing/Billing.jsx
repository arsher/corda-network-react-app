import React, { Component } from 'react';
import { connect } from 'react-redux';
import LoadingOverlay from 'react-loading-overlay';
import './Billing.scss';
import BillingDetails from '../BillingDetails/BillingDetails';
import { handleApiError } from '../../../utils/utils';
import {
    axiosParticipantPrimaryGET,
    axiosBillingDetailsGET,
} from '../../../axios/axios';
import * as actionTypes from '../../../store/actions';
import BillingInvoiceHistory from '../BillingInvoiceHistory/BillingInvoiceHistory';
import BillingTransactions from '../BillingTransactions/BillingTransactions';

class Billing extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            companyDetails: null,
            billingDetails: null,
            // allDataLoaded: false,
        };
    }

    componentDidMount() {
        axiosBillingDetailsGET()
            .then((response) => {
                this.setState({
                    billingDetails: response.data,
                });
                this.props.onSetBillingDetails(response.data);
            })
            .then(() => {
                if (Object.keys(this.props.ler.legalEntity).length === 0) {
                    axiosParticipantPrimaryGET().then((response) => {
                        this.setState({
                            companyDetails: response.data,
                        });
                        this.props.onSetParticipantType(response.data.type);
                        this.props.onSetLegalEntity(response.data);
                        this.setState({
                            companyDetails: this.props.ler.legalEntity,
                            isLoading: false,
                        });
                    });
                } else {
                    this.setState({
                        companyDetails: this.props.ler.legalEntity,
                    });
                    this.setState({
                        isLoading: false,
                    });
                }
            })
            .catch((err) => {
                handleApiError(err);
                this.setState({
                    isLoading: false,
                });
            });
    }

    isAllDataLoaded() {
        return !!this.state.companyDetails && !!this.state.billingDetails;
    }

    render() {
        const { companyDetails, billingDetails } = this.state;
        const isAllDataLoaded = this.isAllDataLoaded();
        return (
            <LoadingOverlay
                active={this.state.isLoading}
                spinner
                text="Loading...">
                {isAllDataLoaded && (
                    <div className="container-fluid bg-ghost-white">
                        <div className="row billing-container">
                            <div className="col-4 offset-1">
                                <BillingTransactions />
                                <BillingInvoiceHistory />
                            </div>
                            <div className="col-6">
                                <BillingDetails
                                    companyDetails={companyDetails}
                                    billingDetails={billingDetails}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </LoadingOverlay>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        ler: state.ler,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onSetLegalEntity: (legalEntity) =>
            dispatch({
                type: actionTypes.SET_LEGAL_ENTITY,
                legalEntity: legalEntity,
            }),
        onSetBillingDetails: (billingDetails) =>
            dispatch({
                type: actionTypes.SET_BILLING_DETAILS,
                billingDetails: billingDetails,
            }),
        onSetParticipantType: (type) =>
            dispatch({
                type: actionTypes.SET_PARTICIPANT_TYPE,
                participantType: type,
            }),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Billing);
