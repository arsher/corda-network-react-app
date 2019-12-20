import React from 'react';
import './SponsoredParticipantsTable.scss';
import LoadingOverlay from 'react-loading-overlay';
import SponsoredParticipantsTableRow from './SponsoredParticipantsTableRow';
import * as actionTypes from './../../store/actions';
import { connect } from 'react-redux';
import { axiosParticipantPrimaryGET } from './../../axios/axios';
import ReactPaginate from 'react-paginate';

class SponsoredParticipantsTable extends React.Component {
    constructor(props) {
        super(props);
        this.props.onStartLoader();
        this.state = {
            sponsoredParticipants: [],
            paginatedSponsoredParticipants: [],
            sponsoredParticipantsPageCount: 10,
            isLoading: true,
        };
    }

    componentDidMount() {
        axiosParticipantPrimaryGET().then((participant) => {
            this.setState({
                sponsoredParticipants: participant.data.sponsored,
                paginatedSponsoredParticipants: participant.data.sponsored.slice(
                    0,
                    this.state.sponsoredParticipantsPageCount
                ),
            });
            this.props.onSetParticipantType(participant.data.type);
            this.props.onSetLegalEntity(participant.data);
            this.setState({ isLoading: false });
        });
    }

    handleNextAction() {
        this.props.goToAddParticipant();
    }

    goToSetUpNodeInfo() {
        this.props.onGoToSetUpNodeInfo();
    }

    handlePaginationPageClick = (e) => {
        const users = Array.from(this.state.sponsoredParticipants);
        const paginatedSponsoredParticipants = users.splice(
            e.selected * 10,
            this.state.sponsoredParticipantsPageCount
        );
        this.setState({
            paginatedSponsoredParticipants: paginatedSponsoredParticipants,
            resetterPagination: e.selected,
        });
    };

    render() {
        return (
            <div className="sponsored-participants-table">
                <LoadingOverlay
                    active={this.state.isLoading}
                    spinner
                    text="Loading...">
                    <div className="add-participant box--flex center--xxX">
                        <button
                            className="btn btn-secondary btn-set-up"
                            onClick={this.goToSetUpNodeInfo.bind(this)}>
                            How to set up a node
                        </button>
                        <button
                            className="btn btn-primary ml-30"
                            onClick={this.handleNextAction.bind(this)}>
                            Add participant
                        </button>
                    </div>
                    <div className="card">
                        <header className="box--flex center--XxX center--y bg-white">
                            <h1>Sponsored Participants</h1>
                        </header>
                        <div className="table bg-white">
                            <div className="row table-header m-0 bg-ghost-white">
                                <div className="col-4 company box--flex center--Xxx">
                                    Company
                                </div>
                                <div className="col-3 country box--flex center--Xxx">
                                    Country
                                </div>
                                <div className="col-2 status box--flex center--Xxx">
                                    Status
                                </div>
                                <div className="col-3 confirmed-on box--flex center--xxX">
                                    Submitted on
                                </div>
                            </div>
                            <div className="table-body">
                                {this.state.sponsoredParticipants.length ? (
                                    this.state.paginatedSponsoredParticipants.map(
                                        (participant) => {
                                            return (
                                                <SponsoredParticipantsTableRow
                                                    participant={participant}
                                                    key={participant.id}
                                                />
                                            );
                                        }
                                    )
                                ) : (
                                    <div className="no-participants">
                                        <i className="mdi mdi-account-plus-outline"></i>
                                        <div className="subtitle">
                                            There are no participants yet!
                                        </div>
                                        <p>
                                            Please, select the “Add Participant”
                                            button above, to add your first
                                            participant
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                        {this.state.sponsoredParticipants.length > 10 && (
                            <ReactPaginate
                                previousLabel={'<'}
                                nextLabel={'>'}
                                breakLabel={'...'}
                                breakClassName={'break-me'}
                                pageCount={Math.ceil(
                                    this.state.sponsoredParticipants.length /
                                        this.state
                                            .sponsoredParticipantsPageCount
                                )}
                                marginPagesDisplayed={3}
                                pageRangeDisplayed={3}
                                forcePage={this.state.resetterPagination}
                                onPageChange={(e) => {
                                    this.handlePaginationPageClick(e);
                                }}
                                containerClassName={'paginator'}
                                subContainerClassName={'pages pagination'}
                                activeClassName={'active'}
                            />
                        )}
                    </div>
                </LoadingOverlay>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        ler: state.ler.legalEntity,
        loader: state.loader,
        csr: state.csr,
        uar: state.uar,
        cnr: state.cnr,
        ptr: state.ptr,
        str: state.str,
        sponsorCurrentStepReducer: state.sponsorCurrentStepReducer,
        sponsoredLegalEntityReducer:
            state.sponsoredLegalEntityReducer.legalEntity,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onStartLoader: () =>
            dispatch({
                type: actionTypes.START_LOADER,
                isLoading: true,
            }),
        onStopLoader: () =>
            dispatch({
                type: actionTypes.STOP_LOADER,
                isLoading: false,
            }),
        goToAddParticipant: () =>
            dispatch({
                type: actionTypes.SPONSOR_SELECT_LEGAL_ENTITY,
            }),
        onSetParticipantType: (type) =>
            dispatch({
                type: actionTypes.SET_PARTICIPANT_TYPE,
                participantType: type,
            }),
        onSetLegalEntity: (legalEntity) =>
            dispatch({
                type: actionTypes.SET_LEGAL_ENTITY,
                legalEntity: legalEntity,
            }),
        onGoToSetUpNodeInfo: () =>
            dispatch({
                type: actionTypes.SPONSEES_HOW_TO_SET_UP_A_NODE,
            }),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SponsoredParticipantsTable);
