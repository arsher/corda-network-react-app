import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.scss';

export default class Footer extends React.Component {
    render() {
        return (
            <footer className="footer row bg-onyx">
                <div className="py-100">
                    <div className="col-lg-10 offset-lg-1 col-md-10 offset-md-1 col-sm-12">
                        <div className="row">
                            <div className="community col-lg-6 col-md-6 col-sm-12">
                                <h5 className="h5-community">Community</h5>
                                <p className="p-small mb-20">
                                    Corda Network Foundation expects to hold all
                                    discussions in public. Our community is
                                    centred around the Corda Network mailing
                                    list.
                                </p>
                                <a
                                    href="https://groups.io/g/corda-network"
                                    className="solo-link">
                                    Corda Network mailing list
                                </a>
                                <div className="h-splitter"></div>
                                <p className="p-small mb-20">
                                    We are happy to help on Slack - please tag
                                    @jamescarlyle or @caroquinn at #general or
                                    #corda-network channels.
                                </p>
                                <a
                                    href="http://cordaledger.slack.com"
                                    className="solo-link">
                                    Corda Slack channel
                                </a>
                            </div>
                            <div className="contact col-lg-6 col-md-6 col-sm-12">
                                <h5>Contact us</h5>
                                <p className="p-small mb-20">
                                    Please use this telephone number, hosted by
                                    the current operator R3, and ask for ‘Corda
                                    Network’:
                                </p>
                                <a
                                    href="tel:+44-207-113-1500"
                                    className="solo-link">
                                    +44 (0)207 113 1500
                                </a>
                                <div className="h-splitter"></div>
                                <p className="p-small mb-20">
                                    If you have any questions, please feel free
                                    to contact us on this email address:
                                </p>
                                <a
                                    href="mailto:info@corda.network"
                                    className="solo-link">
                                    info@corda.network
                                </a>
                            </div>
                            <div className="follow col-lg-2 offset-lg-1 col-md-2 offset-md-1 col-sm-12">
                                <h5>Follow us</h5>
                                <Link
                                    to=""
                                    className="solo-link link-with-icon medium mt-0">
                                    Medium
                                </Link>
                                <Link
                                    to=""
                                    className="solo-link link-with-icon twitter">
                                    Twitter
                                </Link>
                                <Link
                                    to=""
                                    className="solo-link link-with-icon linkedin">
                                    Linkedin
                                </Link>
                                <Link
                                    to=""
                                    className="solo-link link-with-icon rss">
                                    Rss
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        );
    }
}
