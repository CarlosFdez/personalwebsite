/**
 * Defines code compiled by webpack and imported by the browser.
 * The output gets exported to the build folder.
 * 
 * Do not import this file from the server side. 
 * Import the components directly for server side rendering.
 * 
 * Gets exported as app.js
 */

// begin by importing the libraries we're using
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { createStore, applyMiddleware, combineReducers } from "redux";
import { Provider } from 'react-redux'
import thunk from 'redux-thunk';
import logger from 'redux-logger'

import { ConnectedRouter, routerMiddleware, push } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'

// ... then import our own stuff for the webpack
import './css';
import { PortfolioSite } from "./components";
import { reducer } from "./store";


// Grab the state from the serverside injected global variable, and then allow garbage collection
// http://redux.js.org/docs/recipes/ServerRendering.html
const preloadedState = window['__PRELOADED_STATE__'];
delete window['__PRELOADED_STATE__'];

const history = createHistory();
const historyMiddleware = routerMiddleware(history);

let store = createStore(
    reducer,
    preloadedState,
    applyMiddleware(thunk, historyMiddleware, logger));

const supportsHistory = 'pushState' in window.history;

// This is the client side start script, so we use a client side router
// ConnectedRouter is the normal one - used to capture navigation events
// BrowserRouter is a fallback for forced refreshing on older browsers
if (supportsHistory) {
    ReactDOM.hydrate(
        <Provider store={store}>
            <ConnectedRouter history={history}>
                <PortfolioSite/>
            </ConnectedRouter>
        </Provider>,
        document.getElementById("website-root"), () => {});
} else {
    ReactDOM.hydrate(
        <Provider store={store}>
            <BrowserRouter forceRefresh={true}>
                <PortfolioSite/>
            </BrowserRouter>
        </Provider>,
        document.getElementById("website-root"), () => {});
}

