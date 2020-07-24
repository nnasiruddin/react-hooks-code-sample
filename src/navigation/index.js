import React from "react";
import { Security, SecureRoute, LoginCallback } from '@okta/okta-react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from 'react-router-dom';
import * as authConstants from '../constants/auth';
import { AppContextProvider } from '../context/App';
import Header from '../components/Header';
import LandingPage from '../pages/LandingPage';
import CustomTypeForm from "../pages/Typeform";

function Navigation () {
    const auth = {
        issuer: authConstants.OKTA_ISSUER_URL,
        client_id: authConstants.OKTA_CLIENT_ID,
        redirect_uri: authConstants.OKTA_REDIRECT_URL,
        scope: ['openid', 'email', 'profile', 'address', 'phone', 'offline_access', 'groups'],
        pkce: false,
    };
    return (
        <Router>
            <Security {...auth} >
                <AppContextProvider>
                    <Header/>
                    <Switch>
                        <SecureRoute exact path='/' component={LandingPage} />
                        <Route path='/typeform' component={CustomTypeForm} />
                        <Route path={authConstants.IMPLICIT_CALLBACK_URL} component={LoginCallback} />
                    </Switch>
                </AppContextProvider>
            </Security>
        </Router>
    )
}

export default Navigation;
