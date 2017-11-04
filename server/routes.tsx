import * as express from 'express';
import * as React from 'react';
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'

import { createStore } from '../assets/src/store'
import { PortfolioSite } from '../assets/src/components'

import { Portfolio } from './portfolio'
import ApiClient from '../lib/apiclient';

// two functions are available: registerApiRoutes and registerRoutes

export function registerApiRoutes(app : express.Application, portfolio : Portfolio) {

    app.get('/api/blog/', async (req, res) => {
        var system = portfolio.blog;
        var items = system.loadItems();
        var data = { items: Array.from(items).reverse() };
        res.json(data);
    })

    app.get('/api/blog/:id', async (req, res) => {
        var system = portfolio.blog;
        var itemData = await system.loadItem(req.params.id);
        if (itemData == null) {
            res.sendStatus(404);
            return;
        }
        
        res.json({ item: itemData });
    })

    // api fallthrough. Show 404
    app.get('/api/*', (req, res) => {
        res.sendStatus(404);
    });
}

export function registerRoutes(app : express.Application, portfolio, api: ApiClient) {

    /**
     * Performs a server side rendering on the base page
     * @param req 
     * @param res 
     */
    function serverRender(req, res, initialState?) {
        var ctx = initialState || {};
        const html = renderToString(
            <StaticRouter location={req.url} context={ctx}>
                <PortfolioSite/>
            </StaticRouter>);
            
        const data = { renderedHtml: html, initialState: initialState };
        res.render('base.html', data);
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

    app.get("/blog", async (req, res) => {
        var data = await api.getBlogBriefs();
        serverRender(req, res, data);
    });

    // matches slug strings. 25-I-dont-care will match 25 as the id
    app.get('/blog/:article_id(\\d+)(-[-0-9A-Za-z]+)?', async (req, res) => {
       let id = req.params.article_id;
       var data = await api.getBlogArticle(id);
       serverRender(req, res, data);
    });

    // fallback global rendering.
    // This is most likely a 404, so we still use server side rendering
    app.use((req, res) => {
        serverRender(req, res);
    });


}