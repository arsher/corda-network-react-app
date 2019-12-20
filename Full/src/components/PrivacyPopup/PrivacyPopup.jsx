import React from 'react';
import './PrivacyPopup.scss';

export default class PrivacyPopup extends React.Component {

    render() {
        return this.props.displayPrivacyPopup ? (
            <div className="privacy-popup">
                <div className="title">Your Privacy</div>
                <p className="content m-0">
                    We user cookies to improve your experience on our site. To
                    find out more, read our privacy policy.
                </p>
                <button className="btn btn-secondary m-0 cookies-acceptor">
                    Ok
                </button>
            </div>
        ) : null;
    }
}
