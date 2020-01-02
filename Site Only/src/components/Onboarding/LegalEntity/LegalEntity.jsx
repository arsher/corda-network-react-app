import React, { Component } from 'react';
import './LegalEntity.scss';
import Aux from '../../../hoc/Auxillary/Auxillary';
import ReactPaginate from 'react-paginate';
import { states } from '../../../helpers/usa-states';
import { connect } from 'react-redux';
import * as actionTypes from '../../../store/actions';
import Tooltip from './../../Tooltip/Tooltip';
import { axiosSearchCompanies } from '../../../axios/axios';
import Select from 'react-select';
import CustomValueContainer from './../../../containers/CustomValueContainer/CustomValueContainer';
import { handleApiError } from '../../../utils/utils';
import CountdownTimer from '../../CoundownTimer/CountdownTimer';
import { SPECIAL_CHARS_REGEX } from '../../../utils/constant';

class LegalEntity extends Component {
    constructor(props) {
        super(props);

        this.state = {
            companies: [],
            companiesLength: null,
            completedSearch: false,
            selectedCompanyIndex: -1,
            currentPaginationPage: 1,
            searchResultPageCount: 10,
            searchName: '',
            searchCountry: { label: '', value: '' },
            searchNearestCity: '',
            searchState: { label: '', value: '' },
            searchNumber: '',
            isSearchNameValid: false,
            isSearchNearestCityValid: false,
            isSearchStateValid: true,
            isSearchNumberValid: true,
            isCountrySelected: false,
            isStateSelected: false,
            oneMinuteThrottleInProgess: false, // api need no more than 1 request per minute
            isOnboardingCompleted:
                this.props.sponsorCurrentStepReducer.currentStep ===
                actionTypes.SPONSOR_SELECT_LEGAL_ENTITY,
        };
        this.selectSearchCountry = this.selectSearchCountry.bind(this);
        this.handleNextAction = this.handleNextAction.bind(this);
        this.selectUsaState = this.selectUsaState.bind(this);
    }

    findSelectedCountryIso2Code(countryName) {
        return this.props.countriesList.filter((country) => {
            return country.name === countryName;
        })[0].isoAlpha2Code;
    }

    searchCompanies(pageNumber) {
        if (pageNumber === 1) {
            this.setState({
                oneMinuteThrottleInProgess: true,
                currentPaginationPage: 1,
            });
        } else {
            this.setState({
                oneMinuteThrottleInProgess: true,
            });
        }

        setTimeout(() => {
            this.setState({
                oneMinuteThrottleInProgess: false,
            });
        }, 1 * 60 * 1000);

        this.props.onStartLoader();
        const searchPayload = {
            name: this.state.searchName,
            countryISOAlpha2Code: this.findSelectedCountryIso2Code(
                this.state.searchCountry
            ),
            addressLocality: this.state.searchNearestCity,
            pageNumber: pageNumber,
            state: this.state.searchState,
            signature: this.state.searchNumber,
        };

        axiosSearchCompanies(searchPayload)
            .then((list) => {
                const companies = list.data.matches;
                this.props.onStopLoader();
                this.setState({
                    companies: companies,
                    companiesLength: list.data.totalElements,
                    selectedCompanyIndex: -1,
                    completedSearch: true,
                });
            })
            .then(() => {
                this.refList.focus();
            })
            .catch((err) => {
                this.props.onStopLoader();
                handleApiError(err);
            });
    }

    handlePaginationPageClick = (e) => {
        this.setState({
            currentPaginationPage: e.selected + 1,
        });
        this.searchCompanies(e.selected + 1);
    };

    //SEARCH COMPANY NAME
    handleSearchNameChange(event) {
        this.setState({
            searchName: event.target.value,
            isSearchNameValid: this.validateSearchName(event.target.value),
        });
    }

    handleSearchNameBlur(event) {
        this.validateSearchName(event.target.value)
            ? (event.target.className = 'form-control entity-name is-valid')
            : (event.target.className = 'form-control entity-name is-invalid');
    }

    validateSearchName(name) {
        if (name.length < 2 || name.length > 128) {
            return false;
        } else if (!this.validateSpecialCharacters(name)) {
            return false;
        }
        return true;
    }

    // SEARCH COMPANY NUMBER
    handleSearchNumberChange(event) {
        this.setState({
            searchNumber: event.target.value,
            isSearchNumberValid: this.validateSearchNumber(event.target.value),
        });
    }

    handleSearchNumberBlur(event) {
        if (event.target.value.trim().length === 0) {
            return;
        }
        this.validateSearchNumber(event.target.value)
            ? (event.target.className = 'form-control is-valid')
            : (event.target.className = 'form-control is-invalid');
    }

    validateSearchNumber(number) {
        const numberToString = number.toString();
        if (numberToString.length !== 10 && numberToString.length !== 0) {
            return false;
        } else if (isNaN(+number)) {
            return false;
        } else {
            return true;
        }
    }

    // SEARCH NEAREST CITY
    handleSearchNearestCityChange(event) {
        this.setState({
            searchNearestCity: event.target.value,
            isSearchNearestCityValid: this.validateSearchNearestCity(
                event.target.value
            ),
        });
    }

    handleSearchNearestCityBlur(event) {
        this.validateSearchNearestCity(event.target.value)
            ? (event.target.className = 'form-control is-valid')
            : (event.target.className = 'form-control is-invalid');
    }

    validateSearchNearestCity(city) {
        if (city.length < 2 || city.length > 64) {
            return false;
        } else if (!this.validateSpecialCharacters(city)) {
            return false;
        }
        return true;
    }

    //SEARCH COUNTRY
    selectSearchCountry(e) {
        this.setState({
            searchCountry: e.label,
            isCountrySelected: true,
        });
    }

    // SEARCH STATE USA
    selectUsaState(state) {
        this.setState({
            searchState: state.label,
            isStateSelected: true,
        });
    }

    // SEARCH STATE
    handleSearchStateChange(event) {
        if (event.target.value.length === 0) {
            this.setState({
                searchState: event.target.value,
                isSearchStateValid: true,
            });
        } else {
            this.setState({
                searchState: event.target.value,
                isSearchStateValid: this.validateSearchState(
                    event.target.value
                ),
            });
        }
    }

    handleSearchStateBlur(event) {
        if (event.target.value.trim().length === 0) {
            event.target.className = 'form-control';
            return;
        }
        this.validateSearchState(event.target.value)
            ? (event.target.className = 'form-control is-valid')
            : (event.target.className = 'form-control is-invalid');
    }

    validateSearchState(state) {
        if (state.length < 2 || state.length > 64) {
            return false;
        } else if (!this.validateSpecialCharacters(state)) {
            return false;
        }
        return true;
    }

    // OVERALL FORM VALIDATIONS
    validateSpecialCharacters(formField) {
        const specialCharactersRegex = SPECIAL_CHARS_REGEX;

        if (formField[0] === ' ' || formField[formField.length - 1] === ' ') {
            return false;
        } else if (specialCharactersRegex.test(formField)) {
            return false;
        } else {
            return true;
        }
    }

    // NEXT ACTION
    handleNextAction() {
        const legalEntity = this.state.companies[
            this.state.selectedCompanyIndex
        ];

        this.props.onSetLegalEntity({
            address: {
                addressCountry: legalEntity.organization.primaryAddress
                    ? legalEntity.organization.primaryAddress.addressCountry
                    : null,
                addressLocality: legalEntity.organization.primaryAddress
                    ? legalEntity.organization.primaryAddress.addressLocality
                    : null,
                addressRegion: legalEntity.organization.primaryAddress
                    ? legalEntity.organization.primaryAddress.addressRegion
                    : null,
                postalCode: legalEntity.organization.primaryAddress
                    ? legalEntity.organization.primaryAddress.postalCode
                    : null,
                streetAddress: legalEntity.organization.primaryAddress
                    ? legalEntity.organization.primaryAddress.streetAddress
                    : null,
            },
            externalId: legalEntity.organization.externalId
                ? legalEntity.organization.externalId
                : null,
            // id: 0, // NOT NEEDED FOR NOW
            name: legalEntity.organization.primaryName
                ? legalEntity.organization.primaryName
                : null,
            signature: legalEntity.organization.signature
                ? legalEntity.organization.signature
                : null,
            // sponsorVerified: true, // NOT NEEDED FOR NOW
            // type: "string" // NOT NEEDED FOR NOW THIS IS IN PRIMARY GET or from PREVIOUS STEP
            isOnboardingCompleted: this.state.isOnboardingCompleted,
        });
    }

    // BACK ACTION
    handleBackAction() {
        if (this.props.csr !== 'CURRENT_STEP_IDENTITY_COMPLETED') {
            this.props.onBackLegalEntity();
        } else {
            this.props.onStartLoader();
            this.props.onBackSponsoredParticipantLegalEntity();
        }
    }

    onFocus = (event) => {
        if (event.target.autocomplete) {
            event.target.autocomplete = 'no-autocomplete';
        }
    };

    render() {
        const {
            companies,
            selectedCompanyIndex,
            currentPaginationPage,
            searchCountry,
            isSearchNameValid,
            isSearchNumberValid,
            isSearchStateValid,
            isSearchNearestCityValid,
            isCountrySelected,
            isStateSelected,
            completedSearch,
            searchState,
            companiesLength,
        } = this.state;

        const listCompanies = companies.map((company, i) => {
            if (company.organization.registrationNumbers === null) {
                company.organization.registrationNumbers = [];
                company.organization.registrationNumbers[0] = {
                    registrationNumber: 'No company registration number',
                };
            }

            return (
                <div
                    key={company.organization.signature + '-' + i}
                    className="result box--flex--column center--x"
                    onClick={(e) => {
                        this.setState({
                            selectedCompanyIndex: i,
                        });
                        e.preventDefault();
                    }}>
                    <div className="company-name">
                        {company.organization.primaryName}
                    </div>
                    {/* <div className="company-number">
                        {company.organization.externalId}
                    </div> */}
                    {/* <div className="company-incorporated">
                        Incorporated on {company.incorporated}
                    </div> */}
                    {company.organization.primaryAddress && (
                        <div className="company-address">
                            {
                                company.organization.primaryAddress
                                    .addressCountry.name
                            }
                            ,
                            {
                                company.organization.primaryAddress
                                    .streetAddress.line1
                            }
                            ,
                            {
                                company.organization.primaryAddress
                                    .streetAddress.line2
                            }
                        </div>
                    )}
                    {!company.organization.primaryAddress && (
                        <div className="company-address">
                            No company address
                        </div>
                    )}

                    <i
                        className={
                            'mdi mdi-circle-outline ' +
                            (this.state.selectedCompanyIndex !== i
                                ? ''
                                : 'hidden')
                        }></i>
                    <i
                        className={
                            'mdi mdi-check-circle ' +
                            (this.state.selectedCompanyIndex === i
                                ? ''
                                : 'hidden')
                        }></i>
                </div>
            );
        });

        const mappedStates = states.map((state) => {
            return { label: state, value: state };
        });

        const stateOption =
            searchCountry === 'United States' ? (
                <div className="form-group state">
                    <div className="floating-select">
                        <Select
                            className="form-control"
                            classNamePrefix="select"
                            onFocus={this.onFocus}
                            options={mappedStates}
                            components={{
                                ValueContainer: CustomValueContainer,
                            }}
                            placeholder="State*"
                            name="state"
                            onChange={this.selectUsaState}
                            value={searchState.label}
                        />
                    </div>
                </div>
            ) : (
                <div className="form-group state">
                    <label htmlFor="state" className="has-float-label">
                        <input
                            name="state"
                            type="text"
                            id="state"
                            placeholder=" "
                            className="form-control"
                            onChange={(e) => {
                                this.handleSearchStateChange(e);
                            }}
                            onBlur={(e) => {
                                this.handleSearchStateBlur(e);
                            }}
                        />
                        <span>state</span>
                    </label>
                </div>
            );

        const entityNameTooltipMsg = (
            <span>
                The name you enter here will be used in the "Organisation (O)"
                field in{' '}
                <a
                    href="https://corda.network/participation/distinguishedname.html"
                    target="_blank"
                    rel="noopener noreferrer">
                    X500 node name
                </a>
                , & legal entity you indicate below (in the Terms of Use), and
                should BOTH indicate the owner (legal entity) of the legal
                asset.
            </span>
        );

        const nearestCityTooltipMsg =
            'This should be the nearest big city to where the legal entity is officially registered. As such, this should not be the location of the company’s biggest office or the location of the individual’s workplace.';

        const countriesOptions = this.props.countriesList.map((country) => {
            return { label: country.name, value: country.name };
        });

        let areMoreThanThousandResults = false;
        let pageCount = Math.ceil(
            companiesLength / this.state.searchResultPageCount
        );
        if (pageCount > 100) {
            areMoreThanThousandResults = true;
            pageCount = 100;
        }

        return (
            <div className="legal-entity box--flex">
                <div className="form-wrapper box box--flex--column center--Xxx bg-white">
                    <h1 className="text-center h3">Create Account</h1>
                    <p className="subtitle text-center">
                        Confirm Legal Entity Name
                    </p>
                    <div className="h-splitter"></div>
                    <form className="box box--flex--column">
                        {/* NAME */}
                        <div className="form-group">
                            <Tooltip message={entityNameTooltipMsg}>
                                <label
                                    htmlFor="name"
                                    className="has-float-label with-tooltip">
                                    <input
                                        name="name"
                                        type="text"
                                        id="name"
                                        placeholder=" "
                                        className="form-control entity-name"
                                        onChange={(e) => {
                                            this.handleSearchNameChange(e);
                                        }}
                                        onBlur={(e) => {
                                            this.handleSearchNameBlur(e);
                                        }}
                                    />
                                    <span>Legal Entity name*</span>
                                </label>
                            </Tooltip>
                        </div>
                        {/* COUNTRY & NEAREST CITY */}
                        <div className="box--flex center--XxX">
                            <div className="form-group country">
                                <div className="floating-select">
                                    <Select
                                        className="form-control"
                                        classNamePrefix="select"
                                        onFocus={this.onFocus}
                                        options={countriesOptions}
                                        components={{
                                            ValueContainer: CustomValueContainer,
                                        }}
                                        placeholder="Country*"
                                        name="country"
                                        onChange={this.selectSearchCountry}
                                        value={searchCountry.label}
                                    />
                                </div>
                            </div>
                            <div className="form-group nearest-city">
                                <Tooltip message={nearestCityTooltipMsg}>
                                    <label
                                        htmlFor="nearest-city"
                                        className="has-float-label with-tooltip">
                                        <input
                                            name="nearest-city"
                                            type="text"
                                            id="nearest-city"
                                            placeholder=" "
                                            className="form-control"
                                            value={this.state.searchNearestCity}
                                            onChange={(e) => {
                                                this.handleSearchNearestCityChange(
                                                    e
                                                );
                                            }}
                                            onBlur={(e) => {
                                                this.handleSearchNearestCityBlur(
                                                    e
                                                );
                                            }}
                                        />
                                        <span>nearest city*</span>
                                    </label>
                                </Tooltip>
                            </div>
                        </div>
                        {/* COMPANY NUMBER & STATE */}
                        <div className="box--flex center--XxX">
                            {stateOption}
                            <div className="form-group reg-number">
                                <label
                                    htmlFor="reg-number"
                                    className="has-float-label">
                                    <input
                                        name="reg-number"
                                        type="text"
                                        id="reg-number"
                                        placeholder=" "
                                        className="form-control"
                                        disabled={true}
                                        autoFocus
                                        onChange={(e) => {
                                            this.handleSearchNumberChange(e);
                                        }}
                                        onBlur={(e) => {
                                            this.handleSearchNumberBlur(e);
                                        }}
                                    />
                                    <span>reg. number</span>
                                    <div className="feature-to-come">
                                        feature to come later
                                    </div>
                                </label>
                            </div>
                        </div>

                        <button
                            type="button"
                            data-toggle="button"
                            aria-pressed="false"
                            className="btn btn-secondary btn-search box box--flex center--y center--x"
                            disabled={
                                !isCountrySelected ||
                                !isSearchNameValid ||
                                !isSearchNumberValid ||
                                !isSearchStateValid ||
                                !isSearchNearestCityValid ||
                                (searchCountry === 'United States' &&
                                    !isStateSelected) ||
                                this.state.oneMinuteThrottleInProgess
                            }
                            onClick={() => {
                                this.searchCompanies(1);
                            }}>
                            {this.state.oneMinuteThrottleInProgess ? (
                                <i className="mdi mdi-pause-circle-outline"></i>
                            ) : (
                                <i className="mdi mdi-magnify"></i>
                            )}

                            {this.state.oneMinuteThrottleInProgess ? (
                                <span>
                                    please, wait <CountdownTimer /> to search
                                    again
                                </span>
                            ) : (
                                <span>Search companies</span>
                            )}
                        </button>
                    </form>

                    {areMoreThanThousandResults && (
                        <div className="box--flex over-results">
                            <i className="mdi mdi-alert-decagram-outline"></i>
                            <div className="box--flex center--y">
                                There are over a 1,000 matches for this legal
                                entity name. If you want to narrow down the
                                results, please be more specific.
                            </div>
                        </div>
                    )}

                    {listCompanies.length > 0 && (
                        <Aux>
                            <div className="h-splitter"></div>
                            <div className="showed-chunk">
                                Showing{' '}
                                <b>
                                    {currentPaginationPage *
                                        this.state.searchResultPageCount -
                                        9}
                                    -
                                    {currentPaginationPage *
                                        this.state.searchResultPageCount >
                                    companiesLength
                                        ? companiesLength
                                        : currentPaginationPage *
                                          this.state.searchResultPageCount}
                                </b>{' '}
                                out of{' '}
                                <b>
                                    {companiesLength > 1000
                                        ? '1000'
                                        : companiesLength}
                                </b>{' '}
                                results{' '}
                            </div>
                            <input
                                type="text"
                                className="hidden-ref"
                                ref={(list) => (this.refList = list)}
                            />
                            <div className="search-result">
                                <div>{listCompanies}</div>
                            </div>
                            {companiesLength > 10 && (
                                <ReactPaginate
                                    previousLabel={'<'}
                                    nextLabel={'>'}
                                    breakLabel={'...'}
                                    breakClassName={'break-me'}
                                    pageCount={pageCount}
                                    marginPagesDisplayed={3}
                                    pageRangeDisplayed={3}
                                    onPageChange={(e) => {
                                        this.handlePaginationPageClick(e);
                                    }}
                                    forcePage={currentPaginationPage - 1}
                                    containerClassName={'pagination'}
                                    subContainerClassName={'pages pagination'}
                                    activeClassName={'active'}
                                />
                            )}
                        </Aux>
                    )}
                    {!listCompanies.length && completedSearch && (
                        <div className="no-search-results">
                            <div className="h-splitter"></div>
                            <p className="text-center primary-text">
                                Sorry, there are no results matching your
                                search.
                            </p>
                            <p className="text-center secondary-text">
                                Please, make sure that all words are spelled
                                correctly.
                            </p>
                        </div>
                    )}

                    <div className="h-splitter"></div>
                    <div className="box box--flex center--XxX actions mt-20">
                        <button
                            type="button"
                            data-toggle="button"
                            aria-pressed="false"
                            className="btn btn-link btn-back m-0"
                            onClick={() => this.handleBackAction()}>
                            Back
                        </button>
                        <button
                            type="button"
                            data-toggle="button"
                            aria-pressed="false"
                            className="btn btn-primary btn-next m-0"
                            disabled={!(selectedCompanyIndex >= 0)}
                            onClick={() => this.handleNextAction()}>
                            Next
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        csr: state.csr.currentStep,
        ler: state.ler.legalEntity,
        loader: state.loader.isLoading,
        sponsorCurrentStepReducer: state.sponsorCurrentStepReducer,
        sponsoredLegalEntityReducer:
            state.sponsoredLegalEntityReducer.legalEntity,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onSetLegalEntity: (legalEntity) => {
            if (legalEntity.isOnboardingCompleted) {
                dispatch(
                    {
                        type: actionTypes.SPONSOR_CONFIRM_LEGAL_ENTITY,
                    },
                    dispatch({
                        type: actionTypes.SET_SPONSOR_LEGAL_ENTITY,
                        legalEntity: legalEntity,
                    })
                );
            } else {
                dispatch(
                    {
                        type: actionTypes.CURRENT_STEP_CONFIRM_LEGAL_ENTITY,
                    },
                    dispatch({
                        type: actionTypes.SET_LEGAL_ENTITY,
                        legalEntity: legalEntity,
                    })
                );
            }
        },
        onBackLegalEntity: () =>
            dispatch({
                type: actionTypes.CURRENT_STEP_SELECT_PARTICIPANT_TYPE,
            }),
        onBackSponsoredParticipantLegalEntity: () =>
            dispatch({
                type: actionTypes.SHOW_SPONSORED_PARTICIPANTS,
            }),
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

export default connect(mapStateToProps, mapDispatchToProps)(LegalEntity);
