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

import * as env from './environment';

import { createMemoryHistory } from 'history';
import { AppState, PortfolioState, initialState, initialPortfolioState, createRootReducer } from "../assets/src/store";
import { PortfolioSite } from '../assets/src/components';

/**
 * Returns a function that returns the path to an asset in the build folder, using the manifest for cache busting
 * @param manifestLocation
 */
function createAssetLoader(manifestLocation) {
    // loads the manifest data synchronously..
    // Manifest data lets us capture the hash for cache busting
    var assetMap = {};

    if (env.settings.isProduction) {
        try {
            let data = fs.readFileSync(manifestLocation, 'utf8');
            assetMap = JSON.parse(data);
            console.log("loaded webpack manifest for asset mapping");
        } catch (err) {
            console.error("Failed to load webpack manifest for asset mapping");
            console.error(err);
        }
    } else {
        console.log("Skipping manifest, unused in development mode");
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
export function serverRender(req, res: express.Response, meta: MetaData, data? : Partial<PortfolioState>) {
    var ctx: any = {};

    let portfolioState = { ...initialPortfolioState, ...data }
    let state : AppState = {...initialState, portfolio: portfolioState};

    let history = createMemoryHistory({initialEntries: [req.url]});
    let store = createStore(createRootReducer(history), state);
    
    const html = renderToString(
        <Provider store={store}>
            <StaticRouter location={req.url} context={ctx}>
                <PortfolioSite/>
            </StaticRouter>
        </Provider>);
    const title = DocumentTitle.rewind()

    // is404 is populated by the NotFound component
    if (ctx.is404) {
        res.status(404);
    }

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