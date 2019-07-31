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

import { routerMiddleware, ConnectedRouter } from 'connected-react-router'
import { createBrowserHistory } from 'history'

// ... then import our own stuff for the webpack
import './css';
import { PortfolioSite } from "./components";
import { createRootReducer, AppState } from "./store";
import { notifyInitialized } from './store/actions';


// Grab the state from the serverside injected global variable, and then allow garbage collection
// http://redux.js.org/docs/recipes/ServerRendering.html
const preloadedState: AppState = { portfolio: { finishedInitialLoad: false }, ...window['__PRELOADED_STATE__'] };
delete window['__PRELOADED_STATE__'];

const history = createBrowserHistory();
const historyMiddleware = routerMiddleware(history);

console.log("Preloaded state (from server render): ");
console.log(preloadedState);

let store = createStore(
    createRootReducer(history),
    preloadedState,
    applyMiddleware(thunk, historyMiddleware, logger));

/**
 * Renders component by hydrating it to the existing content.
 * @param Component the main site component
 */
function render(Component) {
    const supportsHistory = 'pushState' in window.history;

    // This is the client side start script, so we use a client side router
    // ConnectedRouter is the normal one - used to capture navigation events
    // BrowserRouter is a fallback for forced refreshing on older browsers
    if (supportsHistory) {
        ReactDOM.hydrate(
            <Provider store={store}>
                <ConnectedRouter history={history}>
                    <Component/>
                </ConnectedRouter>
            </Provider>,
            document.getElementById("website-root"), () => {});
    } else {
        ReactDOM.hydrate(
            <Provider store={store}>
                <BrowserRouter forceRefresh={true}>
                    <Component/>
                </BrowserRouter>
            </Provider>,
            document.getElementById("website-root"), () => {});
    }
}

// Perform the initial render
render(PortfolioSite);

// Load complete, dispatch initialized signal
console.log("Finished hydration, sending initialization complete signal...");
store.dispatch(notifyInitialized())

// This is needed for Hot Module Replacement
// Note: We do module as any because of "Property 'hot' does not exist on type 'NodeModule'."
// The above error does not happen on initial compile, only recompilations...
if ((module as any).hot) {
    // note: THIS FAILS if 'webpack-hot-middleware/client' is not enabled in webpack
    console.log("Preparing hot module reloading");
    (module as any).hot.accept('./components', () => {
        console.log("Re-rendering site using new main site component");
        render(require("./components").PortfolioSite);
    });
}