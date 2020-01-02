import React from 'react';
import './IdentityChecks.scss';

class IdentityChecksFailed extends React.Component {
    render() {
        return (
            <div className="identity-checks bg-white">
                <div className="card">
                    <div className="card-body text-center">
                        <i className="mdi mdi-progress-alert"></i>
                        <p className="subtitle">Identity Checks Failed</p>
                        <div className="h-splitter"></div>
                        <p className="px-10">
                            There is a question with your application. We will
                            be in touch soon over email about progress.
                        </p>
                        <div className="h-splitter"></div>
                        <div className="box--flex center--xXx">
                            <button
                                type="button"
                                value="text"
                                className="btn link-secondary m-0">
                                Log out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default IdentityChecksFailed;
