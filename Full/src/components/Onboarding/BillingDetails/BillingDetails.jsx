import React, { Component } from 'react';
import './BillingDetails.scss';
import Tooltip from '../../Tooltip/Tooltip';
import { connect } from 'react-redux';
import * as actionTypes from '../../../store/actions';
import { axiosCountriesListGET } from '../../../axios/axios';
import Select from 'react-select';
import CustomValueContainer from './../../../containers/CustomValueContainer/CustomValueContainer';
import {
    VALID_NAMES_REGEX,
    VALID_MAIL_REGEX,
    SPECIAL_CHARS_REGEX,
    VALID_CITY_REGEX,
    VALID_PHONE_REGEX,
} from '../../../utils/constant';

class BillingDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            firstLastNames: this.props.bdr.contactName,
            isFirstAndLastNamesValid:
                this.props.bdr.contactName.length || false,
            legalEntityName: this.props.ler.name,
            isLegalEntityNameValid: true,
            country: this.props.ler.address.addressCountry.name,
            isoAlpha2Code: this.props.ler.address.addressCountry.isoAlpha2Code,
            city: this.props.ler.address.addressLocality.name,
            isCityValid: true,
            address:
                this.props.ler.address.streetAddress.line1 +
                '' +
                this.props.ler.address.streetAddress.line2,
            isAddressVaid:
                this.props.ler.address.streetAddress.line1.length || false,
            postCode: this.props.ler.address.postalCode,
            isPostCodeValid: this.props.ler.address.postalCode.length || false,
            email: this.props.bdr.contactEmail,
            isEmailValid: this.props.bdr.contactEmail.length || false,
            phonePrefix: '',
            phone: this.props.bdr.phone,
            isPhoneValid: this.props.bdr.phonePrefix || false,
            externalId: this.props.ler.externalId,
            isExternalIdValid: this.props.ler.externalId.length || false,
            countriesList: [],
        };

        this.selectCountry = this.selectCountry.bind(this);
        this.selectphonePrefix = this.selectphonePrefix.bind(this);
        this.getInitialphonePrefixForSelectedCountry = this.getInitialphonePrefixForSelectedCountry.bind(
            this
        );
    }

    componentDidMount() {
        if (typeof this.props.countryList === 'undefined') {
            axiosCountriesListGET()
                .then((response) => {
                    this.setState({
                        countriesList: response.data,
                    });
                })
                .then(() => {
                    this.getInitialphonePrefixForSelectedCountry(
                        this.state.countriesList
                    );
                });
        } else {
            this.getInitialphonePrefixForSelectedCountry(
                this.props.countriesList
            );
        }
    }

    getInitialphonePrefixForSelectedCountry(codesArr) {
        const filteredCodes = codesArr.filter((country) => {
            return (
                country.isoAlpha2Code.toLowerCase() ===
                this.state.isoAlpha2Code.toLowerCase()
            );
        });
        this.setState({
            phonePrefix: filteredCodes[0].phonePrefix,
        });
    }

    getCountryIsoCode(country) {
        const filteredCountries = this.props.countriesList.filter(
            (fCountry) => {
                return country === fCountry.name;
            }
        );
        return filteredCountries[0].isoAlpha2Code;
    }

    // BILLING MAIN NAMES
    handleNamesChange(event) {
        this.setState({
            firstLastNames: event.target.value,
            isFirstAndLastNamesValid: this.validateNames(event.target.value),
        });
    }

    handleNamesBlur(event) {
        this.validateNames(event.target.value)
            ? (event.target.className = 'form-control is-valid')
            : (event.target.className = 'form-control is-invalid');
    }

    validateNames(name) {
        const namesRegex = VALID_NAMES_REGEX;

        if (!namesRegex.test(name)) {
            return false;
        } else if (!this.validateSpecialCharacters(name)) {
            return false;
        }
        return true;
    }

    // LEGAL ENTITY NAME
    handleLegalEntityNameChange(event) {
        this.setState({
            legalEntityName: event.target.value,
            isLegalEntityNameValid: this.validateLegalEntityName(
                event.target.value
            ),
        });
    }

    handleLegalEntityNameBlur(event) {
        this.validateLegalEntityName(event.target.value)
            ? (event.target.className = 'form-control is-valid')
            : (event.target.className = 'form-control is-invalid');
    }

    validateLegalEntityName(name) {
        if (!this.validateSpecialCharacters(name)) {
            return false;
        }
        return true;
    }

    // COUNTRY
    selectCountry(e) {
        this.setState({
            country: e.label,
            isoAlpha2Code: this.getCountryIsoCode(e.label),
        });
    }

    // CITY
    handleCityChange(event) {
        this.setState({
            city: event.target.value,
            isCityValid: this.validateCity(event.target.value),
        });
    }

    handleCityBlur(event) {
        this.validateCity(event.target.value)
            ? (event.target.className = 'form-control is-valid')
            : (event.target.className = 'form-control is-invalid');
    }

    validateCity(city) {
        const cityRegex = VALID_CITY_REGEX;

        if (!cityRegex.test(city)) {
            return false;
        } else if (!this.validateSpecialCharacters(city)) {
            return false;
        }
        return true;
    }

    // ADDRESS
    handleAddressChange(event) {
        this.setState({
            address: event.target.value,
            isAddressVaid: this.validateAddress(event.target.value),
        });
    }

    handleAddressBlur(event) {
        this.validateAddress(event.target.value)
            ? (event.target.className = 'form-control is-valid')
            : (event.target.className = 'form-control is-invalid');
    }

    validateAddress(address) {
        if (!this.validateSpecialCharacters(address)) {
            return false;
        }
        return true;
    }

    // POSTCODE
    handlePostcodeChange(event) {
        this.setState({
            postCode: event.target.value,
            isPostCodeValid: this.validatePostcode(event.target.value),
        });
    }

    handlePostcodeBlur(event) {
        this.validatePostcode(event.target.value)
            ? (event.target.className = 'form-control is-valid')
            : (event.target.className = 'form-control is-invalid');
    }

    validatePostcode(postcode) {
        postcode = +postcode;
        if (!this.validateSpecialCharacters(postcode)) {
            return false;
        }
        return true;
    }

    // EMAIL
    handleEmailChange(event) {
        this.setState({
            email: event.target.value,
            isEmailValid: this.validateEmail(event.target.value),
        });
    }

    handleEmailBlur(event) {
        this.validateEmail(event.target.value)
            ? (event.target.className = 'form-control is-valid')
            : (event.target.className = 'form-control is-invalid');
    }

    validateEmail(email) {
        const emailValidator = VALID_MAIL_REGEX;
        if (!emailValidator.test(email)) {
            return false;
        }
        return true;
    }

    // EXTERNAL ID
    handleExternalIdChange(event) {
        this.setState({
            externalId: event.target.value,
            isExternalIdValid: this.validateExternalId(event.target.value),
        });
    }

    handleExternalIdBlur(event) {
        this.validateExternalId(event.target.value)
            ? (event.target.className = 'form-control is-valid')
            : (event.target.className = 'form-control is-invalid');
    }

    validateExternalId(externalId) {
        externalId = +externalId;
        if (isNaN(externalId)) {
            return false;
        }
        return true;
    }

    // PHONE
    selectphonePrefix(e) {
        this.setState({
            phonePrefix: e.value,
        });
    }

    handlePhoneChange(event) {
        this.setState({
            phone: event.target.value,
            isPhoneValid: this.validatePhone(event.target.value),
        });
    }

    handlePhoneBlur(event) {
        this.validatePhone(event.target.value)
            ? (event.target.className = 'form-control is-valid')
            : (event.target.className = 'form-control is-invalid');
    }

    validatePhone(phone) {
        const phoneRegex = VALID_PHONE_REGEX;
        if (!phoneRegex.test(phone)) {
            return false;
        } else if (!this.validateSpecialCharacters(phone)) {
            return false;
        }
        return true;
    }

    // OVERALL FORM VALIDATIONS
    validateSpecialCharacters(formField) {
        const specialCharactersRegex = SPECIAL_CHARS_REGEX;

        if (typeof formField === 'string' && formField.trim().length < 2) {
            return false;
        } else if (
            formField[0] === ' ' ||
            formField[formField.length - 1] === ' '
        ) {
            return false;
        } else if (specialCharactersRegex.test(formField)) {
            return false;
        } else {
            return true;
        }
    }

    isFormValid() {
        return (
            this.state.isFirstAndLastNamesValid &&
            this.state.isLegalEntityNameValid &&
            this.state.isCityValid &&
            this.state.isAddressVaid &&
            this.state.isPostCodeValid &&
            this.state.isEmailValid &&
            this.state.isPhoneValid &&
            this.state.isExternalIdValid
        );
    }

    // NEXT ACTION
    handleNextAction() {
        const billingDetails = {
            contactName: this.state.firstLastNames,
            contactEmail: this.state.email,
            contactPhone: this.state.phonePrefix + this.state.phone,
            phone: this.state.phone,
            phonePrefix: this.state.phonePrefix,
            address: {
                addressCountry: {
                    name: this.state.country,
                    isoAlpha2Code: this.state.isoAlpha2Code,
                },
                addressLocality: {
                    name: this.state.city,
                },
                addressRegion: {
                    name: '',
                    abbreviatedName: '',
                },
                postalCode: this.state.postCode,
                streetAddress: {
                    line1: this.state.address,
                    line2: '',
                },
            },
        };
        this.props.onSetBillingDetails(billingDetails);
    }

    // BACK ACTION
    handleBackAction() {
        this.props.onBackBillingDetails();
    }

    onFocus = (event) => {
        if (event.target.autocomplete) {
            event.target.autocomplete = 'no-autocomplete';
        }
    };

    render() {
        const { phonePrefix, country } = this.state;

        const countriesOptions = this.props.countriesList.map((country) => {
            return {
                label: country.name,
                value: country.isoAlpha2Code,
            };
        });

        const phoneCodesOptions = this.props.countriesList.map((country) => {
            if (phonePrefix === country.phonePrefix) {
                return {
                    label: country.phonePrefix,
                    value: country.phonePrefix,
                };
            } else {
                return {
                    label: country.phonePrefix + ' - ' + country.isoAlpha2Code,
                    value: country.phonePrefix,
                };
            }
        });

        return (
            <div className="billing-details box--flex">
                <div className="form-wrapper box box--flex--column center--Xxx bg-white">
                    <h1 className="text-center h3">Create Account</h1>
                    <p className="subtitle text-center">
                        Enter Billing Details
                    </p>
                    <div className="h-splitter"></div>
                    <form className="box box--flex--column main">
                        {/* LEGAL ENTITY NAME, COUNTRY, CITY, ADDRESS, POSTCODE */}
                        {/* LEGAL ENTITY NAME */}
                        <div className="form-group">
                            <label
                                htmlFor="legalEntityName"
                                className="has-float-label">
                                <input
                                    name="legalEntityName"
                                    type="text"
                                    id="legalEntityName"
                                    placeholder=" "
                                    value={this.state.legalEntityName}
                                    className="form-control"
                                    onChange={(e) => {
                                        this.handleLegalEntityNameChange(e);
                                    }}
                                    onBlur={(e) => {
                                        this.handleLegalEntityNameBlur(e);
                                    }}
                                />
                                <span>Legal Entity name</span>
                            </label>
                        </div>
                        {/* COUNTRY */}
                        <div className="form-group">
                            <div className="floating-select">
                                <Select
                                    className="form-control"
                                    classNamePrefix="select"
                                    options={countriesOptions}
                                    onFocus={this.onFocus}
                                    components={{
                                        ValueContainer: CustomValueContainer,
                                    }}
                                    placeholder="Country*"
                                    name="country"
                                    value={{ label: country, value: country }}
                                    onChange={this.selectCountry}
                                />
                            </div>
                        </div>
                        {/* CITY */}
                        <div className="form-group">
                            <label htmlFor="city" className="has-float-label">
                                <input
                                    name="city"
                                    type="text"
                                    id="city"
                                    placeholder=" "
                                    value={this.state.city}
                                    className="form-control"
                                    onChange={(e) => {
                                        this.handleCityChange(e);
                                    }}
                                    onBlur={(e) => {
                                        this.handleCityBlur(e);
                                    }}
                                />
                                <span>City*</span>
                            </label>
                        </div>
                        {/* ADDRESS */}
                        <div className="form-group">
                            <label
                                htmlFor="address"
                                className="has-float-label">
                                <input
                                    name="address"
                                    type="text"
                                    id="address"
                                    placeholder=" "
                                    className="form-control"
                                    defaultValue={this.state.address}
                                    onChange={(e) => {
                                        this.handleAddressChange(e);
                                    }}
                                    onBlur={(e) => {
                                        this.handleAddressBlur(e);
                                    }}
                                />
                                <span>Address*</span>
                            </label>
                        </div>
                        {/* POSTCODE */}
                        <div className="form-group">
                            <label
                                htmlFor="postcode"
                                className="has-float-label">
                                <input
                                    name="postcode"
                                    type="text"
                                    id="postcode"
                                    placeholder=" "
                                    className="form-control"
                                    defaultValue={this.state.postCode}
                                    onChange={(e) => {
                                        this.handlePostcodeChange(e);
                                    }}
                                    onBlur={(e) => {
                                        this.handlePostcodeBlur(e);
                                    }}
                                />
                                <span>Postcode*</span>
                            </label>
                        </div>
                    </form>
                    <div className="h-splitter"></div>
                    <form className="box box--flex--column contact">
                        {/* FIRST & LAST NAMES, EMAIL, PHONE NUMBER */}
                        {/* FIRST & LAST NAMES */}
                        <div className="form-group">
                            <Tooltip message="Please, enter the first and last name of the individual with authority to pay fees, who works for the legal entity who is joining.">
                                <label
                                    htmlFor="names"
                                    className="has-float-label with-tooltip">
                                    <input
                                        value={this.state.firstLastNames}
                                        name="names"
                                        type="text"
                                        id="names"
                                        placeholder=" "
                                        className="form-control"
                                        onChange={(e) => {
                                            this.handleNamesChange(e);
                                        }}
                                        onBlur={(e) => {
                                            this.handleNamesBlur(e);
                                        }}
                                    />
                                    <span>Billing Contact Name*</span>
                                </label>
                            </Tooltip>
                        </div>
                        {/* EMAIL */}
                        <div className="form-group">
                            <label htmlFor="email" className="has-float-label">
                                <input
                                    name="email"
                                    type="text"
                                    id="email"
                                    placeholder=" "
                                    className="form-control"
                                    defaultValue={this.state.email}
                                    onChange={(e) => {
                                        this.handleEmailChange(e);
                                    }}
                                    onBlur={(e) => {
                                        this.handleEmailBlur(e);
                                    }}
                                />
                                <span>email*</span>
                            </label>
                        </div>
                        {/* PHONE NUMBER */}
                        <div className="phone-group box--flex center--y">
                            <div className="form-group">
                                <div className="floating-select">
                                    <Select
                                        className="form-control phone-code"
                                        classNamePrefix="select"
                                        options={phoneCodesOptions}
                                        onFocus={this.onFocus}
                                        components={{
                                            ValueContainer: CustomValueContainer,
                                        }}
                                        placeholder="Code"
                                        name="code"
                                        value={{
                                            label: this.state.phonePrefix,
                                            value: this.state.phonePrefix,
                                        }}
                                        onChange={this.selectphonePrefix}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label
                                    className="has-float-label"
                                    htmlFor="phone">
                                    <input
                                        name="phone"
                                        type="text"
                                        id="phone"
                                        placeholder=" "
                                        className="form-control"
                                        defaultValue={this.state.phone}
                                        onChange={(e) => {
                                            this.handlePhoneChange(e);
                                        }}
                                        onBlur={(e) => {
                                            this.handlePhoneBlur(e);
                                        }}
                                    />
                                    <span>phone number*</span>
                                </label>
                            </div>
                        </div>
                        {/* EXTERNAL ID */}
                        {/* <div className="form-group">
                            <label
                                htmlFor="externalId"
                                className="has-float-label">
                                <input
                                    name="externalId"
                                    type="text"
                                    id="externalId"
                                    placeholder=" "
                                    className="form-control"
                                    defaultValue={this.state.externalId}
                                    disabled={true}
                                    onChange={(e) => {
                                        this.handleExternalIdChange(e);
                                    }}
                                    onBlur={(e) => {
                                        this.handleExternalIdBlur(e);
                                    }}
                                />
                                <span>external id</span>
                            </label>
                        </div> */}
                    </form>
                    <div className="h-splitter"></div>
                    <div className="box box--flex center--XxX actions">
                        <button
                            type="button"
                            data-toggle="button"
                            aria-pressed="false"
                            className="btn btn-secondary btn-next m-0"
                            onClick={() => this.handleBackAction()}>
                            Back
                        </button>
                        <button
                            type="button"
                            data-toggle="button"
                            aria-pressed="false"
                            className="btn btn-primary btn-next m-0"
                            disabled={!this.isFormValid()}
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
        ler: state.ler.legalEntity,
        bdr: state.bdr.billingDetails,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onSetBillingDetails: (billingDetails) =>
            dispatch(
                {
                    type: actionTypes.CURRENT_STEP_CONFIRM_BILLING_DETAILS,
                },
                dispatch({
                    type: actionTypes.SET_BILLING_DETAILS,
                    billingDetails: billingDetails,
                })
            ),
        onBackBillingDetails: () =>
            dispatch({
                type: actionTypes.CURRENT_STEP_SELECT_PARTICIPANT_TYPE,
            }),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BillingDetails);
