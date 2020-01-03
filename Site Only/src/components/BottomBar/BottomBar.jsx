import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import './BottomBar.scss';

class BottomBar extends React.Component {
    render() {
        const cnfPaths = [
            '',
            'about',
            'minutes',
            'governance',
            'participation',
            'policy',
            'trust-root',
            'search',
        ];
        const currentYear = new Date().getFullYear();
        const path = this.props.location.pathname.split('/')[1];

        function determineClasses() {
            let classString = 'bottom-bar container-fluid';
            if (cnfPaths.indexOf(path) !== -1) {
                classString += ' dark';
            }
            return classString;
        }
        return (
            <div className={determineClasses()}>
                <div className="row h-100">
                    <div className="col-12 box--flex center--y center--XxX">
                        <div className="copy">
                            &copy; {currentYear} Corda Network Foundation
                            Stichting.
                        </div>
                        <div className="privacy">
                            <a
                                href="mailto:info@corda.network"
                                className="solo-link link-secondary mr-30">
                                info@corda.network
                            </a>
                            <Link className="solo-link link-secondary" to="/#/policy/gdpr">
                                Privacy and Terms
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(BottomBar);
