/**
 * Defines code compiled by webpack and imported by the browser.
 * The output gets exported to the build folder.
 * 
 * Do not import this code from the server side. 
 * Import the components directly for server side rendering.
 * 
 * Gets exported as app.js
 */

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter} from 'react-router-dom';
import { Provider } from 'react-redux'

import { createStore, applyMiddleware } from "redux";
import thunk from 'redux-thunk';


import './css';
import './js/main.js';

import { PortfolioSite } from "./components";
import { reducer } from "./store";

// Grab the state from the injected global variable, and then allow garbage collection
// http://redux.js.org/docs/recipes/ServerRendering.html
const preloadedState = window['__PRELOADED_STATE__'];
delete window['__PRELOADED_STATE__'];

let store = createStore(reducer, preloadedState, applyMiddleware(thunk));

const supportsHistory = 'pushState' in window.history;

// This is the client side start script, so we use BrowserRouter
ReactDOM.hydrate(
    <Provider store={store}>
        <BrowserRouter forceRefresh={!supportsHistory}>
            <PortfolioSite/>
        </BrowserRouter>
    </Provider>,
    document.getElementById("website-root"), () => {});
    

