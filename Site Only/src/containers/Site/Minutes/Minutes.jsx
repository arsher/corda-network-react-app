import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Index from './Index/Index';
import I20191206 from './20191206/20191206';
import Event1 from './event-0001/event-0001';
import Event7 from './event-0007/event-0007';
import Event8 from './event-0008/event-0008';

export default class Minutes extends React.Component {
    render() {
        const { match } = this.props;

        return (
            <Switch>
                <Route path={`${match.url}/index`} component={Index} />
                <Route path={`${match.url}/20191206`} component={I20191206} />
                <Route path={`${match.url}/event-0001`} component={Event1} />
                <Route path={`${match.url}/event-0007`} component={Event7} />
                <Route path={`${match.url}/event-0008`} component={Event8} />
            </Switch>
        );
    }
}
