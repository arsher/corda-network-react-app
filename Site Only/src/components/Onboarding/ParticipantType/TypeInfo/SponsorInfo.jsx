import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import CustomerAgreement from './CustomerAgreement';

export default class SponsorInfo extends Component {
    render() {
        return (
            <Fragment>
                <div className="p-small learn-more bg-ghost-white text-left mt-40">
                    <p className="standard-label">
                        A sponsoring participant will:
                    </p>
                    <p>
                        1. Sign a Terms of Use with the Corda Network
                        Foundation, which covers their node (if they have one)
                        and their Sponsee nodes, for access to all of Corda
                        Network. Sponsors should pass on relevant clauses to
                        their sponsees’ agreements. Sponsee nodes should later
                        upgrade to become a direct member, if they wish to join
                        a second business network.
                    </p>
                    <p>
                        2. Do light identity checks on their sponsee nodes,
                        before forwarding on node names to the Foundation, for
                        records.
                    </p>
                    <p>
                        3. Be invoiced by the Foundation for some low fees for
                        its sponsee nodes, including for their transactions. Low
                        fees exist to cover the costs of running the network –
                        for more information,{' '}
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
