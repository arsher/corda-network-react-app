import React from 'react';
import './SponsorRole.scss';
import { connect } from 'react-redux';
import * as actionTypes from '../../../../store/actions';

const SponsorRole = (props) => {
    return (
        <div className="sponsor-role">
            <div className="card">
                <div className="card-body">
                    <i className="mdi mdi-information-outline text-center"></i>
                    <div className="subtitle text-center mb-15">
                        Before You Continue
                    </div>
                    <div className="h-splitter"></div>
                    <p className="p-small">
                        The role of a “Sponsor” was created based on customer
                        demand, as an ‘intermediary role’. It empowers a
                        business network operator or other network participant
                        to onboard other nodes onto Corda Network, without them
                        (the sponsored nodes) to have to interact directly with
                        the Foundation. The Sponsor instead interacts with the
                        Foundation on their behalf.
                    </p>
                    <div className="p-small">
                        <p>
                            When we talk about a Sponsor, we mean a legal entity
                            who:
                        </p>
                        <p>
                            1. Signs a Terms of Use legal agreement on behalf of
                            nodes they’re onboarding (the Sponsoring Participant
                            Terms of Use)
                        </p>
                        <p>
                            2. Sends the Foundation all X500 names on behalf of
                            all nodes (which have been pre-checked on government
                            trade registers and sanctions watchlists)
                        </p>
                        <p>
                            3. Inputs their billing information and handles any
                            payments on behalf of their nodes
                        </p>
                    </div>
                    <p className="p-small">
                        At a minimum this must cover #1, and there’s possibility
                        of flexibility on #2 (how the information is sent to the
                        Foundation) depending on how the onboarding process is
                        designed to work from the Sponsor’s side.
                    </p>
                    <div className="p-small mb-20">
                        <p>
                            Ultimately, every node on the network must be
                            ‘covered’ by a PTOU, whether sponsored or direct.
                            The TOU covers some basic rules about behaviour on
                            the network for all nodes (including: clauses on
                            using the right identity, not committing fraudulent
                            or otherwise illegal behaviour via your nodes’
                            transactions (the contents of which is not seen by
                            anyone other than the parties in the transaction),
                            liability, indemnity, warranty..)
                        </p>
                    </div>
                    <div className="h-splitter"></div>

                    <div className="box--flex center--XxX center--y">
                        <button
                            type="button"
                            data-toggle="button"
                            aria-pressed="false"
                            className="btn btn-link btn-back"
                            onClick={() => props.onBack()}>
                            Back
                        </button>
                        <button
                            type="button"
                            value="text"
                            className="btn btn-primary m-0"
                            onClick={() => props.onConfirmParticipantType()}>
                            Continue
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        ler: state.ler.legalEntity,
        loader: state.loader,
        csr: state.csr,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onConfirmParticipantType: () =>
            dispatch(
                {
                    type: actionTypes.CURRENT_STEP_SELECT_LEGAL_ENTITY,
                },
                dispatch({
                    type: actionTypes.SET_PARTICIPANT_TYPE,
                    participantType: 'sponsor',
                })
            ),
        onBack: () =>
            dispatch({
                type: actionTypes.CURRENT_STEP_SELECT_PARTICIPANT_TYPE,
            }),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SponsorRole);
