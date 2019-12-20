import React from 'react';
import { Route, Switch } from 'react-router-dom';
import CordaNetworkFoundation from './CordaNetworkFoundation/CordaNetworkFoundation';
import Guidelines from './Guidelines/Guidelines';
import Articles from './Articles/Articles';
import ByLaws from './ByLaws/ByLaws';
import BoardElection from './BoardElection/BoardElection';
import Events from './Events/Events';

export default class Governance extends React.Component {
    render() {
        const { match } = this.props;

        return (
            <Switch>
                <Route
                    path={`${match.url}/index`}
                    component={CordaNetworkFoundation}
                />
                <Route
                    path={`${match.url}/governance-guidelines`}
                    component={Guidelines}
                />
                <Route path={`${match.url}/articles`} component={Articles} />
                <Route path={`${match.url}/bylaws`} component={ByLaws} />
                <Route
                    path={`${match.url}/board-election`}
                    component={BoardElection}
                />
                <Route path={`${match.url}/events`} component={Events} />
            </Switch>
        );
    }
}
