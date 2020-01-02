import React from 'react';
import { Route, Switch } from 'react-router-dom';
import TrustRootIndex from './TrustRootIndex/TrustRootIndex';
import CertificatePolicy from './CertificatePolicy/CertificatePolicy';
import CertificatePractice from './CertificationPractice/CertificationPractice';

export default class TrustRoot extends React.Component {
    render() {
        const { match } = this.props;

        return (
            <Switch>
                <Route path={`${match.url}/index`} component={TrustRootIndex} />
                <Route
                    path={`${match.url}/certificate-policy`}
                    component={CertificatePolicy}
                />
                <Route
                    path={`${match.url}/certificate-practices`}
                    component={CertificatePractice}
                />
            </Switch>
        );
    }
}
