import React, { Component } from 'react';
import Modal from 'react-modal';

export default class CustomerAgreement extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
        };
    }

    handleOpenModal() {
        this.setState({ showModal: true });
    }

    handleCloseModal() {
        this.setState({ showModal: false });
    }

    render() {
        return (
            <div className="customer-agreement">
                <p className="text-left mb-0">
                    By clicking “Next”, you agree to our{' '}
                    <span
                        className="text-red"
                        onClick={() => this.handleOpenModal()}>
                        Customer Agreement.
                    </span>
                </p>
                <Modal
                    ariaHideApp={false}
                    isOpen={this.state.showModal}
                    contentLabel="onRequestClose Example"
                    onRequestClose={() => this.handleCloseModal()}
                    className="Modal Modal__customer-agreement"
                    overlayClassName="Overlay Overlay__feedback">
                    <ol>
                        <li>
                            Customer acknowledges that all content accessed
                            through these onboarding services (the “Licensed
                            Content”) is owned by a third party data provider
                            (“Third Party Data Provider”) and that the copyright
                            to the Licensed Content is and shall remain with
                            Third Party Data Provider.{' '}
                        </li>
                        <li>
                            Licensed Content is licensed to Customer for its
                            internal business use and for no other purpose. None
                            of the Licensed Content may be made available in
                            whole or in part to any third party. Customer agrees
                            that Customer is expressly prohibited from using the
                            Licensed Content as a factor in establishing an
                            individual’s eligibility for (i) credit or insurance
                            to be used primarily for personal, family or
                            household purposes, or (ii) employment. Customer
                            shall not use the Licensed Content in any way that:
                            (A) infringes, misappropriates, or violates a third
                            party’s intellectual property or proprietary rights,
                            including rights of privacy and publicity; (B)
                            violates, or encourages any conduct that would
                            violate, any applicable law or regulation or would
                            give rise to civil liability; or (C) is fraudulent,
                            false, misleading, or deceptive.{' '}
                        </li>
                        <li>
                            Licensed Content furnished hereunder may be used
                            throughout the term of this agreement. Upon
                            expiration or termination of the license period or
                            this agreement, Customer shall immediately destroy
                            all originals and copies of any Licensed Content,
                            and upon request, provide Foundation with
                            certification thereof.
                        </li>
                        <li>
                            Customer agrees to indemnify, defend, and hold
                            harmless Foundation and its licensors and providers
                            from any claim or cause of action arising out of or
                            relating to use of the Licensed Content by (i)
                            individuals or entities which have not been
                            authorized by this agreement to have access to
                            and/or use the Licensed Content and (ii) Customer,
                            when such use may be in violation of these terms.
                        </li>
                        <li>
                            Customer acknowledges that Foundation and its
                            licensors and providers make no representations or
                            warranties of any kind with respect to the accuracy,
                            current-ness, completeness, timeliness,
                            merchantability, or fitness for a particular purpose
                            of the Licensed Content or of the delivery mechanism
                            through which the Licensed Content is provided.{' '}
                        </li>
                        <li>
                            Customer agrees that Foundation and its licensors
                            and providers will never be liable for
                            consequential, incidental, special, punitive, or
                            other indirect damages, even if advised of the
                            possibility of such damages. Customer also agrees
                            that Foundation and its licensors’ and providers’
                            aggregate liability, if any, for any and all losses,
                            damages, or injuries which Customer suffers arising
                            out of any acts or omissions of Foundation in
                            connection with this agreement, regardless of the
                            cause of the loss, damage, or injury (including
                            negligence) and regardless of the nature or
                            equitable right claimed to have been violated, shall
                            never exceed the amount paid by Customer for the
                            Licensed Content or $10,000, whichever is greater.{' '}
                        </li>
                    </ol>
                    <div className="close-btn">
                        <button
                            onClick={() => this.handleCloseModal()}
                            className="btn btn-secondary btn-link">
                            close
                        </button>
                    </div>
                    <i
                        onClick={() => this.handleCloseModal()}
                        className="mdi mdi-close"></i>
                </Modal>
            </div>
        );
    }
}
