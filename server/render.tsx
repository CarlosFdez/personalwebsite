import * as fs from 'fs';
import * as express from 'express';
import * as path from 'path';
import * as url from 'url';

import * as React from 'react';
import { StaticRouter } from 'react-router';
import { renderToString } from 'react-dom/server';
import { createStore } from "redux";
import { Provider } from 'react-redux';
import * as DocumentTitle from 'react-document-title';

import { AppState, reducer, initialState } from "../assets/src/store";
import { PortfolioSite } from '../assets/src/components';

/**
 * Returns a function that returns the path to an asset in the build folder, using the manifest for cache busting
 * @param manifestLocation
 */
function createAssetLoader(manifestLocation) {
    // loads the manifest data synchronously.
    // Manifest data lets us capture the hash for cache busting
    var assetMap = {};

    try {
        let data = fs.readFileSync(manifestLocation, 'utf8');
        assetMap = JSON.parse(data);
        console.log("loaded webpack manifest for asset mapping");
    } catch (err) {
        console.error("Failed to load webpack manifest for asset mapping");
        console.error(err);
    }

    return function getAsset(filename : string) {
        filename = assetMap[filename] || filename;
        return `/assets/build/${filename}`;
    }
}

const getAsset = createAssetLoader(path.join(__dirname, '../assets/webpack-manifest.json'));

/**
 * Returns an absolute url from the hosting website
 * @param relativeUrl 
 */
const getAbsoluteUrl = (relativeUrl) => (
    url.resolve("http://supetroupe.com", relativeUrl)
); 


/**
 * Defines metadata used to create the title and the meta tags.
 */
export interface MetaData {
    path: string
    author : string
    description : string
    keywords : string[]
    websiteName : string
}

/**
 * Performs a server side rendering on the base page
 * @param req 
 * @param res 
 */
export function serverRender(req, res, meta: MetaData, data? : Partial<AppState>) {
    var ctx = {};

    let state : AppState = {...initialState, ...data};
    let store = createStore(reducer, state);
    
    const html = renderToString(
        <Provider store={store}>
            <StaticRouter location={req.url} context={ctx}>
                <PortfolioSite/>
            </StaticRouter>
        </Provider>);
    const title = DocumentTitle.rewind()

    res.render('base.html', { 
        renderedHtml: html, 
        title: title,
        meta: meta,
        initialState: store.getState(),
        getAsset: getAsset,
        getAbsoluteUrl : getAbsoluteUrl
    });
}

/** 
 * Performs a client side render. Basically just exports the raw template.
 * */
export function clientRender(req : express.Request, res : express.Response, meta: MetaData) {
    res.render("base.html", { 
        title: "Carlos Fernandez", 
        meta, getAsset, getAbsoluteUrl
    });
}