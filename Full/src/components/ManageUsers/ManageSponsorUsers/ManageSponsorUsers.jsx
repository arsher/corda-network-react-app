import React from 'react';
import './ManageSponsorUsers.scss';
import LoadingOverlay from 'react-loading-overlay';
import TableRow from '../TableRow';
import { axiosAccountsGET } from '../../../axios/axios';
import ReactPaginate from 'react-paginate';
import { connect } from 'react-redux';
import * as actionTypes from '../../../store/actions';
import { handleApiError } from '../../../utils/utils';

class ManageSponsorUsers extends React.Component {
    _isMounted = false;

    constructor(props) {
        super(props);

        this.state = {
            activeUsers: [],
            pendingUsers: [],
            currentlyShownUsers: [],
            paginatedCurrentlyShownUsers: [],
            currentlyShownType: 'pending',
            participantsType: 'sponsor',
            participantsPageCount: 10,
            areParticipantsSortedAtoZ: false,
            areParticipantsSortedZtoA: false,
            areCountriesSortedAtoZ: false,
            areCountriesSortedZtoA: false,
            resetterPaginationPage: 0,
            isPageLoading: true,
        };

        this.setActiveUsers = this.setActiveUsers.bind(this);
        this.setPendingUsers = this.setPendingUsers.bind(this);
        this.handleApproval = this.handleApproval.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
        this.fetchParticipants();
    }

    setActiveUsers(e) {
        e.persist();
        let activeUsers = this.state.activeUsers;
        if (this.state.currentlyShownUsers !== activeUsers) {
            this.setState({
                currentlyShownUsers: activeUsers,
                currentlyShownType: 'active',
                paginatedCurrentlyShownUsers: activeUsers.slice(
                    0,
                    this.state.participantsPageCount
                ),
            });
        }
    }

    setPendingUsers(e) {
        e.persist();
        let pendingUsers = this.state.pendingUsers;
        if (this.state.currentlyShownUsers !== pendingUsers) {
            this.setState({
                currentlyShownUsers: pendingUsers,
                currentlyShownType: 'pending',
                paginatedCurrentlyShownUsers: pendingUsers.slice(
                    0,
                    this.state.participantsPageCount
                ),
            });
        }
    }

    handlePaginationPageClick = (e) => {
        const users = Array.from(this.state.currentlyShownUsers);
        const paginatedCurrentlyShownUsers = users.splice(
            e.selected * 10,
            this.state.participantsPageCount
        );
        this.setState({
            paginatedCurrentlyShownUsers: paginatedCurrentlyShownUsers,
            resetterPagination: e.selected,
        });
    };

    handleApproval() {
        this.fetchParticipants();
    }

    fetchParticipants() {
        this.setState({
            isPageLoading: true,
        });

        let users;
        let activeUsers;
        let pendingUsers;

        axiosAccountsGET()
            .then((response) => {
                const mappedParticipants = response.data.map((participant) => {
                    return {
                        id: participant.id,
                        name: participant.name,
                        created: participant.created.substr(0, 10),
                        externalId: participant.externalId,
                        country: participant.address.addressCountry.name,
                        eligibilityStatus: participant.eligibilityCheck
                            ? participant.eligibilityCheck.status
                            : 'missing',
                        eligibilityId: participant.eligibilityCheck
                            ? participant.eligibilityCheck.id
                            : null,
                        incortorationDate: 'no info',
                        address:
                            participant.address.streetAddress.line1 +
                            ' ' +
                            participant.address.streetAddress.line2,
                        x500Name: 'todo',
                        nodeEmail: participant.name,
                        status: participant.identityCheck.status,
                        type: participant.type,
                        userId: participant.userIds[0],
                        billingInfo: participant.billingInfo,
                        sponsored: participant.sponsored,
                    };
                });
                users = mappedParticipants;
            })
            .then(() => {
                activeUsers = users.filter((user) => {
                    return user.status === 'SUCCESS' && user.type === 'SPONSOR';
                });
                pendingUsers = users.filter((user) => {
                    return user.status === 'PENDING' && user.type === 'SPONSOR';
                });
                if (this._isMounted) {
                    this.setState({
                        activeUsers: activeUsers.reverse(),
                        pendingUsers: pendingUsers.reverse(),
                        currentlyShownUsers: pendingUsers,
                        currentlyShownType: 'pending',
                        paginatedCurrentlyShownUsers: pendingUsers.slice(
                            0,
                            this.state.participantsPageCount
                        ),
                        isPageLoading: false,
                    });
                }
            })
            .catch((err) => {
                handleApiError(err);

                this.setState({
                    isPageLoading: false,
                });
            });
    }

    sortParticipants() {
        let orderedCurrentlyShownUsers;
        if (this.state.areParticipantsSortedAtoZ) {
            orderedCurrentlyShownUsers = this.state.currentlyShownUsers.sort(
                (a, b) => b.name.localeCompare(a.name)
            );
            this.setState({
                currentlyShownUsers: orderedCurrentlyShownUsers,
                paginatedCurrentlyShownUsers: this.state.currentlyShownUsers.slice(
                    0,
                    this.state.participantsPageCount
                ),
                areParticipantsSortedAtoZ: false,
                areParticipantsSortedZtoA: true,
                resetterPagination: 0,
            });

            const users = Array.from(this.state.currentlyShownUsers);
            const paginatedCurrentlyShownUsers = users.splice(
                0,
                this.state.participantsPageCount
            );
            this.setState({
                paginatedCurrentlyShownUsers: paginatedCurrentlyShownUsers,
            });
        } else if (this.state.areParticipantsSortedZtoA) {
            orderedCurrentlyShownUsers = this.state.currentlyShownUsers.sort(
                (a, b) => a.name.localeCompare(b.name)
            );
            this.setState({
                currentlyShownUsers: orderedCurrentlyShownUsers,
                paginatedCurrentlyShownUsers: this.state.currentlyShownUsers.slice(
                    0,
                    this.state.participantsPageCount
                ),
                areParticipantsSortedAtoZ: true,
                areParticipantsSortedZtoA: false,
                resetterPagination: 0,
            });

            const users = Array.from(this.state.currentlyShownUsers);
            const paginatedCurrentlyShownUsers = users.splice(
                0,
                this.state.participantsPageCount
            );
            this.setState({
                paginatedCurrentlyShownUsers: paginatedCurrentlyShownUsers,
            });
        } else if (
            !this.state.areParticipantsSortedAtoZ &&
            !this.state.areParticipantsSortedZtoA
        ) {
            orderedCurrentlyShownUsers = this.state.currentlyShownUsers.sort(
                (a, b) => a.name.localeCompare(b.name)
            );
            this.setState({
                currentlyShownUsers: orderedCurrentlyShownUsers,
                paginatedCurrentlyShownUsers: this.state.currentlyShownUsers.slice(
                    0,
                    this.state.participantsPageCount
                ),
                areParticipantsSortedAtoZ: true,
                areParticipantsSortedZtoA: false,
                resetterPagination: 0,
            });

            const users = Array.from(this.state.currentlyShownUsers);
            const paginatedCurrentlyShownUsers = users.splice(
                0,
                this.state.participantsPageCount
            );
            this.setState({
                paginatedCurrentlyShownUsers: paginatedCurrentlyShownUsers,
            });
        }
    }

    sortCountries() {
        let orderedCurrentlyShownUsers;
        if (this.state.areCountriesSortedAtoZ) {
            orderedCurrentlyShownUsers = this.state.currentlyShownUsers.sort(
                (a, b) => b.country.localeCompare(a.country)
            );
            this.setState({
                currentlyShownUsers: orderedCurrentlyShownUsers,
                paginatedCurrentlyShownUsers: this.state.currentlyShownUsers.slice(
                    0,
                    this.state.participantsPageCount
                ),
                areCountriesSortedAtoZ: false,
                areCountriesSortedZtoA: true,
                resetterPagination: 0,
            });

            const users = Array.from(this.state.currentlyShownUsers);
            const paginatedCurrentlyShownUsers = users.splice(
                0,
                this.state.participantsPageCount
            );
            this.setState({
                paginatedCurrentlyShownUsers: paginatedCurrentlyShownUsers,
            });
        } else if (this.state.areCountriesSortedZtoA) {
            orderedCurrentlyShownUsers = this.state.currentlyShownUsers.sort(
                (a, b) => a.country.localeCompare(b.country)
            );
            this.setState({
                currentlyShownUsers: orderedCurrentlyShownUsers,
                paginatedCurrentlyShownUsers: this.state.currentlyShownUsers.slice(
                    0,
                    this.state.participantsPageCount
                ),
                areCountriesSortedAtoZ: true,
                areCountriesSortedZtoA: false,
                resetterPagination: 0,
            });

            const users = Array.from(this.state.currentlyShownUsers);
            const paginatedCurrentlyShownUsers = users.splice(
                0,
                this.state.participantsPageCount
            );
            this.setState({
                paginatedCurrentlyShownUsers: paginatedCurrentlyShownUsers,
            });
        } else if (
            !this.state.areCountriesSortedAtoZ &&
            !this.state.areCountriesSortedZtoA
        ) {
            orderedCurrentlyShownUsers = this.state.currentlyShownUsers.sort(
                (a, b) => a.country.localeCompare(b.country)
            );
            this.setState({
                currentlyShownUsers: orderedCurrentlyShownUsers,
                paginatedCurrentlyShownUsers: this.state.currentlyShownUsers.slice(
                    0,
                    this.state.participantsPageCount
                ),
                areCountriesSortedAtoZ: true,
                areCountriesSortedZtoA: false,
                resetterPagination: 0,
            });

            const users = Array.from(this.state.currentlyShownUsers);
            const paginatedCurrentlyShownUsers = users.splice(
                0,
                this.state.participantsPageCount
            );
            this.setState({
                paginatedCurrentlyShownUsers: paginatedCurrentlyShownUsers,
            });
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    startLoader() {
        this.setState({
            isPageLoading: true,
        });
    }

    stopLoader() {
        this.setState({
            isPageLoading: false,
        });
    }

    render() {
        return (
            <LoadingOverlay
                active={this.state.isPageLoading}
                spinner
                text="Loading...">
                <div className="container-fluid bg-ghost-white">
                    <div className="row manage-direct-users-container">
                        <div className="col-10 offset-1">
                            <div className="card">
                                <header className="box--flex center--XxX center--y bg-white">
                                    <h1>Sponsor Users</h1>
                                    <div className="tab-slider">
                                        <ul
                                            className={
                                                this.state
                                                    .currentlyShownType ===
                                                'active'
                                                    ? 'tab-slider-tabs slide'
                                                    : 'tab-slider-tabs'
                                            }>
                                            <li
                                                className={
                                                    this.state
                                                        .currentlyShownType ===
                                                    'pending'
                                                        ? 'tab-slider-trigger active'
                                                        : 'tab-slider-trigger'
                                                }
                                                onClick={this.setPendingUsers}>
                                                Pending
                                            </li>
                                            <li
                                                className={
                                                    this.state
                                                        .currentlyShownType ===
                                                    'active'
                                                        ? 'tab-slider-trigger active'
                                                        : 'tab-slider-trigger'
                                                }
                                                onClick={this.setActiveUsers}>
                                                Active
                                            </li>
                                        </ul>
                                    </div>
                                </header>

                                <div className="participants bg-white">
                                    <div className="row participants-header m-0 bg-ghost-white">
                                        {this.state.currentlyShownType ===
                                            'pending' && (
                                            <div
                                                onClick={() =>
                                                    this.sortParticipants()
                                                }
                                                className="col-5 company box--flex center--Xxx">
                                                Company
                                            </div>
                                        )}
                                        {this.state.currentlyShownType !==
                                            'pending' && (
                                            <div
                                                onClick={() =>
                                                    this.sortParticipants()
                                                }
                                                className="col-5 company box--flex center--Xxx">
                                                Company
                                            </div>
                                        )}
                                        {this.state.currentlyShownType !==
                                            'pending' && (
                                            <div className="col-2 company box--flex center--Xxx">
                                                Sponsees
                                            </div>
                                        )}
                                        <div
                                            onClick={() => this.sortCountries()}
                                            className="col-2 country box--flex center--Xxx">
                                            Country
                                        </div>
                                        {this.state.currentlyShownType ===
                                            'pending' && (
                                            <div className="col-3 box--flex center--Xxx">
                                                status
                                            </div>
                                        )}
                                        {this.state.currentlyShownType ===
                                            'pending' && (
                                            <div className="col-2 box--flex center--xxX">
                                                Submitted on
                                            </div>
                                        )}
                                        {this.state.currentlyShownType !==
                                            'pending' && (
                                            <div className="col-3 box--flex center--xxX">
                                                Submitted on
                                            </div>
                                        )}
                                    </div>
                                    <div className="participants-body">
                                        {this.state.paginatedCurrentlyShownUsers.map(
                                            (user, i) => {
                                                return (
                                                    <TableRow
                                                        currentlyShownType={
                                                            this.state
                                                                .currentlyShownType
                                                        }
                                                        participantsType={
                                                            this.state
                                                                .participantsType
                                                        }
                                                        onApproval={
                                                            this.handleApproval
                                                        }
                                                        startLoader={() =>
                                                            this.startLoader()
                                                        }
                                                        stopLoader={() =>
                                                            this.stopLoader()
                                                        }
                                                        key={i}
                                                        user={user}
                                                    />
                                                );
                                            }
                                        )}
                                        {!this.state
                                            .paginatedCurrentlyShownUsers
                                            .length && (
                                            <div className="no-participants box box--flex--column center--x center--y">
                                                <div className="icon">
                                                    <i className="mdi mdi-account-plus-outline"></i>
                                                </div>
                                                <div className="text">
                                                    There are no participants in
                                                    this list
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {this.state.currentlyShownUsers.length > 10 && (
                                    <ReactPaginate
                                        previousLabel={'<'}
                                        nextLabel={'>'}
                                        breakLabel={'...'}
                                        breakClassName={'break-me'}
                                        pageCount={
                                            this.state.currentlyShownUsers
                                                .length /
                                            this.state.participantsPageCount
                                        }
                                        marginPagesDisplayed={3}
                                        pageRangeDisplayed={3}
                                        forcePage={
                                            this.state.resetterPagination
                                        }
                                        onPageChange={(e) => {
                                            this.handlePaginationPageClick(e);
                                        }}
                                        containerClassName={'paginator'}
                                        subContainerClassName={
                                            'pages pagination'
                                        }
                                        activeClassName={'active'}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </LoadingOverlay>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        uar: state.uar,
        loader: state.loader,
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
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSponsorUsers);
