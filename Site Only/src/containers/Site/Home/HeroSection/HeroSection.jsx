import React from 'react';
import './HeroSection.scss';
import Markdown from 'markdown-to-jsx';
import PrivacyPopup from '../../../../components/PrivacyPopup/PrivacyPopup';
import { setCookie, getCookie } from '../../../../helpers/authorizationService';
import { connect } from 'react-redux';
import { MARKDOWN_SOURCE_BASE_URL } from '../../../../utils/constant.js';

class HeroSection extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pageText: '',
            showCookiesPopup: !getCookie('CookieConsent'),
        };
    }

    componentDidMount() {
        window.scrollTo(0, 0);

        fetch(`${MARKDOWN_SOURCE_BASE_URL}/home/hero-section/hero-section.md`)
            .then((response) => response.text())
            .then((text) => {
                this.setState({
                    pageText: text,
                });
            })
            .then(() => {
                // if (this.props.uar.isUserAuthorized) {
                const regLinks = document.getElementsByClassName('reg-link');
                regLinks[0].className += ' hidden';
                // }
            });
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        if (newProps.uar.isUserAuthorized !== this.props.uar.isUserAuthorized) {
            if (newProps.uar.isUserAuthorized) {
                const regLinks = document.getElementsByClassName('reg-link');
                regLinks[0].className += ' hidden';
            }
        }
    }

    closePrivacyPopup(e) {
        if (
            !e.target.className.includes('cookies-acceptor') &&
            this.state.showCookiesPopup
        ) {
            this.setState({
                showCookiesPopup: false,
            });
        } else if (
            e.target.className.includes('cookies-acceptor') &&
            this.state.showCookiesPopup
        ) {
            setCookie('CookieConsent', true, 365, 0);
            this.setState({
                showCookiesPopup: false,
            });
        }
    }

    render() {
        return (
            <div
                onClick={(e) => this.closePrivacyPopup(e)}
                className="row hero-section">
                <div className="col-lg-6 offset-lg-1 col-md-6 offset-md-1 col-sm-12 hero-section-content">
                    <Markdown
                        children={this.state.pageText}
                        options={{
                            overrides: {
                                a: {
                                    props: {
                                        className: 'reg-link',
                                    },
                                },
                            },
                        }}
                    />
                </div>
                <div className="col-lg-4 col-md-4 col-sm-12 popup">
                    <PrivacyPopup
                        displayPrivacyPopup={this.state.showCookiesPopup}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        uar: state.uar,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(HeroSection);
