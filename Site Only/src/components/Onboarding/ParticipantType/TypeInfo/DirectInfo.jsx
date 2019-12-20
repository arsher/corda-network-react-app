import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import CustomerAgreement from './CustomerAgreement';

export default class DirectInfo extends Component {
    render() {
        return (
            <Fragment>
                <div className="p-small learn-more bg-ghost-white text-left mt-40">
                    <p className="standard-label">A direct participant will:</p>
                    <p>
                        1. Sign a Terms of Use (non-commercial legal agreement)
                        directly with the Corda Network Foundation.
                    </p>
                    <p>
                        2. Have their legal entity checked by the Foundation, to
                        not be on a Sanctions list, before being applying for a
                        participation certificate.
                    </p>
                    <p>
                        3. Be invoiced by the Foundation for some low fees to
                        ensure costs of running the network are covered. For
                        information on fees,{' '}
                        <Link to="/participation/membership-tiers">
                            see here.
                        </Link>
                    </p>
                </div>
                <CustomerAgreement />
            </Fragment>
        );
    }
}
