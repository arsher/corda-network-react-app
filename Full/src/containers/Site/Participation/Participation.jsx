import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PreJoining from './PreJoining/PreJoining';
import MembershipTiers from './MembershipTiers/MembershipTiers';
import NotaryConsiderations from './NotaryConsiderations/NotaryConsiderations';
import NetworkParamsSchedule from './NetworkParamsSchedule/NetworkParamsSchedule';
import PreProd from './PreProd/PreProd';
import ProcessToJoin from './ProcessToJoin/ProcessToJoin';
import DistinguishedName from './DistinguishedName/DistinguishedName';
import LegalEntityName from './LegalEntityName/LegalEntityName';
import TermsOfUsePage from './TermsOfUsePage/TermsOfUsePage';
import JoinDirectOrSponsor from './JoinDirectOrSponsor/JoinDirectOrSponsor';
import DecideNetwork from './DecideNetwork/DecideNetwork';

export default class Participation extends React.Component {
    render() {
        const { match } = this.props;

        return (
            <Switch>
                <Route
                    path={`${match.url}/pre-joining`}
                    component={PreJoining}
                />
                <Route
                    path={`${match.url}/join-directly-or-as-sponsor`}
                    component={JoinDirectOrSponsor}
                />
                <Route
                    path={`${match.url}/network-choice`}
                    component={DecideNetwork}
                />
                <Route
                    path={`${match.url}/membership-tiers`}
                    component={MembershipTiers}
                />
                <Route
                    path={`${match.url}/notary-considerations`}
                    component={NotaryConsiderations}
                />
                <Route
                    path={`${match.url}/networkparamsschedule`}
                    component={NetworkParamsSchedule}
                />
                <Route path={`${match.url}/preprod`} component={PreProd} />
                <Route path={`${match.url}/index`} component={ProcessToJoin} />
                <Route
                    path={`${match.url}/distinguishedname`}
                    component={DistinguishedName}
                />
                <Route
                    path={`${match.url}/legalentity`}
                    component={LegalEntityName}
                />
                <Route
                    path={`${match.url}/terms-of-use`}
                    component={TermsOfUsePage}
                />
            </Switch>
        );
    }
}
