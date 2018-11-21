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

import { connectRouter, routerMiddleware, ConnectedRouter } from 'connected-react-router'
import createHistory from 'history/createBrowserHistory'

// ... then import our own stuff for the webpack
import './css';
import { PortfolioSite } from "./components";
import { reducer, AppState } from "./store";
import { notifyInitialized } from './store/actions';


// Grab the state from the serverside injected global variable, and then allow garbage collection
// http://redux.js.org/docs/recipes/ServerRendering.html
const preloadedState: AppState = {
    finishedInitialLoad: false,
    ...window['__PRELOADED_STATE__'] };
delete window['__PRELOADED_STATE__'];

const history = createHistory();
const historyMiddleware = routerMiddleware(history);

console.log("Preloaded state: ");
console.log(preloadedState);

let store = createStore(
    connectRouter(history)(reducer),
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

// Load complete, dispatch initialized signal
console.log("Finished hydration, sending initialization complete signal...");
store.dispatch(notifyInitialized())
