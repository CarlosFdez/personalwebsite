import * as fs from 'fs';
import * as express from 'express';
import * as path from 'path';

import * as React from 'react';
import { StaticRouter } from 'react-router'
import { renderToString } from 'react-dom/server'
import { createStore } from "redux";
import { Provider } from 'react-redux'
import { AppState, reducer, initialState } from "../assets/src/store";

import { PortfolioSite } from '../assets/src/components'

// loads the manifest data synchronously.
// Manifest data lets us capture the hash for cache busting
var assetMap = {};

try {
    let location = path.join(__dirname, '../assets/webpack-manifest.json')
    let data = fs.readFileSync(location, 'utf8');
    assetMap = JSON.parse(data);
    console.log("loaded webpack manifest for asset mapping");
} catch (err) {
    console.error("Failed to load webpack manifest for asset mapping");
    console.error(err);
}

function getAsset(filename : string) {
    filename = assetMap[filename] || filename;
    return `/assets/build/${filename}`;
}


/**
 * Performs a server side rendering on the base page
 * @param req 
 * @param res 
 */
export function serverRender(req, res, data? : Partial<AppState>) {
    var ctx = data || {};

    let state : AppState = {...initialState, ...data};
    let store = createStore<AppState>(reducer, state);
    
    const html = renderToString(
        <Provider store={store}>
            <StaticRouter location={req.url} context={ctx}>
                <PortfolioSite/>
            </StaticRouter>
        </Provider>);

    res.render('base.html', { 
        renderedHtml: html, 
        initialState: store.getState(),
        getAsset: getAsset
    });
}

/** 
 * Performs a client side render. Basically just exports the raw template.
 * */
export function clientRender(req : express.Request, res : express.Response) {
    res.render("base.html");
}