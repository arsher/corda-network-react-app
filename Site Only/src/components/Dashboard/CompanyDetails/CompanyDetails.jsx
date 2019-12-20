import React from 'react';
import './CompanyDetails.scss';

const CompanyDetails = (props) => {
    return (
        <div className="company-details bg-white">
            <div className="dsh-header box box--flex center--XxX center--y">
                <div className="heading box--flex center--y">
                    <i className="mdi mdi-city-variant-outline"></i>
                    <span>Company Details</span>
                </div>
            </div>
            <div className="h-splitter"></div>
            <div className="field odd box box--flex center--y center--XxX">
                <div>Company name</div>
                <div className="value">{props.companyDetails.name}</div>
            </div>
            <div className="h-splitter"></div>
            <div className="field box box--flex center--y center--XxX">
                <div>Company number</div>
                <div className="value">{props.companyDetails.externalId}</div>
            </div>
            <div className="h-splitter"></div>
            <div className="field odd box box--flex center--y center--XxX">
                <div>Incorporation date</div>
                <div className="value">
                    {props.companyDetails.created.substr(0, 10)}
                </div>
            </div>
            <div className="h-splitter"></div>
            <div className="field box box--flex center--y center--XxX">
                <div>Country</div>
                <div className="value">
                    {props.companyDetails.address.addressCountry.name
                        ? props.companyDetails.address.addressCountry.name
                        : 'Missing Country'}
                </div>
            </div>
            <div className="h-splitter"></div>
            <div className="field odd box box--flex center--XxX">
                <div>Reg. Address</div>
                <div className="value">
                    {props.companyDetails.address.streetAddress.line1
                        ? props.companyDetails.address.streetAddress.line1
                        : 'Missing address'}
                    ,
                    <br />
                    {!!props.companyDetails.address.streetAddress.line2
                        ? props.companyDetails.address.streetAddress.line2
                            ? props.companyDetails.address.streetAddress.line2
                            : 'Missing address'
                        : null}
                    {!!props.companyDetails.address.streetAddress.line2 ? (
                        <br />
                    ) : null}
                    {props.companyDetails.address.addressLocality.name},{' '}
                    {props.companyDetails.address.postalCode}
                </div>
            </div>
        </div>
    );
};

export default CompanyDetails;
