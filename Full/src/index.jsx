import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import legalEntityReducer from './store/reducers/legalEntity';
import loaderReducer from './store/reducers/loader';
import currentStepReducer from './store/reducers/currentStep';
import participantTypeReducer from './store/reducers/participantType';
import billingDetailsReducer from './store/reducers/billingDetails';
import userAuthorizationReducer from './store/reducers/authorization';
import userProfileReducer from './store/reducers/userProfile';
import signedTermsReducer from './store/reducers/terms';
import createNodeReducer from './store/reducers/createNode';
import directUserNodesReducer from './store/reducers/directUserNodes';
import sponsorCurrentStepReducer from './store/reducers/sponsorCurrentStep';
import sponsoredParticipantsTableReducer from './store/reducers/sponsoredParticipantsTable';
import sponsoredLegalEntityReducer from './store/reducers/sponsoredLegalEntity';

const rootReducer = combineReducers({
    ler: legalEntityReducer,
    loader: loaderReducer,
    csr: currentStepReducer,
    ptr: participantTypeReducer,
    bdr: billingDetailsReducer,
    uar: userAuthorizationReducer,
    upr: userProfileReducer,
    str: signedTermsReducer,
    cnr: createNodeReducer,
    dnr: directUserNodesReducer,
    sponsorCurrentStepReducer: sponsorCurrentStepReducer,
    sponsoredParticipantsTableReducer: sponsoredParticipantsTableReducer,
    sponsoredLegalEntityReducer: sponsoredLegalEntityReducer,
});

const store = createStore(
    rootReducer
    // TODO: in development install the browser extension Redux dev tools or comment next line
    // window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()
);

ReactDOM.render(
    <BrowserRouter>
        <Provider store={store}>
            <App />
        </Provider>
    </BrowserRouter>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
