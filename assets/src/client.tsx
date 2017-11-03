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

import './css';
import './js/main.js';

import { createStore } from "./store";
import { PortfolioSite } from "./components";

const supportsHistory = 'pushState' in window.history;

let initialState = window['__INITIAL_STATE'];
let store = createStore(initialState);

// This is the client side start script, so we use BrowserRouter
ReactDOM.hydrate(
    <BrowserRouter forceRefresh={!supportsHistory}>
        <PortfolioSite/>
    </BrowserRouter>,
    document.getElementById("website-root"), () => {});