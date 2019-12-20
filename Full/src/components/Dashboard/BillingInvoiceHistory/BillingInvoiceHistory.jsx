import React, { Component } from 'react';
import './BillingInvoiceHistory.scss';

class BillingInvoiceHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="billing-invoice-history bg-white">
                <div className="dsh-header box box--flex center--XxX center--y">
                    <div className="heading box--flex center--y">
                        <i className="mdi mdi-file-document-outline"></i>
                        <span>Invoice History</span>
                    </div>
                    {/* <i className="mdi mdi-pencil-outline edit"></i> */}
                </div>
                <div className="h-splitter"></div>
                {/* <div className="invoice box--flex center--y center--XxX">
                    <div className="date">01-10-2019</div>
                    <div className="sum">$250.00</div>
                    <div className="pdf">PDF</div>
                </div>
                <div className="invoice box--flex center--y center--XxX">
                    <div className="date">01-10-2019</div>
                    <div className="sum">$250.00</div>
                    <div className="pdf">PDF</div>
                </div>
                <div className="invoice box--flex center--y center--XxX">
                    <div className="date">01-10-2019</div>
                    <div className="sum">$250.00</div>
                    <div className="pdf">PDF</div>
                </div>
                <div className="invoice box--flex center--y center--XxX">
                    <div className="date">01-10-2019</div>
                    <div className="sum">$250.00</div>
                    <div className="pdf">PDF</div>
                </div>
                <div className="invoice box--flex center--y center--XxX">
                    <div className="date">01-10-2019</div>
                    <div className="sum">$250.00</div>
                    <div className="pdf">PDF</div>
                </div>

                <a href="" className="link-secondary">
                    show all invoices
                </a> */}

                <div className="under-construction box--flex--column center--x center--y">
                    <i className="mdi mdi-monitor-dashboard"></i>
                    <p className="text-center">
                        This feature is under construction.
                    </p>
                </div>
            </div>
        );
    }
}

export default BillingInvoiceHistory;
