import React from 'react';
import './BillingDetails.scss';

const BillingDetails = (props) => {
    return (
        <div className="billing-details-dashboard bg-white">
            <div className="dsh-header box box--flex center--XxX center--y">
                <div className="heading box--flex center--y">
                    <i className="mdi mdi-credit-card-outline"></i>
                    <span>Billing Details</span>
                </div>
                {/* <i className="mdi mdi-pencil-outline edit"></i> */}
            </div>
            {/* <div className="h-splitter"></div> */}
            <div className="field box odd box--flex center--y center--XxX">
                <div>Billing contact first and last name</div>
                <div className="value">
                    {props.billingDetails.contactName
                        ? props.billingDetails.contactName
                        : 'Missing names'}
                </div>
            </div>
            {/* <div className="h-splitter"></div> */}
            <div className="field box box--flex center--y center--XxX">
                <div>Legal entity name</div>
                <div className="value">
                    {props.companyDetails.name
                        ? props.companyDetails.name
                        : 'Missing legal entity name'}
                </div>
            </div>
            {/* <div className="h-splitter"></div> */}
            <div className="field box odd box--flex center--y center--XxX">
                <div>Country</div>
                <div className="value">
                    {props.billingDetails.address.addressCountry.name
                        ? props.billingDetails.address.addressCountry.name
                        : 'Missing country'}
                </div>
            </div>
            {/* <div className="h-splitter"></div> */}
            <div className="field box box--flex center--y center--XxX">
                <div>City</div>
                <div className="value">
                    {props.billingDetails.address.addressLocality.name
                        ? props.billingDetails.address.addressLocality.name
                        : 'Missing City'}
                </div>
            </div>
            {/* <div className="h-splitter"></div> */}
            <div className="field box odd box--flex center--y center--XxX">
                <div>Address</div>
                <div className="value ">
                    {props.billingDetails.address.streetAddress.line1
                        ? props.billingDetails.address.streetAddress.line1
                        : 'Missing address'}
                    <br />
                    {!!props.billingDetails.address.streetAddress.line2
                        ? props.billingDetails.address.streetAddress.line2
                        : null}
                    {!!props.billingDetails.address.streetAddress.line2 ? (
                        <br />
                    ) : null}
                    {props.billingDetails.address.addressLocality.name},
                    {props.billingDetails.address.postalCode}
                </div>
            </div>
            {/* <div className="h-splitter"></div> */}
            <div className="field box box--flex center--y center--XxX">
                <div>Postcode</div>
                <div className="value">
                    {' '}
                    {props.billingDetails.address.postalCode
                        ? props.billingDetails.address.postalCode
                        : 'Missing postal code'}
                </div>
            </div>
            {/* <div className="h-splitter"></div> */}
            <div className="field box odd box--flex center--y center--XxX">
                <div>Email</div>
                <div className="value">
                    {props.billingDetails.contactEmail
                        ? props.billingDetails.contactEmail
                        : 'Missing contact email'}
                </div>
            </div>
            {/* <div className="h-splitter"></div> */}
            <div className="field box box--flex center--y center--XxX">
                <div>Phone number</div>
                <div className="value">
                    {props.billingDetails.contactPhone
                        ? props.billingDetails.contactPhone
                        : 'Missing contact phone'}
                </div>
            </div>
            {/* <div className="h-splitter"></div> */}
            <div className="field box odd box--flex center--y center--XxX">
                <div>External ID</div>
                <div className="value">
                    {props.companyDetails.externalId
                        ? props.companyDetails.externalId
                        : 'Missing external ID'}
                </div>
            </div>
        </div>
    );
};

export default BillingDetails;
