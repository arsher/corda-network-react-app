import React from 'react';
import './Membership.scss';

const Membership = () => {
    return (
        <div className="membership-status bg-white">
            <div className="dsh-header box box--flex center--XxX center--y">
                <div className="heading box--flex center--y">
                    <i className="mdi mdi-account-badge-horizontal-outline"></i>
                    <span>Membership Status</span>
                </div>
                <div className="label--success">active</div>
            </div>
        </div>
    );
};

export default Membership;
