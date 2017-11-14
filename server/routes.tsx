import * as express from 'express';
import * as React from 'react';
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'

import { createStore } from "redux";
import { Provider } from 'react-redux'
import { AppState, reducer, initialState } from "../assets/src/store";


import { Portfolio } from './portfolio'
import { ApiClient, HttpError } from '../lib/apiclient';
import { PortfolioSite } from '../assets/src/components'
import { loaded } from '../assets/src/store';

// two functions are available: registerApiRoutes and registerRoutes

/** Creates an express rule to match :idName-rest-of-url */
let slugRouteRule = (idName) => `:${idName}(\\d+)(-[-0-9A-Za-z]+)?`;

interface AsyncRequestHandler extends express.RequestHandler {
    (req: express.Request, res : express.Response, next: express.NextFunction): Promise<any>;
}

/**
 * Wraps an asynchronous request handler, transforming it to a synchronous one.
 * This catches uncaught errors from the async one and calls next(err)
 */
function wrapAsync(fn: AsyncRequestHandler) : express.RequestHandler {
    return (req, res, next) => {
        let promise = fn(req, res, next);
        promise.catch((err) => next(err));
    }
}

/** Consumes an async iterator into memory */
async function asyncToList<T>(iter : AsyncIterableIterator<T>) : Promise<T[]> {
    let results = [];
    for await (var item of iter) {
        results.push(item);
    }
    return results;
}


export function registerApiRoutes(app : express.Application, portfolio : Portfolio) {

    app.get('/api/blog/', wrapAsync(async (req, res) => {
        var system = portfolio.blog;
        var items = await asyncToList(system.loadItemsReverse());
        
        var data = { items: items };
        res.json(data);
    }));

    app.get(`/api/blog/${slugRouteRule('id')}`, wrapAsync(async (req, res) => {
        var system = portfolio.blog;
        var itemData = await system.loadItem(req.params.id);
        if (itemData == null) {
            res.sendStatus(404);
            return;
        }
        
        res.json({ item: itemData });
    }));

    // api fallthrough. Show 404
    app.get('/api/*', (req, res) => {
        res.sendStatus(404);
    });

    // Register the api global error handler at the end after all the routes
    app.use("/api/", function (err, req, res, next) {
        // todo: if err.statusCode is 403 or something else, do that instead
        console.error(err.stack);
        res.status(500).send('Something broke!');
    });
}

export function registerRoutes(app : express.Application, portfolio, api: ApiClient) {

    /**
     * Performs a server side rendering on the base page
     * @param req 
     * @param res 
     */
    function serverRender(req, res, data? : Partial<AppState>) {
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
            initialState: store.getState() 
        });
    }

    /** 
     * Performs a client side render. Basically just exports the raw template.
     * */
    function clientRender(req : express.Request, res : express.Response) {
        res.render("base.html");
    }

    app.get("/", (req, res) => {
        serverRender(req, res);
    })

    app.get("/rss.xml", (req, res) => {
        res.send("oops, not quite working yet");
    });

    app.get("/blog", wrapAsync(async (req, res) => {
        var items = await api.getBlogBriefs();
        serverRender(req, res, { articleList: loaded(items) });
    }));

    // matches slug strings. 25-I-dont-care will match 25 as the id
    app.get(`/blog/${slugRouteRule('article_id')}`, wrapAsync(async (req, res) => {
       let id = req.params.article_id;
       var data = await api.getBlogArticle(id);
       serverRender(req, res, { article: loaded(data) });
    }));

    // fallback global rendering.
    // This is most likely a 404, so we still use server side rendering
    app.use((req, res) => {
        // todo: this is triggering on lookups for favicon.png
        // rethink this? 
        serverRender(req, res);
    });

    // Register the global error handler at the end after all the routes
    app.use(function (err, req, res, next) {
        // todo: if err.statusCode is 403 or something else, do that instead
        console.error(err.stack);
        res.status(500);

        let error = new HttpError("Something broke", 500);
        serverRender(req, res, { error: error});
    });
}