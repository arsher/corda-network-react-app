import React from 'react';
import './IdentityChecks.scss';

class IdentityChecksWrong extends React.Component {

    render() {
        return (
            <div className="identity-checks bg-white">
                <div className="card">
                    <div className="card-body text-center">
                        <i className="mdi mdi-progress-alert"></i>
                        <p className="subtitle">Identity Checks Failed</p>
                        <div className="h-splitter"></div>
                        <p className="px-10">
                            {this.props.failReason} Please search for the
                            correct legal entity name again.
                        </p>
                        <div className="h-splitter"></div>
                        <div className="box--flex center--xXx">
                            <button
                                type="button"
                                value="text"
                                className="btn btn-primary m-0">
                                Find correct entity name
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default IdentityChecksWrong;
