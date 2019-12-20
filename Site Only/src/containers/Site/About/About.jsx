import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Concepts from './Concepts/Concepts';
import BusinessNetworks from './BusinessNetworks/BusinessNetworks';
import BusinessNetworksToolkit from './BusinessNetworksToolkit/BusinessNetworksToolkit';
import News from './News/News';
import Contact from './Contact/Contact';
import Faq from './Faq/Faq';

export default class About extends React.Component {
    render() {
        const { match } = this.props;

        return (
            <Switch>
                <Route path={`${match.url}/concepts`} component={Concepts} />
                <Route
                    path={`${match.url}/business-networks`}
                    component={BusinessNetworks}
                />
                <Route
                    path={`${match.url}/businessnetworkstoolkit`}
                    component={BusinessNetworksToolkit}
                />
                <Route path={`${match.url}/news`} component={News} />
                <Route path={`${match.url}/contact`} component={Contact} />
                <Route path={`${match.url}/faq`} component={Faq} />
            </Switch>
        );
    }
}
