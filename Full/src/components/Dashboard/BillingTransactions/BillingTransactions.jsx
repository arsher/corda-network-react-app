import React, { Component } from 'react';
import './BillingTransactions.scss';

class BillingTransactions extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="billing-transactions bg-white">
                <div className="dsh-header box box--flex center--XxX center--y">
                    <div className="heading box--flex center--y">
                        <i className="mdi mdi-arrow-decision"></i>
                        <span>Transactions</span>
                    </div>
                    {/* <i className="mdi mdi-pencil-outline edit"></i> */}
                </div>
                <div className="h-splitter"></div>
                {/* <div className="total">2500</div>
                <div className="from-to">01-10-2019 - 01-11-2019</div> */}
                <div className="under-construction box--flex--column center--x center--y">
                    <i className="mdi mdi-monitor-dashboard"></i>
                    <p>This feature is under construction.</p>
                </div>
            </div>
        );
    }
}

export default BillingTransactions;
